from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import InterviewSessionCreate, InterviewSessionResponse, AnswerSubmission, InterviewSummary
from services.interview_service import InterviewService
from models import InterviewSession, InterviewQuestion
from database import get_db
import traceback

router = APIRouter(prefix="/api/interviews", tags=["interviews"])

@router.post("/start", response_model=InterviewSessionResponse)
def start_interview(session_data: InterviewSessionCreate, db: Session = Depends(get_db)):
    """Start new interview session"""
    try:
        interview_session = InterviewService.create_interview_session(db, session_data)
        return interview_session
    except Exception as e:
        print(f"Error in start_interview: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{session_id}", response_model=InterviewSessionResponse)
def get_interview(session_id: int, db: Session = Depends(get_db)):
    """Get interview session details"""
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview not found")
    return session

@router.post("/answer")
def submit_answer(submission: AnswerSubmission, db: Session = Depends(get_db)):
    """Submit answer and get evaluation"""
    try:
        print(f"Submitting answer for session {submission.session_id}, question {submission.question_id}")
        
        # Check if it's a coding challenge
        question = db.query(InterviewQuestion).filter(
            InterviewQuestion.id == submission.question_id
        ).first()
        
        if question and hasattr(question, 'question_type') and question.question_type == "coding":
            from services.code_evaluator import CodeEvaluator
            evaluation = CodeEvaluator.evaluate_code(submission.answer, "coding", "python")
        else:
            evaluation = InterviewService.submit_answer(
                db, submission.session_id, submission.question_id, submission.answer
            )
        
        print(f"Evaluation result: {evaluation}")
        return evaluation
    except Exception as e:
        print(f"Error in submit_answer: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{session_id}/followup")
def get_followup_question(session_id: int, question_id: int, db: Session = Depends(get_db)):
    """Get a follow-up question based on the answer"""
    try:
        question = db.query(InterviewQuestion).filter(
            InterviewQuestion.id == question_id,
            InterviewQuestion.session_id == session_id
        ).first()
        
        if not question or not question.candidate_answer:
            raise HTTPException(status_code=404, detail="Question or answer not found")
        
        from services.question_generator import QuestionGenerator
        followup = QuestionGenerator.generate_followup_question(
            question.question_text,
            question.candidate_answer,
            question.question_type
        )
        
        return {"followup_question": followup}
    except Exception as e:
        print(f"Error in get_followup_question: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{session_id}/complete", response_model=InterviewSummary)
def complete_interview(session_id: int, db: Session = Depends(get_db)):
    """Complete interview and get summary"""
    try:
        summary = InterviewService.complete_interview(db, session_id)
        return summary
    except Exception as e:
        print(f"Error in complete_interview: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
