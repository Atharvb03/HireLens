import os
from dotenv import load_dotenv

load_dotenv()

# Use SQLite for local development (no setup needed)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_interview.db")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
