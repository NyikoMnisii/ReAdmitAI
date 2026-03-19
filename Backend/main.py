from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, predict, patients

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReAdmitAI API")

origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # ← change to False when using wildcard
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(patients.router)

@app.get("/")
def root():
    return {"message": "ReAdmitAI API is running"}