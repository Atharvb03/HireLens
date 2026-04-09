import re

class CodeEvaluator:
    @staticmethod
    def evaluate_code(code: str, challenge_type: str, language: str = "python") -> dict:
        """Evaluate submitted code for coding challenges"""
        
        score = 5.0
        feedback = ""
        strengths = []
        weaknesses = []
        
        if not code or len(code.strip()) < 10:
            return {
                "score": 0.0,
                "feedback": "No code provided or code is too short.",
                "strengths": [],
                "weaknesses": ["No meaningful code submission"]
            }
        
        # Check for syntax
        try:
            compile(code, '<string>', 'exec')
            strengths.append("Valid Python syntax")
            score += 1.0
        except SyntaxError as e:
            weaknesses.append(f"Syntax error: {str(e)}")
            score -= 2.0
        
        # Check for comments and documentation
        if "#" in code or '"""' in code or "'''" in code:
            strengths.append("Includes comments/documentation")
            score += 1.0
        else:
            weaknesses.append("No comments or documentation")
        
        # Check for function definition
        if "def " in code:
            strengths.append("Proper function definition")
            score += 0.5
        
        # Check for error handling
        if "try" in code and "except" in code:
            strengths.append("Includes error handling")
            score += 1.0
        else:
            weaknesses.append("No error handling")
        
        # Check for efficiency
        if "for" in code or "while" in code:
            if "break" in code or "continue" in code:
                strengths.append("Shows optimization awareness")
                score += 0.5
        
        # Check code length (too short = incomplete, too long = inefficient)
        lines = len(code.split('\n'))
        if lines < 3:
            weaknesses.append("Solution appears incomplete")
            score -= 1.0
        elif lines > 50:
            weaknesses.append("Solution could be more concise")
            score -= 0.5
        else:
            strengths.append("Reasonable code length")
            score += 0.5
        
        # Generate feedback
        if score >= 8:
            feedback = "Excellent code! Well-structured, efficient, and properly documented."
        elif score >= 6:
            feedback = "Good solution. Shows understanding of the problem with decent implementation."
        elif score >= 4:
            feedback = "Acceptable solution. Could improve efficiency or add error handling."
        elif score >= 2:
            feedback = "Solution has issues. Review syntax and logic."
        else:
            feedback = "Solution needs significant improvement."
        
        score = min(10.0, max(0.0, score))
        
        return {
            "score": round(score, 1),
            "feedback": feedback,
            "strengths": strengths[:2],
            "weaknesses": weaknesses[:2]
        }
