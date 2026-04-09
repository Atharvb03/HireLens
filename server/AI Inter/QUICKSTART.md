# Quick Start Guide - AI Interview System

## 5-Minute Setup

### Option 1: Docker (Recommended)

```bash
# 1. Clone and navigate
git clone <repo-url>
cd ai-interview-system

# 2. Create .env file
cp .env.example .env

# 3. Add your OpenAI API key to .env
# Edit .env and set: OPENAI_API_KEY=sk-your-key-here

# 4. Start all services
docker-compose up -d

# 5. Access the app
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start PostgreSQL in Docker
docker run -d -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ai_interview_db -p 5432:5432 postgres:15-alpine

# Run backend
export OPENAI_API_KEY=sk-your-key-here
python app.py
```

**Frontend:**
```bash
cd frontend
python -m http.server 3000
# Open http://localhost:3000
```

## Using the System

1. **Start Interview**: Click "Start Interview Session"
2. **Enter Details**:
   - Candidate ID (e.g., CAND-001)
   - Job Role (e.g., Senior Python Developer)
   - Job Description
   - Required Skills (add multiple)
   - Candidate Skills from Resume (add multiple)
3. **Answer Questions**: 
   - Type answers or use voice recording
   - Submit each answer
4. **View Results**: Get final score and feedback

## Example Interview Setup

**Candidate ID:** CAND-001

**Job Role:** Senior Python Developer

**Job Description:** 
We're looking for an experienced Python developer to lead backend development. You'll work with FastAPI, PostgreSQL, and cloud infrastructure.

**Required Skills:**
- Python
- FastAPI
- PostgreSQL
- Docker

**Candidate Skills:**
- Python
- Django
- MySQL
- AWS

## API Testing

Use the interactive API docs at: http://localhost:8000/docs

Or test with curl:
```bash
curl -X POST http://localhost:8000/api/interviews/start \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "CAND-001",
    "job_role": "Senior Python Developer",
    "job_description": "Backend development with FastAPI",
    "required_skills": ["Python", "FastAPI"],
    "candidate_skills": ["Python", "Django"]
  }'
```

## Troubleshooting

**Port already in use:**
```bash
# Change ports in docker-compose.yml or use different ports
docker-compose up -d -p 8001:8000  # Backend on 8001
```

**Database connection error:**
```bash
# Ensure PostgreSQL is running
docker ps  # Check if postgres container is running
docker-compose logs postgres  # View logs
```

**OpenAI API error:**
- Verify API key is correct in .env
- Check API key has sufficient credits
- Ensure key is for GPT-3.5-turbo model

**CORS errors:**
- Backend CORS is already configured for all origins
- Ensure frontend is accessing http://localhost:8000

## Next Steps

1. Customize evaluation criteria in `backend/services/answer_evaluator.py`
2. Add more question types in `backend/services/question_generator.py`
3. Integrate speech-to-text for voice input
4. Add authentication and user management
5. Create analytics dashboard

## Support

Check README.md for detailed documentation and API reference.
