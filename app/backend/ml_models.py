"""Random Forest + ARIMA hybrid forecaster for cotton prices."""
import warnings
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from statsmodels.tsa.arima.model import ARIMA

warnings.filterwarnings("ignore")


def _prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.sort_values("date").reset_index(drop=True).copy()
    df["date"] = pd.to_datetime(df["date"])
    df["dow"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month
    df["doy"] = df["date"].dt.dayofyear
    df["lag1"] = df["price"].shift(1)
    df["lag7"] = df["price"].shift(7)
    df["lag30"] = df["price"].shift(30)
    df["roll7"] = df["price"].rolling(7).mean()
    df["roll30"] = df["price"].rolling(30).mean()
    return df.dropna().reset_index(drop=True)


FEATURES = ["dow", "month", "doy", "lag1", "lag7", "lag30", "roll7", "roll30",
            "rainfall_mm", "yield_q_per_ha", "demand_index", "inflation_pct"]


def forecast(prices_df: pd.DataFrame, horizon: int = 30) -> dict:
    """Return hybrid forecast dict.
    prices_df: columns date, price, rainfall_mm, yield_q_per_ha, demand_index, inflation_pct
    """
    df = _prepare_features(prices_df)
    if len(df) < 60:
        raise ValueError("Not enough data")

    X = df[FEATURES].values
    y = df["price"].values

    # Random Forest on features
    rf = RandomForestRegressor(n_estimators=180, max_depth=14, random_state=42, n_jobs=-1)
    rf.fit(X, y)

    # ARIMA on price series
    try:
        arima_res = ARIMA(y, order=(2, 1, 2)).fit()
        arima_forecast = arima_res.forecast(steps=horizon)
    except Exception:
        arima_forecast = np.repeat(y[-1], horizon)

    # Recursively predict with RF using last known exogenous stats
    last = df.iloc[-1].copy()
    hist = list(y)
    rf_preds = []
    cur_date = last["date"]
    for step in range(horizon):
        cur_date = cur_date + pd.Timedelta(days=1)
        lag1 = hist[-1]
        lag7 = hist[-7] if len(hist) >= 7 else hist[-1]
        lag30 = hist[-30] if len(hist) >= 30 else hist[-1]
        roll7 = float(np.mean(hist[-7:]))
        roll30 = float(np.mean(hist[-30:]))
        feats = np.array([[
            cur_date.dayofweek, cur_date.month, cur_date.dayofyear,
            lag1, lag7, lag30, roll7, roll30,
            float(last["rainfall_mm"]), float(last["yield_q_per_ha"]),
            float(last["demand_index"]), float(last["inflation_pct"]),
        ]])
        p = float(rf.predict(feats)[0])
        rf_preds.append(p)
        hist.append(p)

    rf_arr = np.array(rf_preds)
    ar_arr = np.array(arima_forecast)
    # Hybrid 60/40 weighting
    hybrid = 0.6 * rf_arr + 0.4 * ar_arr

    # confidence via residual std on training
    resid_std = float(np.std(y - rf.predict(X)))
    lower = hybrid - 1.96 * resid_std * np.sqrt(np.arange(1, horizon + 1) / 8)
    upper = hybrid + 1.96 * resid_std * np.sqrt(np.arange(1, horizon + 1) / 8)

    current = float(y[-1])
    predicted = float(hybrid[-1])
    change_pct = (predicted - current) / current * 100

    if change_pct > 1.5:
        trend = "Bullish"
        recommendation = "HOLD"
    elif change_pct < -1.5:
        trend = "Bearish"
        recommendation = "SELL"
    else:
        trend = "Stable"
        recommendation = "WAIT"

    # probability rise/fall using bootstrap over daily model residuals
    daily_returns = np.diff(y[-90:]) / y[-90:-1]
    sim_end = []
    rng = np.random.default_rng(7)
    for _ in range(400):
        p = current
        for _ in range(horizon):
            p = p * (1 + rng.choice(daily_returns))
        sim_end.append(p)
    sim_end = np.array(sim_end)
    prob_rise = float((sim_end > current).mean())
    prob_fall = 1 - prob_rise

    # confidence -> based on relative residual band
    confidence = float(max(50.0, min(95.0, 100 - (resid_std / current) * 100 * 3)))

    # Feature importance
    imp = dict(zip(FEATURES, rf.feature_importances_.astype(float)))

    # Build daily forecast list
    forecast_days = []
    last_date = df.iloc[-1]["date"]
    for i in range(horizon):
        d = last_date + pd.Timedelta(days=i + 1)
        forecast_days.append({
            "date": d.date().isoformat(),
            "price": float(round(hybrid[i], 2)),
            "lower": float(round(lower[i], 2)),
            "upper": float(round(upper[i], 2)),
            "rf": float(round(rf_arr[i], 2)),
            "arima": float(round(ar_arr[i], 2)),
        })

    suggested_low = float(round(predicted * 0.99, 2))
    suggested_high = float(round(predicted * 1.02, 2))

    return {
        "current_price": round(current, 2),
        "predicted_price": round(predicted, 2),
        "expected_range": {"low": float(round(min(lower), 2)), "high": float(round(max(upper), 2))},,
        "trend": trend,
        "confidence": round(confidence, 1),
        "probability_rise": round(prob_rise * 100, 1),
        "probability_fall": round(prob_fall * 100, 1),
        "recommendation": recommendation,
        "suggested_price_range": {"low": suggested_low, "high": suggested_high},
        "change_pct": round(change_pct, 2),
        "horizon_days": horizon,
        "forecast": forecast_days,
        "feature_importance": {k: round(v, 4) for k, v in imp.items()},
    }
