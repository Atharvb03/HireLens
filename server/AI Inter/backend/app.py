from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import ENVIRONMENT
from models import Base
from database import engine, get_db
from routes.interview import router as interview_router

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="AI Interview System", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(interview_router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "environment": ENVIRONMENT}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
