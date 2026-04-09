from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id = Column(Integer, primary_key=True)
    candidate_id = Column(String, unique=True)
    job_role = Column(String)
    job_description = Column(Text)
    required_skills = Column(String)  # JSON string
    candidate_skills = Column(String)  # JSON string
    status = Column(String, default="in_progress")  # in_progress, completed
    total_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    questions = relationship("InterviewQuestion", back_populates="session", cascade="all, delete-orphan")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"
    
    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"))
    question_number = Column(Integer)
    question_text = Column(Text)
    question_type = Column(String)  # technical, behavioral
    candidate_answer = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    
    session = relationship("InterviewSession", back_populates="questions")
