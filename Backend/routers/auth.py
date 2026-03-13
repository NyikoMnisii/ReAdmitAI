from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from auth import verify_password, create_access_token, hash_password, get_current_user
import models
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    role: str
    email: str
    phone: str = None
    department: str = None
    password: str

class StaffOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    role: str
    email: str
    department: str = None

    class Config:
        from_attributes = True

@router.post("/register", response_model=StaffOut)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(models.Staff).filter(models.Staff.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    staff = models.Staff(
        first_name=data.first_name,
        last_name=data.last_name,
        role=data.role,
        email=data.email,
        phone=data.phone,
        department=data.department,
        password=hash_password(data.password),
    )
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return staff

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    staff = db.query(models.Staff).filter(models.Staff.email == form_data.username).first()
    if not staff or not verify_password(form_data.password, staff.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": staff.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "staff": {
            "id": staff.id,
            "name": f"{staff.first_name} {staff.last_name}",
            "role": staff.role,
            "email": staff.email,
        }
    }

@router.get("/me", response_model=StaffOut)
def get_me(current_user: models.Staff = Depends(get_current_user)):
    return current_user