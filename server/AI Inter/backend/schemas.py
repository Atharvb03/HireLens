from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InterviewSessionCreate(BaseModel):
    candidate_id: str
    job_role: str
    job_description: str
    required_skills: List[str]
    candidate_skills: List[str]

class InterviewQuestionResponse(BaseModel):
    id: int
    question_number: int
    question_text: str
    question_type: str
    candidate_answer: Optional[str] = None
    score: Optional[float] = None
    feedback: Optional[str] = None

class InterviewSessionResponse(BaseModel):
    id: int
    candidate_id: str
    job_role: str
    status: str
    total_score: float
    created_at: datetime
    completed_at: Optional[datetime] = None
    questions: List[InterviewQuestionResponse]

class AnswerSubmission(BaseModel):
    session_id: int
    question_id: int
    answer: str

class InterviewSummary(BaseModel):
    total_score: float
    percentage: float
    technical_knowledge: float
    communication: float
    problem_solving: float
    strengths: List[str]
    weaknesses: List[str]
