# ReAdmitAI 🏥

> AI-Powered Patient Readmission Prediction Platform for Healthcare Professionals

[![FastAPI](https://img.shields.io/badge/FastAPI-0.135-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-ROC--AUC%200.80-FF6600?style=flat)](https://xgboost.readthedocs.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Production-336791?style=flat&logo=postgresql)](https://www.postgresql.org)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | [https://re-admit-ai-snowy.vercel.app](https://re-admit-ai-snowy.vercel.app) |
| Backend API | [https://readmitai.onrender.com](https://readmitai.onrender.com) |
| API Docs | [https://readmitai.onrender.com/docs](https://readmitai.onrender.com/docs) |

### Demo Credentials
```
Email:    admin@readmitai.com
Password: Admin@1234
```

---

## 📋 Overview

ReAdmitAI is a full-stack clinical decision support system that uses machine learning to predict the probability of patient hospital readmission within 30 days. Built for healthcare professionals, it enables doctors and clinical staff to identify high-risk patients early and take preventive action.

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login with 8-hour token expiry aligned to clinical shift patterns
- 🤖 **ML Prediction Engine** — XGBoost model achieving ROC-AUC of 0.80 trained on 15,000 clinical records
- 👥 **Patient Management** — Full CRUD operations for patient records stored in PostgreSQL
- 📊 **Live Analytics Dashboard** — Real-time KPIs, readmission trends, diagnosis charts and risk segmentation
- 🎯 **Risk Scoring** — Patients categorized as Low / Medium / High risk with probability scores
- 🏥 **Clinical Design** — HIPAA-compliant secure login, role-based access for healthcare staff

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| PostgreSQL | Production database |
| SQLAlchemy | ORM |
| XGBoost | Readmission prediction model |
| Scikit-learn | Feature engineering & evaluation |
| SMOTE | Class imbalance handling |
| JWT / bcrypt | Authentication & password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool |
| Axios | API communication |
| Recharts | Analytics visualizations |
| React Context API | Global auth state |
| React Router | Client-side routing |

### Infrastructure
| Service | Purpose |
|---|---|
| Render | Backend & PostgreSQL hosting |
| Vercel | Frontend hosting |
| GitHub | Version control & CI/CD |

---

## 🤖 ML Model Details

| Metric | Value |
|---|---|
| Algorithm | XGBoost Classifier |
| ROC-AUC Score | 0.80 |
| Accuracy | 72% |
| Precision (Readmitted) | 79% |
| Recall (Readmitted) | 67% |
| Training Records | 15,000 |
| Features | 15 (including engineered) |
| Hyperparameter Tuning | RandomizedSearchCV (200 fits, 5-fold CV) |
| Class Imbalance | SMOTE oversampling |

### Features Used
- Age, Gender, Primary Diagnosis
- Number of Procedures, Days in Hospital
- Comorbidity Score, Discharge Destination
- Engineered: `age × comorbidity`, `days × comorbidity`, `elderly_high_risk`, `high_risk`, `long_stay`, `many_procedures`, `procedure_intensity`, `age_group`

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/NyikoMnisii/ReAdmitAI.git
cd ReAdmitAI/Backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

**.env file:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/readmission_db
SECRET_KEY=your-super-secret-key
```

```bash
# Run the backend
uvicorn main:app --reload
```

### Train the ML Model

```bash
# Place your CSV files in ml/data/
python ml/train.py
```

### Frontend Setup

```bash
cd ../Frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Run the frontend
npm run dev
```

---

## 📁 Project Structure

```
ReAdmitAI/
├── Backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # PostgreSQL connection
│   ├── models.py            # SQLAlchemy models
│   ├── auth.py              # JWT authentication
│   ├── requirements.txt
│   ├── routers/
│   │   ├── auth.py          # Auth endpoints
│   │   ├── patients.py      # Patient CRUD endpoints
│   │   └── predict.py       # ML prediction endpoint
│   └── ml/
│       ├── train.py         # Model training script
│       ├── data/            # Training datasets
│       └── model/           # Saved model artifacts
│           ├── model.pkl
│           ├── encoders.pkl
│           └── feature_names.pkl
└── Frontend/
    └── src/
        ├── api/
        │   └── axios.js     # Axios instance with interceptors
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── Patients.jsx
            ├── Prediction.jsx
            └── Analytics.jsx
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new staff | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/patients/` | Get all patients | ✅ |
| POST | `/api/patients/` | Add new patient | ✅ |
| DELETE | `/api/patients/{id}` | Delete patient | ✅ |
| POST | `/api/predict` | Run readmission prediction | ✅ |

---

## 📸 Screenshots

> Dashboard, Patients, Prediction and Analytics pages available at the live demo link above.

---

## 👨‍💻 Author

**Nyiko Mnisi**
- GitHub: [@NyikoMnisii](https://github.com/NyikoMnisii)

---

## 📄 License

This project is for portfolio and educational purposes.
