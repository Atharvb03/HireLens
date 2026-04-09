from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JobDescriptionCreate(BaseModel):
    title: str
    description: str
    hr_name: str

class JobDescriptionResponse(BaseModel):
    job_id: str
    title: str
    description: str
    extracted_skills: List[str]
    embedding: List[float]
    created_at: datetime

class ResumeUpload(BaseModel):
    candidate_name: str
    job_id: str

class ResumeResponse(BaseModel):
    resume_id: str
    candidate_name: str
    extracted_text: str
    extracted_skills: List[str]
    embedding: List[float]
    uploaded_at: datetime

class MatchResult(BaseModel):
    candidate_name: str
    match_score: float
    skill_match_score: float
    semantic_similarity: float
    extracted_skills: List[str]
    rank: int

class CandidateRanking(BaseModel):
    job_id: str
    candidates: List[MatchResult]
