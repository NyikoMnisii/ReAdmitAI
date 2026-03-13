from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth

# Create all tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReAdmitAI API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)

# Health check
@app.get("/")
def root():
    return {"message": "ReAdmitAI API is running"}
