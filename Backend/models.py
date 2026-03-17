from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    role = Column(String(20), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    department = Column(String(100))
    hire_date = Column(Date)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class Patient(Base):
    __tablename__ = "patients"
    id                 = Column(Integer, primary_key=True, index=True)
    first_name         = Column(String(50), nullable=False)
    last_name          = Column(String(50), nullable=False)
    age                = Column(Integer, nullable=False)
    gender             = Column(String(10), nullable=False)
    primary_diagnosis  = Column(String(100), nullable=False)
    num_procedures     = Column(Integer, nullable=False)
    days_in_hospital   = Column(Integer, nullable=False)
    comorbidity_score  = Column(Integer, nullable=False)
    discharge_to       = Column(String(100), nullable=False)
    readmitted         = Column(Boolean, nullable=False, default=False) 
    created_at         = Column(DateTime, server_default=func.now())