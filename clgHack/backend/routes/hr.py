from fastapi import APIRouter, HTTPException, status
from models import JobDescriptionCreate, MatchResult, CandidateRanking
from database import job_descriptions_collection, matches_collection
from services.nlp_processor import NLPProcessor
from services.matcher import ResumeMatcher
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/hr", tags=["hr"])
nlp = NLPProcessor()
matcher = ResumeMatcher()

@router.post("/clear-data")
async def clear_job_data():
    """Clear all job descriptions, resumes, and matches"""
    try:
        job_descriptions_collection.delete_many({})
        matches_collection.delete_many({})
        return {
            "message": "All job descriptions and candidate matches cleared successfully",
            "status": "cleared"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error clearing data: {str(e)}"
        )

@router.post("/job-description")
async def create_job_description(job_data: JobDescriptionCreate):
    """Create and process job description"""
    
    # Preprocess job description
    preprocessed_text = nlp.preprocess_text(job_data.description)
    
    # Extract skills
    extracted_skills = nlp.extract_skills(job_data.description)
    
    # Generate embedding
    embedding = nlp.get_embedding(job_data.description)
    
    # Create job document
    job_doc = {
        "job_id": str(uuid.uuid4()),
        "title": job_data.title,
        "description": job_data.description,
        "hr_name": job_data.hr_name,
        "preprocessed_text": preprocessed_text,
        "extracted_skills": extracted_skills,
        "embedding": embedding,
        "created_at": datetime.utcnow()
    }
    
    result = job_descriptions_collection.insert_one(job_doc)
    
    return {
        "message": "Job description created successfully",
        "job_id": job_doc["job_id"],
        "title": job_data.title,
        "extracted_skills": extracted_skills,
        "db_id": str(result.inserted_id)
    }

@router.get("/job-descriptions")
async def get_job_descriptions():
    """Get all job descriptions"""
    
    jobs = list(job_descriptions_collection.find())
    
    return {
        "jobs": [
            {
                "job_id": job["job_id"],
                "title": job["title"],
                "hr_name": job["hr_name"],
                "extracted_skills": job["extracted_skills"],
                "created_at": job["created_at"].isoformat()
            }
            for job in jobs
        ]
    }

@router.get("/candidates/{job_id}")
async def get_ranked_candidates(job_id: str):
    """Get ranked candidates for a job"""
    
    # Verify job exists
    job = job_descriptions_collection.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    # Get ranked candidates
    matches = list(matches_collection.find({"job_id": job_id}).sort("match_score", -1))
    
    candidates = []
    for rank, match in enumerate(matches, 1):
        candidates.append({
            "candidate_name": match["candidate_name"],
            "match_score": match["match_score"],
            "skill_match_score": match["skill_match_score"],
            "semantic_similarity": match["semantic_similarity"],
            "extracted_skills": match["extracted_skills"],
            "rank": rank
        })
    
    return {
        "job_id": job_id,
        "job_title": job["title"],
        "total_candidates": len(candidates),
        "candidates": candidates
    }

@router.get("/dashboard")
async def get_hr_dashboard():
    """Get HR dashboard with all jobs and candidate counts"""
    
    jobs = list(job_descriptions_collection.find())
    
    dashboard_data = []
    for job in jobs:
        candidate_count = matches_collection.count_documents({"job_id": job["job_id"]})
        dashboard_data.append({
            "job_id": job["job_id"],
            "title": job["title"],
            "hr_name": job["hr_name"],
            "extracted_skills": job["extracted_skills"],
            "candidate_count": candidate_count,
            "created_at": job["created_at"].isoformat()
        })
    
    return {
        "total_jobs": len(dashboard_data),
        "jobs": dashboard_data
    }
