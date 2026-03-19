from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, predict, patients

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReAdmitAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← temporarily allow ALL origins to test
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(patients.router)

@app.get("/")
def root():
    return {"message": "ReAdmitAI API is running"}