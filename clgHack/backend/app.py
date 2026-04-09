from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import hr, candidate
import os

app = FastAPI(title="AI Resume Matcher", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(hr.router)
app.include_router(candidate.router)

@app.get("/")
async def root():
    return {"message": "AI Resume Matcher API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
