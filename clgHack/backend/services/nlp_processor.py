import re
from typing import List
from config import Config
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class NLPProcessor:
    def __init__(self):
        self.skill_dictionary = Config.SKILL_DICTIONARY
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')

    def preprocess_text(self, text: str) -> str:
        """Preprocess text: lowercase, remove special chars, normalize whitespace"""
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s\-/+]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text using skill dictionary"""
        preprocessed_text = self.preprocess_text(text)
        extracted_skills = []
        
        for skill in self.skill_dictionary:
            # Use word boundaries to match whole skills
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, preprocessed_text):
                extracted_skills.append(skill)
        
        return list(set(extracted_skills))  # Remove duplicates

    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using TF-IDF"""
        preprocessed = self.preprocess_text(text)
        try:
            embedding = self.vectorizer.fit_transform([preprocessed]).toarray()[0]
            return embedding.tolist()
        except:
            # Fallback: return zeros if vectorizer fails
            return [0.0] * 100

    def calculate_cosine_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between two embeddings"""
        vec1 = np.array(embedding1).reshape(1, -1)
        vec2 = np.array(embedding2).reshape(1, -1)
        
        # Pad vectors to same length
        max_len = max(len(embedding1), len(embedding2))
        vec1_padded = np.zeros((1, max_len))
        vec2_padded = np.zeros((1, max_len))
        
        vec1_padded[0, :len(embedding1)] = embedding1
        vec2_padded[0, :len(embedding2)] = embedding2
        
        similarity = cosine_similarity(vec1_padded, vec2_padded)[0][0]
        return float(similarity)

    def calculate_skill_match_score(self, resume_skills: List[str], job_skills: List[str]) -> float:
        """Calculate skill match score as percentage"""
        if not job_skills:
            return 0.0
        
        resume_skills_set = set(resume_skills)
        job_skills_set = set(job_skills)
        
        matched_skills = resume_skills_set.intersection(job_skills_set)
        score = (len(matched_skills) / len(job_skills_set)) * 100
        
        return min(score, 100.0)
