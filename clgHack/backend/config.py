import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME = "resume_matcher"
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
    # File upload settings
    UPLOAD_FOLDER = "uploads"
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {"pdf", "docx"}
    
    # NLP settings
    SKILL_DICTIONARY = {
        "python", "java", "javascript", "typescript", "react", "angular", "vue",
        "nodejs", "express", "django", "flask", "fastapi", "sql", "mongodb",
        "postgresql", "mysql", "aws", "azure", "gcp", "docker", "kubernetes",
        "git", "ci/cd", "machine learning", "deep learning", "nlp", "data science",
        "html", "css", "rest api", "graphql", "microservices", "agile", "scrum"
    }
    
    # Embedding model
    EMBEDDING_MODEL = "all-MiniLM-L6-v2"
