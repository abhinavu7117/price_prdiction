<div align="center">

# 🌾 COTTON AI

### AI-Powered Cotton Price Forecasting & Market Intelligence

**Predict trends. Understand markets. Make smarter pricing decisions.**

<br/>

[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![AI/ML](https://img.shields.io/badge/AI%2FML-Forecasting-FF6F00?style=for-the-badge\&logo=googlecloud\&logoColor=white)](#-machine-learning)

<br/><br/>

<a href="#-about-the-project">
  <img src="https://img.shields.io/badge/Explore%20Project-2ea44f?style=for-the-badge" alt="Explore Project"/>
</a>
&nbsp;
<a href="https://github.com/abhinavu7117/price_prdiction">
  <img src="https://img.shields.io/badge/View%20on%20GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
</a>

</div>

---

<!--
╔══════════════════════════════════════════════════════════════════════╗
║                         COTTON AI                                  ║
║          Intelligent Agricultural Price Forecasting                ║
╚══════════════════════════════════════════════════════════════════════╝
-->

## 🌱 About the Project

**Cotton AI** is an AI-powered agricultural market intelligence platform designed to forecast cotton prices and help users make more informed pricing decisions.

The platform combines **machine learning, time-series forecasting, historical market analysis, agricultural indicators, and an interactive web interface** into a single application.

Instead of simply displaying historical prices, Cotton AI attempts to answer a more useful question:

> ### **"Where could the cotton market be heading next?"**

The project is built around a hybrid forecasting approach that combines **Random Forest Regression** with **ARIMA-based time-series forecasting**.

---

## 🚀 Why Cotton AI?

Cotton prices can fluctuate because of numerous interconnected factors:

* 📈 Historical market trends
* 🌦️ Rainfall and weather conditions
* 🌱 Crop yield
* 🏪 Market demand
* 💰 Inflation
* 📅 Seasonal patterns
* 🔄 Short-term market fluctuations

For farmers, traders, and market analysts, understanding these variables can make pricing decisions easier and more data-driven.

### Cotton AI turns:

```text
Raw Agricultural Data
        ↓
Data Processing
        ↓
Feature Engineering
        ↓
AI / ML Forecasting
        ↓
Market Trend Analysis
        ↓
Actionable Insights
```

---

# ✨ Core Features

<table>
<tr>
<td width="50%">

### 📈 Price Forecasting

Generate future cotton-price predictions using historical market information and engineered predictive features.

</td>
<td width="50%">

### 🤖 Hybrid AI Engine

Combines Random Forest Regression and ARIMA to capture both feature relationships and temporal patterns.

</td>
</tr>

<tr>
<td width="50%">

### 📊 Market Analytics

Explore historical price movements and identify patterns that may influence future market behavior.

</td>
<td width="50%">

### 🌦️ Agricultural Indicators

Incorporates variables such as rainfall, crop yield, demand and inflation.

</td>
</tr>

<tr>
<td width="50%">

### 🔐 Authentication

Backend architecture includes user authentication, password hashing and token-based authorization.

</td>
<td width="50%">

### 💬 AI Assistance

Architecture supports an LLM-powered conversational layer for market intelligence and user assistance.

</td>
</tr>
</table>

---

# 🖥️ Screenshots

> Replace the placeholders below with screenshots of your actual application once the UI is finalized.

### 🏠 Dashboard

<p align="center">
  <img src="docs/screenshots/dashboard.png" width="90%" alt="Cotton AI Dashboard"/>
</p>

*Interactive market intelligence dashboard.*

---

### 📈 Price Forecast

<p align="center">
  <img src="docs/screenshots/forecast.png" width="90%" alt="Cotton Price Forecast"/>
</p>

*AI-generated cotton price forecast and market trend visualization.*

---

### 📊 Market Analytics

<p align="center">
  <img src="docs/screenshots/analytics.png" width="90%" alt="Cotton AI Analytics"/>
</p>

*Historical market analysis and data visualization.*

---

### 🔐 Authentication

<p align="center">
  <img src="docs/screenshots/login.png" width="70%" alt="Cotton AI Login"/>
</p>

*Secure user authentication interface.*

---

# 🧠 Machine Learning

## Hybrid Forecasting Architecture

Cotton AI combines two complementary forecasting techniques.

```text
                    HISTORICAL DATA
                          │
                          ▼
              ┌──────────────────────┐
              │   Data Processing    │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Feature Engineering  │
              └──────────┬───────────┘
                         │
               ┌─────────┴─────────┐
               │                   │
               ▼                   ▼
       ┌───────────────┐   ┌───────────────┐
       │ Random Forest │   │     ARIMA     │
       │   Regression  │   │ Time Series   │
       └───────┬───────┘   └───────┬───────┘
               │                   │
               └─────────┬─────────┘
                         ▼
                ┌─────────────────┐
                │ Hybrid Forecast │
                └────────┬────────┘
                         ▼
                ┌─────────────────┐
                │ Price Prediction│
                └─────────────────┘
```

---

## 🌲 Random Forest

Random Forest is used to capture nonlinear relationships between market and agricultural variables.

The feature pipeline can incorporate:

* Historical prices
* Lagged prices
* Rolling averages
* Rainfall
* Yield
* Demand
* Inflation
* Calendar-based features

---

## 📉 ARIMA

ARIMA models the temporal behavior of the cotton price series.

It is useful for identifying:

* Historical dependencies
* Trends
* Short-term temporal behavior
* Time-series patterns

---

## 🔀 Why Hybrid Forecasting?

Using both models provides two different perspectives:

| Model            | Primary Strength                                   |
| ---------------- | -------------------------------------------------- |
| 🌲 Random Forest | Nonlinear relationships between multiple variables |
| 📉 ARIMA         | Temporal dependencies and time-series behavior     |
| 🔀 Hybrid        | Combined forecasting perspective                   |

---

# 📊 Feature Engineering

The forecasting pipeline can derive temporal and statistical features including:

| Feature          | Meaning                       |
| ---------------- | ----------------------------- |
| `dow`            | Day of week                   |
| `month`          | Month                         |
| `doy`            | Day of year                   |
| `lag1`           | Previous price                |
| `lag7`           | Price from 7 periods earlier  |
| `lag30`          | Price from 30 periods earlier |
| `roll7`          | 7-period rolling average      |
| `roll30`         | 30-period rolling average     |
| `rainfall_mm`    | Rainfall                      |
| `yield_q_per_ha` | Crop yield                    |
| `demand_index`   | Demand indicator              |
| `inflation_pct`  | Inflation indicator           |

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       USER           │
                         │ Farmer / Trader /    │
                         │ Market Analyst       │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │       REACT FRONTEND      │
                    │                           │
                    │ Dashboard • Charts • UI   │
                    └─────────────┬─────────────┘
                                  │
                             REST API
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │       FASTAPI SERVER      │
                    │                           │
                    │ Auth • Forecast • Market  │
                    │ Data • AI Assistance      │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
             ┌───────────┐ ┌───────────┐ ┌───────────┐
             │  Random   │ │   ARIMA   │ │  MongoDB  │
             │  Forest   │ │           │ │           │
             └─────┬─────┘ └─────┬─────┘ └───────────┘
                   │             │
                   └──────┬──────┘
                          ▼
                  ┌───────────────┐
                  │ Hybrid Model  │
                  └───────┬───────┘
                          ▼
                  ┌───────────────┐
                  │ Price Forecast│
                  └───────────────┘
```

---

# 🧩 Technology Stack

### Frontend

| Technology         | Purpose            |
| ------------------ | ------------------ |
| ⚛️ React 19        | Web application    |
| 🎨 Tailwind CSS    | UI styling         |
| 📊 Recharts        | Data visualization |
| 🎞️ Framer Motion  | Animations         |
| 🔗 Axios           | API communication  |
| 🧭 React Router    | Navigation         |
| 🧩 Radix UI        | UI components      |
| 📝 React Hook Form | Forms              |
| ✅ Zod              | Validation         |
| 🎯 Lucide React    | Icons              |

### Backend

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| 🐍 Python         | Core backend language      |
| ⚡ FastAPI         | REST API framework         |
| 🧮 Pandas         | Data processing            |
| 🔢 NumPy          | Numerical computing        |
| 🌲 Scikit-learn   | Machine learning           |
| 📉 Statsmodels    | ARIMA/time-series analysis |
| 🔐 Authentication | User security              |

### Database

| Technology | Purpose                   |
| ---------- | ------------------------- |
| 🍃 MongoDB | Data persistence          |
| ⚡ Motor    | Async MongoDB integration |

---

# 📁 Project Structure

```text
price_prdiction/
│
├── app/
│   │
│   ├── backend/
│   │   ├── auth.py
│   │   ├── data_generator.py
│   │   ├── ml_models.py
│   │   ├── requirements.txt
│   │   ├── server.py
│   │   └── .env
│   │
│   ├── frontend/
│   │   ├── public/
│   │   ├── src/
│   │   ├── package.json
│   │   └── .env
│   │
│   └── design_guidelines.json
│
├── design_agent/
│
└── README.md
```

---

# 🔄 How It Works

```text
       01
       │
       ▼
┌──────────────────┐
│ Historical Data  │
└────────┬─────────┘
         │
       02│
         ▼
┌──────────────────┐
│ Data Cleaning    │
│ & Preparation    │
└────────┬─────────┘
         │
       03│
         ▼
┌──────────────────┐
│ Feature          │
│ Engineering      │
└────────┬─────────┘
         │
       04│
         ▼
┌──────────────────┐
│ ML + Time Series │
│ Forecasting      │
└────────┬─────────┘
         │
       05│
         ▼
┌──────────────────┐
│ Future Price     │
│ Prediction       │
└────────┬─────────┘
         │
       06│
         ▼
┌──────────────────┐
│ Dashboard &      │
│ Market Insights  │
└──────────────────┘
```

---

# ⚙️ Installation

## Prerequisites

Make sure you have:

* Python 3.10+
* Node.js 18+
* npm
* MongoDB
* Git

---

## 1️⃣ Clone

```bash
git clone https://github.com/abhinavu7117/price_prdiction.git
cd price_prdiction
```

---

## 2️⃣ Backend

```bash
cd app/backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3️⃣ Environment Variables

Create:

```text
app/backend/.env
```

Example:

```env
MONGO_URL=your_mongodb_connection_string
DB_NAME=your_database_name
EMERGENT_LLM_KEY=your_llm_api_key
```

> ⚠️ **Never commit real API keys, database passwords, JWT secrets, or private credentials to GitHub.**

---

## 4️⃣ Start Backend

```bash
uvicorn server:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

## 5️⃣ Start Frontend

Open another terminal:

```bash
cd app/frontend
npm install
npm start
```

Frontend:

```text
http://localhost:3000
```

---

# 🌐 Deployment

The project consists of both a frontend and backend, so **GitHub Pages alone is not sufficient for the complete application**.

Recommended deployment architecture:

```text
                    INTERNET
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
   ┌──────────────┐          ┌──────────────┐
   │   Frontend   │          │    Backend   │
   │ React / CDN  │ ───────► │ FastAPI      │
   └──────────────┘          └──────┬───────┘
                                    │
                                    ▼
                              ┌─────────────┐
                              │   MongoDB   │
                              └─────────────┘
```

Once deployed, add your production URL below:

<div align="center">

### 🚀 Live Demo

<a href="#">
<img src="https://img.shields.io/badge/🚀%20Open%20Cotton%20AI-Live%20Demo-2ea44f?style=for-the-badge" alt="Live Demo"/>
</a>

**Coming soon**

</div>

---

# 🎯 Target Users

### 👨‍🌾 Farmers

Use market intelligence to better understand possible price movements.

### 🏪 Traders

Analyze historical and predicted trends to support market decisions.

### 📊 Analysts

Explore agricultural and economic indicators affecting cotton prices.

### 🎓 Researchers & Students

Study applications of AI and time-series forecasting in agriculture.

---

# 🌍 Vision

Cotton AI is built around a broader idea:

> ## **Make advanced AI useful beyond the technology industry.**

Agriculture produces enormous amounts of data, yet converting that data into understandable insights can remain difficult.

Cotton AI aims to bridge that gap by transforming:

**Agricultural Data → AI Intelligence → Human Decisions**

---

# 🔮 Future Roadmap

* [ ] Real-time mandi price integration
* [ ] Live weather API integration
* [ ] Satellite/crop monitoring
* [ ] LSTM / GRU forecasting
* [ ] XGBoost / LightGBM comparison
* [ ] Automated model retraining
* [ ] Model performance monitoring
* [ ] SHAP explainability
* [ ] Regional market comparison
* [ ] Multi-language support
* [ ] Hindi & regional-language UI
* [ ] Mobile application
* [ ] SMS / WhatsApp alerts
* [ ] Price threshold notifications
* [ ] Personalized recommendations
* [ ] Real-time market alerts

---

# 📈 Model Evaluation

> **Performance metrics should be added here after evaluating the final model on a held-out test set.**

Recommended metrics:

| Metric | Purpose                            |
| ------ | ---------------------------------- |
| MAE    | Average absolute prediction error  |
| RMSE   | Penalizes larger prediction errors |
| MAPE   | Percentage-based forecasting error |
| R²     | Explained variance                 |

Example future section:

```text
Random Forest
MAE:  XX.XX
RMSE: XX.XX
R²:   X.XX

ARIMA
MAE:  XX.XX
RMSE: XX.XX
MAPE: XX.XX%

Hybrid
MAE:  XX.XX
RMSE: XX.XX
MAPE: XX.XX%
```

**Do not fill these with invented numbers.** Add them after actual evaluation.

---

# 🛡️ Disclaimer

Cotton AI is a **decision-support and research-oriented forecasting platform**.

Predictions generated by machine-learning models are estimates and should not be treated as guaranteed future prices or financial advice.

Actual cotton prices can be affected by unforeseen factors including weather, government policies, global commodity markets, supply-chain disruptions, geopolitical events, production changes, and demand fluctuations.

Users should consider multiple sources of information before making financial or agricultural decisions.

---

# 🔐 Security

Please ensure the following files are never committed with real credentials:

```text
.env
API keys
Database credentials
JWT secrets
Private tokens
```

Use environment variables and a proper `.gitignore` configuration.

---

# 🤝 Contributing

Contributions, ideas, bug reports, and improvements are welcome.

```bash
# Fork the repository

# Create a branch
git checkout -b feature/your-feature

# Make changes

# Commit
git commit -m "Add: your feature"

# Push
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 👨‍💻 Author

<div align="center">

### Abhinav Upadhyay

**Computer Science & Engineering — AI/ML**

<a href="https://github.com/abhinavu7117">
<img src="https://img.shields.io/badge/GitHub-abhinavu7117-181717?style=for-the-badge&logo=github&logoColor=white"/>
</a>

</div>

---

# ⭐ Support the Project

If you find Cotton AI interesting or useful:

⭐ **Star the repository**

🍴 **Fork the project**

🐛 **Report bugs**

💡 **Suggest improvements**

🤝 **Contribute**

---

<div align="center">

## 🌾 Cotton AI

### From Market Data to Intelligent Insights.

**Built with Python • React • FastAPI • MongoDB • Machine Learning**

<br/>

⭐ **If you like the project, consider giving it a star!** ⭐

</div>

