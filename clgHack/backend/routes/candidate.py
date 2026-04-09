from fastapi import APIRouter, HTTPException, status, UploadFile, File
from database import resumes_collection, job_descriptions_collection, matches_collection
from services.resume_parser import ResumeParser
from services.nlp_processor import NLPProcessor
from services.matcher import ResumeMatcher
from config import Config
from bson.objectid import ObjectId
from datetime import datetime
import os
import uuid

router = APIRouter(prefix="/api/candidate", tags=["candidate"])
parser = ResumeParser()
nlp = NLPProcessor()
matcher = ResumeMatcher()

@router.post("/upload-resume/{job_id}")
async def upload_resume(job_id: str, candidate_name: str, file: UploadFile = File(...)):
    """Upload and process resume"""
    
    # Verify job exists
    job = job_descriptions_collection.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
    # Validate file
    if file.filename.split('.')[-1].lower() not in Config.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are allowed"
        )
    
    # Create upload folder if not exists
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    
    # Save file
    file_path = os.path.join(Config.UPLOAD_FOLDER, f"{uuid.uuid4()}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    try:
        # Extract text from resume
        resume_text = parser.extract_text(file_path)
        
        # Preprocess text
        preprocessed_text = nlp.preprocess_text(resume_text)
        
        # Extract skills
        extracted_skills = nlp.extract_skills(resume_text)
        
        # Generate embedding
        embedding = nlp.get_embedding(resume_text)
        
        # Create resume document
        resume_doc = {
            "candidate_name": candidate_name,
            "job_id": job_id,
            "file_path": file_path,
            "extracted_text": resume_text,
            "preprocessed_text": preprocessed_text,
            "extracted_skills": extracted_skills,
            "embedding": embedding,
            "uploaded_at": datetime.utcnow()
        }
        
        resume_result = resumes_collection.insert_one(resume_doc)
        resume_id = str(resume_result.inserted_id)
        
        # Calculate match score using job_id directly
        job_skills = job.get("extracted_skills", [])
        job_embedding = job.get("embedding", [])
        
        # Calculate skill match score
        skill_match_score = nlp.calculate_skill_match_score(extracted_skills, job_skills)
        
        # Calculate semantic similarity
        semantic_similarity = nlp.calculate_cosine_similarity(embedding, job_embedding)
        semantic_similarity = semantic_similarity * 100
        
        # Calculate combined match score
        match_score = (skill_match_score * 0.4) + (semantic_similarity * 0.6)
        match_score = min(match_score, 100.0)
        
        # Store match result
        match_doc = {
            "resume_id": resume_id,
            "candidate_name": candidate_name,
            "job_id": job_id,
            "match_score": round(match_score, 2),
            "skill_match_score": round(skill_match_score, 2),
            "semantic_similarity": round(semantic_similarity, 2),
            "extracted_skills": extracted_skills,
            "created_at": datetime.utcnow()
        }
        
        matches_collection.insert_one(match_doc)
        
        # Update rankings
        matcher.update_rankings(job_id)
        
        return {
            "message": "Resume uploaded and processed successfully",
            "resume_id": resume_id,
            "candidate_name": candidate_name,
            "extracted_skills": extracted_skills,
            "match_score": round(match_score, 2),
            "skill_match_score": round(skill_match_score, 2),
            "semantic_similarity": round(semantic_similarity, 2)
        }
    
    except Exception as e:
        # Clean up file on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing resume: {str(e)}"
        )

@router.get("/jobs")
async def get_available_jobs():
    """Get all available jobs for candidates"""
    
    jobs = list(job_descriptions_collection.find())
    
    return {
        "jobs": [
            {
                "job_id": job["job_id"],
                "title": job["title"],
                "description": job.get("description", "No description provided"),
                "hr_name": job.get("hr_name", "Unknown"),
                "extracted_skills": job.get("extracted_skills", []),
                "created_at": job["created_at"].isoformat()
            }
            for job in jobs
        ]
    }

@router.get("/job-candidates/{job_id}")
async def get_job_candidates(job_id: str):
    """Get all candidates for a job with rankings"""
    
    job = job_descriptions_collection.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    
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
