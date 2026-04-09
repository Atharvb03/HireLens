import json
from sqlalchemy.orm import Session
from models import InterviewSession, InterviewQuestion
from schemas import InterviewSessionCreate, InterviewSummary
from services.question_generator import QuestionGenerator
from services.answer_evaluator import AnswerEvaluator
from datetime import datetime

class InterviewService:
    @staticmethod
    def create_interview_session(db: Session, session_data: InterviewSessionCreate) -> InterviewSession:
        """Create new interview session and generate questions"""
        
        try:
            print(f"Creating interview for candidate: {session_data.candidate_id}")
            
            # Create session
            interview_session = InterviewSession(
                candidate_id=session_data.candidate_id,
                job_role=session_data.job_role,
                job_description=session_data.job_description,
                required_skills=json.dumps(session_data.required_skills),
                candidate_skills=json.dumps(session_data.candidate_skills)
            )
            db.add(interview_session)
            db.commit()
            db.refresh(interview_session)
            print(f"Interview session created with ID: {interview_session.id}")
            
            # Generate questions
            print(f"Generating questions for job role: {session_data.job_role}")
            questions = QuestionGenerator.generate_questions(
                job_role=session_data.job_role,
                job_description=session_data.job_description,
                required_skills=session_data.required_skills,
                candidate_skills=session_data.candidate_skills
            )
            print(f"Generated {len(questions)} questions")
            
            # Store questions
            for idx, q in enumerate(questions, 1):
                question = InterviewQuestion(
                    session_id=interview_session.id,
                    question_number=idx,
                    question_text=q["question"],
                    question_type=q["type"]
                )
                db.add(question)
            
            db.commit()
            print(f"Stored {len(questions)} questions in database")
            return interview_session
        except Exception as e:
            print(f"Error in create_interview_session: {str(e)}")
            import traceback
            traceback.print_exc()
            raise
    
    @staticmethod
    def submit_answer(db: Session, session_id: int, question_id: int, answer: str) -> dict:
        """Submit answer and get evaluation"""
        
        question = db.query(InterviewQuestion).filter(
            InterviewQuestion.id == question_id,
            InterviewQuestion.session_id == session_id
        ).first()
        
        if not question:
            raise ValueError("Question not found")
        
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
        required_skills = json.loads(session.required_skills)
        
        # Evaluate answer
        evaluation = AnswerEvaluator.evaluate_answer(
            question=question.question_text,
            answer=answer,
            question_type=question.question_type,
            required_skills=required_skills
        )
        
        # Store answer and evaluation
        question.candidate_answer = answer
        question.score = evaluation["score"]
        # Store full evaluation as JSON for later analysis
        question.feedback = json.dumps(evaluation)
        db.commit()
        
        return evaluation
    
    @staticmethod
    def complete_interview(db: Session, session_id: int) -> InterviewSummary:
        """Complete interview and generate summary"""
        
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
        questions = db.query(InterviewQuestion).filter(
            InterviewQuestion.session_id == session_id
        ).all()
        
        # Calculate scores by type
        technical_scores = [q.score for q in questions if q.question_type == "technical" and q.score]
        behavioral_scores = [q.score for q in questions if q.question_type == "behavioral" and q.score]
        
        technical_avg = sum(technical_scores) / len(technical_scores) if technical_scores else 0
        behavioral_avg = sum(behavioral_scores) / len(behavioral_scores) if behavioral_scores else 0
        
        all_scores = [q.score for q in questions if q.score]
        total_score = sum(all_scores) / len(all_scores) if all_scores else 0
        
        # Collect strengths and weaknesses from ALL questions
        all_strengths = []
        all_weaknesses = []
        
        for q in questions:
            if q.feedback:
                # Try to parse feedback JSON
                try:
                    feedback_data = json.loads(q.feedback) if isinstance(q.feedback, str) and q.feedback.startswith('{') else None
                    if feedback_data:
                        for strength in feedback_data.get('strengths', []):
                            all_strengths.append(f"Q{q.question_number}: {strength}")
                        for weakness in feedback_data.get('weaknesses', []):
                            all_weaknesses.append(f"Q{q.question_number}: {weakness}")
                except:
                    pass
        
        # Update session
        session.total_score = total_score
        session.status = "completed"
        session.completed_at = datetime.utcnow()
        db.commit()
        
        # Remove duplicates while preserving order, keep all unique items
        unique_strengths = []
        unique_weaknesses = []
        seen_strengths = set()
        seen_weaknesses = set()
        
        for s in all_strengths:
            if s not in seen_strengths:
                unique_strengths.append(s)
                seen_strengths.add(s)
        
        for w in all_weaknesses:
            if w not in seen_weaknesses:
                unique_weaknesses.append(w)
                seen_weaknesses.add(w)
        
        # Return all strengths and weaknesses (not limited to 5)
        return InterviewSummary(
            total_score=total_score,
            percentage=total_score * 10,
            technical_knowledge=technical_avg * 10,
            communication=behavioral_avg * 10,
            problem_solving=(technical_avg + behavioral_avg) / 2 * 10,
            strengths=unique_strengths,  # Return all, not limited
            weaknesses=unique_weaknesses  # Return all, not limited
        )
