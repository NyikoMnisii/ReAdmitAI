from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, predict, patients

app = FastAPI(title="ReAdmitAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://readmitai-frontend.vercel.app",  # your main domain
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # ← allows ALL vercel URLs
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