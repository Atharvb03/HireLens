import json
import re
import nltk
from nltk.corpus import words
from nltk.tokenize import word_tokenize

# Download required NLTK data
try:
    nltk.data.find('corpora/words')
except LookupError:
    nltk.download('words')

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

# Load English words dictionary
english_words = set(words.words())

class AnswerEvaluator:
    @staticmethod
    def evaluate_answer(
        question: str,
        answer: str,
        question_type: str,
        required_skills: list
    ) -> dict:
        """Evaluate candidate answer using intelligent heuristics and NLP"""
        
        return AnswerEvaluator._evaluate_intelligently(answer, question_type, question, required_skills)
    
    @staticmethod
    def _is_gibberish(answer: str) -> bool:
        """Use NLP to detect if answer is gibberish"""
        
        if len(answer.strip()) < 2:
            return True
        
        try:
            # Tokenize the answer
            tokens = word_tokenize(answer.lower())
            
            # Filter out punctuation and numbers
            word_tokens = [t for t in tokens if t.isalpha()]
            
            if len(word_tokens) == 0:
                return True
            
            # Check how many tokens are valid English words
            valid_word_count = sum(1 for token in word_tokens if token in english_words)
            valid_percentage = valid_word_count / len(word_tokens) if word_tokens else 0
            
            # If less than 30% of words are valid English words, it's gibberish
            if valid_percentage < 0.3:
                return True
            
            return False
        except:
            # If tokenization fails, assume it's not gibberish
            return False
    
    @staticmethod
    def _evaluate_intelligently(answer: str, question_type: str, question: str, required_skills: list) -> dict:
        """Intelligent evaluation based on answer quality"""
        
        answer_lower = answer.lower()
        answer_length = len(answer.split())
        
        # Check for gibberish using NLP
        if AnswerEvaluator._is_gibberish(answer):
            score = 0.0
            feedback = "Response appears to be gibberish or random characters. Please provide a meaningful answer."
            weaknesses = ["Gibberish response", "Not coherent", "Unintelligible"]
            strengths = []
            print(f"✓ Detected gibberish - Score: 0.0/10")
            return {
                "score": round(score, 1),
                "feedback": feedback,
                "strengths": strengths,
                "weaknesses": weaknesses
            }
        
        # Base score for valid answers
        score = 3.0
        strengths = []
        weaknesses = []
        
        if question_type == "technical":
            # Technical evaluation - more granular scoring
            if answer_length < 10:
                score = 1.5
                weaknesses.append("Answer is too brief - lacks technical depth")
            elif answer_length < 20:
                score = 2.5
                weaknesses.append("Very limited technical detail")
            elif answer_length < 35:
                score = 4.0
                weaknesses.append("Limited technical detail provided")
            elif answer_length < 60:
                score = 6.0
                strengths.append("Reasonable technical explanation")
            elif answer_length < 100:
                score = 7.5
                strengths.append("Good technical explanation with detail")
            else:
                score = 8.5
                strengths.append("Comprehensive technical response")
            
            # Check for technical indicators
            technical_keywords = ["implemented", "developed", "built", "designed", "architected", 
                                "code", "algorithm", "database", "api", "framework", "library",
                                "deployed", "configured", "optimized", "tested", "debugged",
                                "function", "class", "method", "variable", "loop", "condition"]
            keyword_count = sum(1 for keyword in technical_keywords if keyword in answer_lower)
            
            if keyword_count >= 4:
                score += 2.0
                strengths.append("Uses strong technical terminology")
            elif keyword_count >= 2:
                score += 1.0
                strengths.append("Uses appropriate technical terminology")
            elif keyword_count >= 1:
                score += 0.3
                strengths.append("Includes some technical terms")
            else:
                weaknesses.append("Lacks technical terminology")
            
            # Check for problem-solving
            if any(word in answer_lower for word in ["problem", "challenge", "issue", "solved", "fixed", "error", "bug"]):
                score += 1.0
                strengths.append("Demonstrates problem-solving approach")
            
            # Check for experience indicators
            if any(word in answer_lower for word in ["experience", "worked", "project", "years", "months", "built", "created"]):
                score += 0.5
                strengths.append("References practical experience")
            
            # Check for specific examples
            if any(word in answer_lower for word in ["example", "such as", "like", "for instance", "specifically"]):
                score += 0.5
                strengths.append("Provides specific examples")
            else:
                weaknesses.append("Could provide specific examples")
        
        else:  # behavioral
            # Behavioral evaluation - more granular scoring
            if answer_length < 12:
                score = 1.5
                weaknesses.append("Answer is too brief")
            elif answer_length < 25:
                score = 2.5
                weaknesses.append("Very limited context and detail")
            elif answer_length < 40:
                score = 4.0
                weaknesses.append("Limited context and examples")
            elif answer_length < 70:
                score = 6.0
                strengths.append("Good behavioral response")
            elif answer_length < 120:
                score = 7.5
                strengths.append("Detailed behavioral response")
            else:
                score = 8.5
                strengths.append("Excellent detailed response")
            
            # Check for STAR method indicators
            star_keywords = ["situation", "task", "action", "result", "outcome", "learned", "achieved", "completed"]
            star_count = sum(1 for keyword in star_keywords if keyword in answer_lower)
            
            if star_count >= 4:
                score += 2.0
                strengths.append("Excellent use of STAR method")
            elif star_count >= 2:
                score += 1.0
                strengths.append("Uses structured STAR approach")
            elif star_count >= 1:
                score += 0.5
                strengths.append("Shows structured thinking")
            
            # Check for teamwork/collaboration
            if any(word in answer_lower for word in ["team", "collaborated", "worked with", "communicated", "discussed", "together", "cooperation"]):
                score += 0.7
                strengths.append("Demonstrates teamwork and collaboration")
            
            # Check for measurable impact
            if any(word in answer_lower for word in ["improved", "increased", "reduced", "achieved", "delivered", "completed", "%", "number", "metrics"]):
                score += 0.7
                strengths.append("Shows measurable impact and results")
            else:
                weaknesses.append("Could include measurable outcomes")
            
            # Check for learning/growth
            if any(word in answer_lower for word in ["learned", "growth", "improved", "better", "next time"]):
                score += 0.5
                strengths.append("Shows learning and growth mindset")
        
        # Cap score at 10
        score = min(10.0, max(0.0, score))
        
        # Generate feedback based on score
        if score == 0:
            feedback = "No valid response provided."
        elif score >= 9:
            feedback = "Excellent response! Strong depth, clarity, relevant examples, and professional communication."
        elif score >= 8:
            feedback = "Very good response. Shows solid understanding with good detail and examples."
        elif score >= 7:
            feedback = "Good response. Demonstrates competence with reasonable detail."
        elif score >= 6:
            feedback = "Adequate response. Could add more specific examples or technical depth."
        elif score >= 4:
            feedback = "Response needs more detail, examples, and clarity to be compelling."
        elif score >= 2:
            feedback = "Response is too brief or unclear. Please provide more substantial answers."
        else:
            feedback = "Response is insufficient. Provide more meaningful content."
        
        # Ensure we have at least one weakness if score is low
        if score < 3 and not weaknesses:
            weaknesses.append("Insufficient response")
        
        # Ensure we have at least one strength if score is high
        if score >= 6 and not strengths:
            strengths.append("Shows understanding of the topic")
        
        print(f"✓ Evaluated answer - Score: {score:.1f}/10 - Length: {answer_length} words - Type: {question_type}")
        
        return {
            "score": round(score, 1),
            "feedback": feedback,
            "strengths": strengths[:2] if strengths else [],
            "weaknesses": weaknesses[:2] if weaknesses else []
        }
