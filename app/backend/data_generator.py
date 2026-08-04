"""Synthetic realistic cotton market data generator for Indian mandis."""
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List

# Indian cotton mandis with base price levels (INR per quintal) and states
MANDIS = [
    {"id": "rajkot", "name": "Rajkot", "state": "Gujarat", "base": 7150},
    {"id": "adilabad", "name": "Adilabad", "state": "Telangana", "base": 7050},
    {"id": "warangal", "name": "Warangal", "state": "Telangana", "base": 7100},
    {"id": "guntur", "name": "Guntur", "state": "Andhra Pradesh", "base": 7000},
    {"id": "yavatmal", "name": "Yavatmal", "state": "Maharashtra", "base": 6950},
    {"id": "aurangabad", "name": "Aurangabad", "state": "Maharashtra", "base": 6900},
    {"id": "sirsa", "name": "Sirsa", "state": "Haryana", "base": 7250},
    {"id": "bathinda", "name": "Bathinda", "state": "Punjab", "base": 7300},
]

VARIETIES = [
    {"id": "shankar6", "name": "Shankar-6", "premium": 1.00},
    {"id": "j34", "name": "J-34", "premium": 0.97},
    {"id": "mcu5", "name": "MCU-5", "premium": 1.03},
    {"id": "bunny", "name": "Bunny", "premium": 0.99},
    {"id": "dcH32", "name": "DCH-32", "premium": 1.06},
]


def generate_history(days: int = 730, seed: int = 42) -> List[Dict]:
    """Generate synthetic daily prices for each mandi & variety with realistic
    seasonality, weather, yield, demand, inflation drivers."""
    rng = np.random.default_rng(seed)
    end = datetime.utcnow().date()
    start = end - timedelta(days=days - 1)
    dates = pd.date_range(start, end, freq="D")

    rows = []
    for m in MANDIS:
        # base random walk shared per mandi
        n = len(dates)
        # seasonal: cotton harvest Oct-Jan -> supply high -> price dips
        day_of_year = np.array([d.dayofyear for d in dates])
        seasonal = -180 * np.sin(2 * np.pi * (day_of_year - 280) / 365)

        # inflation drift +6% over 2y
        drift = np.linspace(0, m["base"] * 0.06, n)

        # daily noise
        noise = rng.normal(0, 55, n).cumsum() * 0.35

        # weather (rainfall mm) & yield (quintal/ha) & demand index (0-100)
        rainfall = np.clip(rng.gamma(2.0, 4.0, n) + 8 * np.sin(2 * np.pi * (day_of_year - 180) / 365), 0, 60)
        yield_q = np.clip(11 + rng.normal(0, 1.4, n) - 0.02 * (rainfall - 20), 6, 16)
        demand = np.clip(60 + 12 * np.sin(2 * np.pi * (day_of_year - 30) / 365) + rng.normal(0, 6, n), 20, 100)
        inflation = 5.2 + 0.9 * np.sin(2 * np.pi * day_of_year / 365) + rng.normal(0, 0.15, n)

        for v in VARIETIES:
            # variety price modifier
            base_series = m["base"] * v["premium"] + seasonal + drift + noise
            # demand & yield adjustments
            adj = (demand - 60) * 3.5 - (yield_q - 11) * 40
            price = base_series + adj + rng.normal(0, 25, n)
            price = np.clip(price, m["base"] * 0.75, m["base"] * 1.35)

            for i, d in enumerate(dates):
                rows.append({
                    "date": d.date().isoformat(),
                    "mandi_id": m["id"],
                    "mandi": m["name"],
                    "state": m["state"],
                    "variety_id": v["id"],
                    "variety": v["name"],
                    "price": float(round(price[i], 2)),
                    "rainfall_mm": float(round(rainfall[i], 2)),
                    "yield_q_per_ha": float(round(yield_q[i], 2)),
                    "demand_index": float(round(demand[i], 2)),
                    "inflation_pct": float(round(inflation[i], 3)),
                    "quantity_supplied_t": float(round(rng.uniform(800, 2400), 1)),
                })
    return rows


def get_mandis():
    return MANDIS


def get_varieties():
    return VARIETIES
