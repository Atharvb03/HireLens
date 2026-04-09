#!/usr/bin/env python3
"""
NLP Service for Resume Matching
This service provides NLP capabilities for matching resumes with job descriptions
"""

import re
import json
import sys
from typing import List, Dict
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Comprehensive skill dictionary
SKILL_DICTIONARY = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
    'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'express', 'fastapi', 'django', 'flask',
    'node.js', 'nodejs', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'gitlab', 'github',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material-ui', 'rest', 'graphql', 'websocket',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch', 'scikit-learn',
    'agile', 'scrum', 'kanban', 'jira', 'confluence', 'slack', 'communication', 'leadership',
    'sql', 'nosql', 'orm', 'api', 'microservices', 'serverless', 'ci/cd', 'devops',
    'spring', 'spring boot', 'hibernate', 'junit', 'maven', 'gradle', 'apache', 'nginx',
    'linux', 'windows', 'macos', 'unix', 'bash', 'shell', 'powershell', 'vim', 'vscode'
]

class NLPProcessor:
    def __init__(self):
        self.skill_dictionary = SKILL_DICTIONARY
        self.vectorizer = TfidfVectorizer(max_features=100, stop_words='english')

    def preprocess_text(self, text: str) -> str:
        """Preprocess text: lowercase, remove special chars, normalize whitespace"""
        if not text:
            return ""
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s\-/+]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text using skill dictionary"""
        preprocessed_text = self.preprocess_text(text)
        extracted_skills = []
        
        for skill in self.skill_dictionary:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, preprocessed_text):
                extracted_skills.append(skill)
        
        return list(set(extracted_skills))

    def calculate_cosine_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between two embeddings"""
        if not embedding1 or not embedding2:
            return 0.0
            
        vec1 = np.array(embedding1).reshape(1, -1)
        vec2 = np.array(embedding2).reshape(1, -1)
        
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
        
        resume_skills_set = set(s.lower() for s in resume_skills)
        job_skills_set = set(s.lower() for s in job_skills)
        
        matched_skills = resume_skills_set.intersection(job_skills_set)
        score = (len(matched_skills) / len(job_skills_set)) * 100
        
        return min(score, 100.0)

    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using TF-IDF"""
        preprocessed = self.preprocess_text(text)
        try:
            embedding = self.vectorizer.fit_transform([preprocessed]).toarray()[0]
            return embedding.tolist()
        except:
            return [0.0] * 100

    def match_resume_to_job(self, resume_text: str, job_description: str, job_skills: List[str]) -> Dict:
        """Match resume to job and return match score"""
        try:
            # Extract skills from resume
            resume_skills = self.extract_skills(resume_text)
            
            # Calculate skill match score (40% weight)
            skill_match_score = self.calculate_skill_match_score(resume_skills, job_skills)
            
            # Get embeddings
            resume_embedding = self.get_embedding(resume_text)
            job_embedding = self.get_embedding(job_description)
            
            # Calculate semantic similarity (60% weight)
            semantic_similarity = self.calculate_cosine_similarity(resume_embedding, job_embedding) * 100
            
            # Combined match score
            match_score = (skill_match_score * 0.4) + (semantic_similarity * 0.6)
            
            return {
                "matchScore": round(match_score, 2),
                "skillMatchScore": round(skill_match_score, 2),
                "semanticSimilarity": round(semantic_similarity, 2),
                "extractedSkills": resume_skills
            }
        except Exception as e:
            print(f"Error in match_resume_to_job: {str(e)}", file=sys.stderr)
            return {
                "matchScore": 0,
                "skillMatchScore": 0,
                "semanticSimilarity": 0,
                "extractedSkills": []
            }

def main():
    """Main function to handle JSON input/output"""
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        
        processor = NLPProcessor()
        
        # Handle different operations
        operation = input_data.get('operation')
        
        if operation == 'match':
            result = processor.match_resume_to_job(
                input_data.get('resumeText', ''),
                input_data.get('jobDescription', ''),
                input_data.get('jobSkills', [])
            )
            print(json.dumps(result))
        
        elif operation == 'extract_skills':
            skills = processor.extract_skills(input_data.get('text', ''))
            print(json.dumps({"skills": skills}))
        
        else:
            print(json.dumps({"error": "Unknown operation"}))
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()
