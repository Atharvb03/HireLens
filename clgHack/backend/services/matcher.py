from typing import List, Dict
from .nlp_processor import NLPProcessor
from database import resumes_collection, job_descriptions_collection, matches_collection
from bson.objectid import ObjectId

class ResumeMatcher:
    def __init__(self):
        self.nlp = NLPProcessor()

    def match_resume_to_job(self, resume_id: str, job_id: str) -> Dict:
        """Match a resume to a job description and calculate scores"""
        
        # Fetch resume and job description
        resume = resumes_collection.find_one({"_id": ObjectId(resume_id)})
        job = job_descriptions_collection.find_one({"_id": ObjectId(job_id)})
        
        if not resume or not job:
            raise ValueError("Resume or Job Description not found")
        
        # Extract skills
        resume_skills = resume.get("extracted_skills", [])
        job_skills = job.get("extracted_skills", [])
        
        # Calculate skill match score
        skill_match_score = self.nlp.calculate_skill_match_score(resume_skills, job_skills)
        
        # Calculate semantic similarity
        resume_embedding = resume.get("embedding", [])
        job_embedding = job.get("embedding", [])
        semantic_similarity = self.nlp.calculate_cosine_similarity(resume_embedding, job_embedding)
        semantic_similarity = semantic_similarity * 100  # Convert to percentage
        
        # Calculate combined match score (weighted average)
        # 40% skill match, 60% semantic similarity
        match_score = (skill_match_score * 0.4) + (semantic_similarity * 0.6)
        match_score = min(match_score, 100.0)
        
        return {
            "resume_id": str(resume_id),
            "candidate_id": resume.get("candidate_id"),
            "candidate_name": resume.get("candidate_name"),
            "job_id": str(job_id),
            "match_score": round(match_score, 2),
            "skill_match_score": round(skill_match_score, 2),
            "semantic_similarity": round(semantic_similarity, 2),
            "extracted_skills": resume_skills
        }

    def rank_candidates(self, job_id: str) -> List[Dict]:
        """Rank all candidates for a job based on match scores"""
        
        # Find all matches for this job
        matches = list(matches_collection.find({"job_id": job_id}).sort("match_score", -1))
        
        # Assign ranks
        ranked_candidates = []
        for rank, match in enumerate(matches, 1):
            match["rank"] = rank
            ranked_candidates.append(match)
        
        return ranked_candidates

    def update_rankings(self, job_id: str):
        """Update rankings for all candidates of a job"""
        ranked = self.rank_candidates(job_id)
        
        for candidate in ranked:
            matches_collection.update_one(
                {"_id": candidate["_id"]},
                {"$set": {"rank": candidate["rank"]}}
            )
