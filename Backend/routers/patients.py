from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from auth import get_current_user
import models

router = APIRouter(prefix="/api/patients", tags=["Patients"])

# ── Schemas ───────────────────────────────────────────────
class PatientCreate(BaseModel):
    first_name:        str
    last_name:         str
    age:               int
    gender:            str
    primary_diagnosis: str
    num_procedures:    int
    days_in_hospital:  int
    comorbidity_score: int
    discharge_to:      str
    readmitted:        bool = False  

class PatientOut(BaseModel):
    id:                int
    first_name:        str
    last_name:         str
    age:               int
    gender:            str
    primary_diagnosis: str
    num_procedures:    int
    days_in_hospital:  int
    comorbidity_score: int
    discharge_to:      str
    readmitted:        bool 

    class Config:
        from_attributes = True

# ── GET all patients ──────────────────────────────────────
@router.get("/", response_model=list[PatientOut])
def get_patients(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(models.Patient).order_by(models.Patient.id.desc()).all()

# ── POST create patient ───────────────────────────────────
@router.post("/", response_model=PatientOut)
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    patient = models.Patient(**data.dict())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient

# ── DELETE patient ────────────────────────────────────────
@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"message": f"Patient {patient_id} deleted"}