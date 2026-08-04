from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import uuid
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
import pandas as pd

from data_generator import generate_history, get_mandis, get_varieties
from ml_models import forecast as run_forecast
from auth import hash_password, verify_password, create_token, get_current_user_id

from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

app = FastAPI(title="Cotton AI Market Intelligence")
api = APIRouter(prefix="/api")

# In-memory data cache
DATA_CACHE: List[dict] = []


def _get_df(mandi_id: Optional[str] = None, variety_id: Optional[str] = None) -> pd.DataFrame:
    df = pd.DataFrame(DATA_CACHE)
    if mandi_id:
        df = df[df["mandi_id"] == mandi_id]
    if variety_id:
        df = df[df["variety_id"] == variety_id]
    return df.reset_index(drop=True)


# ---------- Models ----------
class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "farmer"  # farmer | trader


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str


class PredictIn(BaseModel):
    mandi_id: str
    variety_id: str
    horizon_days: int = 30


class InsightIn(BaseModel):
    mandi_id: str
    variety_id: str
    forecast_summary: dict


class WatchlistIn(BaseModel):
    mandi_id: str
    variety_id: str


# ---------- Auth ----------
@api.post("/auth/register")
async def register(body: RegisterIn):
    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    if body.role not in ("farmer", "trader"):
        raise HTTPException(status_code=400, detail="Invalid role")
    user = {
        "id": str(uuid.uuid4()),
        "name": body.name,
        "email": body.email.lower(),
        "password_hash": hash_password(body.password),
        "role": body.role,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user)
    token = create_token(user["id"], user["email"])
    return {"token": token, "user": UserOut(**user).model_dump()}


@api.post("/auth/login")
async def login(body: LoginIn):
    user = await db.users.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user["id"], user["email"])
    return {"token": token, "user": UserOut(**user).model_dump()}


@api.get("/auth/me", response_model=UserOut)
async def me(user_id: str = Depends(get_current_user_id)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut(**user)


# ---------- Reference data ----------
@api.get("/mandis")
async def mandis():
    return get_mandis()


@api.get("/varieties")
async def varieties():
    return get_varieties()


# ---------- Prices ----------
@api.get("/prices/historical")
async def historical(
    mandi_id: str = Query(...),
    variety_id: str = Query(...),
    days: int = Query(365, ge=30, le=730),
):
    df = _get_df(mandi_id, variety_id)
    if df.empty:
        raise HTTPException(404, "No data for filter")
    df = df.sort_values("date").tail(days)
    return {
        "series": df[["date", "price", "rainfall_mm", "yield_q_per_ha",
                       "demand_index", "inflation_pct"]].to_dict(orient="records")
    }


@api.get("/market/overview")
async def market_overview():
    """Latest price + 7d change per mandi (Shankar-6)."""
    df = pd.DataFrame(DATA_CACHE)
    df = df[df["variety_id"] == "shankar6"].sort_values("date")
    out = []
    for m in get_mandis():
        sub = df[df["mandi_id"] == m["id"]].tail(14)
        if len(sub) < 8:
            continue
        latest = float(sub.iloc[-1]["price"])
        wk_ago = float(sub.iloc[-8]["price"])
        change = (latest - wk_ago) / wk_ago * 100
        out.append({
            "mandi_id": m["id"], "mandi": m["name"], "state": m["state"],
            "price": round(latest, 2), "change_pct_7d": round(change, 2),
        })
    out.sort(key=lambda x: x["price"], reverse=True)
    return {"mandis": out, "as_of": datetime.now(timezone.utc).isoformat()}


# ---------- Prediction ----------
@api.post("/predict")
async def predict(body: PredictIn, user_id: str = Depends(get_current_user_id)):
    df = _get_df(body.mandi_id, body.variety_id)
    if df.empty:
        raise HTTPException(404, "No data")
    try:
        result = run_forecast(df, horizon=body.horizon_days)
    except Exception as e:
        raise HTTPException(500, f"Forecast failed: {e}")
    # attach recent historical (last 90d) for chart
    hist = df.sort_values("date").tail(90)[["date", "price"]].to_dict(orient="records")
    result["history"] = hist
    result["mandi_id"] = body.mandi_id
    result["variety_id"] = body.variety_id
    return result


# ---------- AI Insights (Claude) ----------
@api.post("/insights")
async def insights(body: InsightIn, user_id: str = Depends(get_current_user_id)):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "LLM key not configured")
    fs = body.forecast_summary
    system = (
        "You are a seasoned Indian cotton market analyst advising farmers and traders. "
        "Be concise, practical, avoid jargon. Prices are in Indian Rupees (₹) per quintal. "
        "Give 3 short paragraphs: (1) market snapshot, (2) key drivers, (3) actionable advice. "
        "Do not use bullet lists or markdown headers."
    )
    prompt = (
        f"Mandi: {body.mandi_id}, Variety: {body.variety_id}. "
        f"Current price: ₹{fs.get('current_price')}. Predicted ({fs.get('horizon_days')}d): ₹{fs.get('predicted_price')}. "
        f"Trend: {fs.get('trend')}. Confidence: {fs.get('confidence')}%. "
        f"Rise probability: {fs.get('probability_rise')}%. Fall probability: {fs.get('probability_fall')}%. "
        f"Recommendation: {fs.get('recommendation')}. "
        f"Suggested selling range: ₹{fs.get('suggested_price_range',{}).get('low')}–₹{fs.get('suggested_price_range',{}).get('high')}. "
        f"Feature importance (top drivers): {fs.get('feature_importance')}. "
        "Explain in plain English for a cotton farmer."
    )
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"insight-{user_id}-{body.mandi_id}-{body.variety_id}",
            system_message=system,
        ).with_model("anthropic", "claude-sonnet-4-6")
        reply = await chat.send_message(UserMessage(text=prompt))
        return {"insight": reply}
    except Exception as e:
        raise HTTPException(500, f"AI insight failed: {e}")


# ---------- Watchlist ----------
@api.get("/watchlist")
async def get_watchlist(user_id: str = Depends(get_current_user_id)):
    items = await db.watchlist.find({"user_id": user_id}, {"_id": 0}).to_list(200)
    return {"items": items}


@api.post("/watchlist")
async def add_watchlist(body: WatchlistIn, user_id: str = Depends(get_current_user_id)):
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "mandi_id": body.mandi_id,
        "variety_id": body.variety_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.watchlist.insert_one(doc)
    return {"ok": True, "item": {k: v for k, v in doc.items() if k != "_id"}}


@api.delete("/watchlist/{item_id}")
async def delete_watchlist(item_id: str, user_id: str = Depends(get_current_user_id)):
    await db.watchlist.delete_one({"id": item_id, "user_id": user_id})
    return {"ok": True}


@api.get("/")
async def root():
    return {"service": "Cotton AI", "status": "ok"}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cotton-ai")


@app.on_event("startup")
async def startup():
    global DATA_CACHE
    logger.info("Generating synthetic cotton market data...")
    DATA_CACHE = generate_history(days=730)
    logger.info(f"Loaded {len(DATA_CACHE)} price records")


@app.on_event("shutdown")
async def shutdown():
    client.close()
