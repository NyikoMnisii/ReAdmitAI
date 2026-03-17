from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from auth import get_current_user
import joblib
import numpy as np
import os

router = APIRouter(prefix="/api", tags=["Prediction"])

# ── Load model artifacts once at startup ──────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE, "../ml/model")

model         = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
encoders      = joblib.load(os.path.join(MODEL_DIR, "encoders.pkl"))
feature_names = joblib.load(os.path.join(MODEL_DIR, "feature_names.pkl"))

# ── Request schema ────────────────────────────────────────
class PatientInput(BaseModel):
    age: int
    gender: str                 # "Male" or "Female"
    primary_diagnosis: str      # "Heart Disease", "Diabetes", etc.
    num_procedures: int
    days_in_hospital: int
    comorbidity_score: int      # 0–4
    discharge_to: str           # "Home", "Home Health Care", etc.

# ── Prediction endpoint ───────────────────────────────────
@router.post("/predict")
def predict(
    patient: PatientInput,
    current_user=Depends(get_current_user)
):
    try:
        # 1. Encode categoricals
        gender_enc    = encoders["gender"].transform([patient.gender])[0]
        diagnosis_enc = encoders["primary_diagnosis"].transform([patient.primary_diagnosis])[0]
        discharge_enc = encoders["discharge_to"].transform([patient.discharge_to])[0]

        # 2. Feature engineering (must match train.py exactly)
        age_group = int(np.digitize(patient.age, bins=[30, 50, 65, 80]))
        high_risk = int(patient.days_in_hospital > 7 and patient.comorbidity_score >= 2)
        procedure_intensity = patient.num_procedures / (patient.days_in_hospital + 1)
        age_x_comorbidity   = patient.age * patient.comorbidity_score
        days_x_comorbidity  = patient.days_in_hospital * patient.comorbidity_score
        elderly_high_risk   = int(patient.age > 65 and patient.comorbidity_score >= 3)
        long_stay           = int(patient.days_in_hospital > 10)
        many_procedures     = int(patient.num_procedures > 8)

        # 3. Build feature vector in exact same order as training
        features = np.array([[
            patient.age,
            gender_enc,
            diagnosis_enc,
            patient.num_procedures,
            patient.days_in_hospital,
            patient.comorbidity_score,
            discharge_enc,
            age_group,
            high_risk,
            procedure_intensity,
            age_x_comorbidity,
            days_x_comorbidity,
            elderly_high_risk,
            long_stay,
            many_procedures
        ]])

        # 4. Predict
        prob       = model.predict_proba(features)[0][1]
        prediction = int(model.predict(features)[0])

        # 5. Risk label
        if prob < 0.30:
            risk_level = "Low"
        elif prob < 0.60:
            risk_level = "Medium"
        else:
            risk_level = "High"

        return {
            "prediction":   prediction,
            "probability":  round(float(prob), 4),
            "risk_level":   risk_level,
            "risk_percent": round(float(prob) * 100, 1),
            "message": f"Patient has a {round(float(prob)*100,1)}% probability of readmission"
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input value: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")