# AI Interview System

A comprehensive AI-powered recruitment interview platform that automatically conducts interviews with candidates, evaluates their responses, and generates detailed performance reports.

## Features

- **Automated Interview Generation**: Creates 5 tailored questions (3 technical, 2 behavioral) based on job role and candidate skills
- **Multi-Modal Input**: Support for text and voice-based answers
- **AI-Powered Evaluation**: Uses OpenAI GPT to evaluate answers on technical correctness, clarity, and completeness
- **Real-Time Feedback**: Immediate scoring and feedback after each answer
- **Comprehensive Reporting**: Final interview summary with scores, strengths, and weaknesses
- **Database Persistence**: All interview data stored in PostgreSQL

## Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Real-time UI updates
- Voice recording capability

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL database
- OpenAI API integration

**Deployment:**
- Docker & Docker Compose
- Containerized services

## Project Structure

```
ai-interview-system/
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── models.py              # Database models
│   ├── schemas.py             # Pydantic schemas
│   ├── config.py              # Configuration
│   ├── services/
│   │   ├── question_generator.py    # Question generation logic
│   │   ├── answer_evaluator.py      # Answer evaluation logic
│   │   └── interview_service.py     # Interview orchestration
│   ├── routes/
│   │   └── interview.py       # API endpoints
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── docker-compose.yml
├── .env.example
└── README.md
```

## Setup & Installation

### Prerequisites
- Docker & Docker Compose
- OpenAI API key
- Python 3.11+ (for local development)

### Quick Start with Docker

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-interview-system
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

3. **Start services**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

1. **Backend setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Start PostgreSQL** (using Docker)
```bash
docker run -d \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=ai_interview_db \
  -p 5432:5432 \
  postgres:15-alpine
```

3. **Run backend**
```bash
export OPENAI_API_KEY=your_key_here
python app.py
```

4. **Frontend** - Open `frontend/index.html` in a browser or use a local server:
```bash
cd frontend
python -m http.server 3000
```

## API Endpoints

### Start Interview Session
```
POST /api/interviews/start
Content-Type: application/json

{
  "candidate_id": "CAND-001",
  "job_role": "Senior Software Engineer",
  "job_description": "...",
  "required_skills": ["Python", "FastAPI", "PostgreSQL"],
  "candidate_skills": ["Python", "Django", "MySQL"]
}
```

### Get Interview Session
```
GET /api/interviews/{session_id}
```

### Submit Answer
```
POST /api/interviews/answer
Content-Type: application/json

{
  "session_id": 1,
  "question_id": 1,
  "answer": "..."
}
```

### Complete Interview
```
POST /api/interviews/{session_id}/complete
```

## Interview Flow

1. **Setup Phase**: Candidate enters job details and skills
2. **Question Generation**: AI generates 5 tailored questions
3. **Interview Phase**: Questions asked one at a time
4. **Answer Submission**: Candidate provides text or voice answers
5. **Evaluation**: AI evaluates each answer (0-10 score)
6. **Summary**: Final report with scores and recommendations

## Evaluation Criteria

Each answer is evaluated on:
- **Technical Correctness**: Accuracy of technical information
- **Completeness**: Thoroughness of the explanation
- **Clarity**: How well the answer is communicated
- **Relevance**: How well the answer addresses the question

## Final Report Includes

- Overall interview score (0-100%)
- Technical knowledge score
- Communication score
- Problem-solving score
- Key strengths
- Areas for improvement

## Integration with Resume Screening

The final interview score can be combined with resume matching scores:
```
Final Candidate Ranking = (Resume Score × 0.4) + (Interview Score × 0.6)
```

## Voice Input Setup

To enable voice recording:
1. Ensure HTTPS is used in production
2. Integrate with speech-to-text API:
   - Google Cloud Speech-to-Text
   - Azure Speech Services
   - OpenAI Whisper API

## Database Schema

### interview_sessions
- id (PK)
- candidate_id
- job_role
- job_description
- required_skills (JSON)
- candidate_skills (JSON)
- status (in_progress, completed)
- total_score
- created_at
- completed_at

### interview_questions
- id (PK)
- session_id (FK)
- question_number
- question_text
- question_type (technical, behavioral)
- candidate_answer
- score
- feedback

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/ai_interview_db
OPENAI_API_KEY=sk-...
ENVIRONMENT=development
```

## Error Handling

The system handles:
- Missing or invalid inputs
- API failures with graceful degradation
- Database connection issues
- OpenAI API rate limits

## Future Enhancements

- [ ] Real-time speech-to-text integration
- [ ] Video recording of interviews
- [ ] Advanced NLP for better answer evaluation
- [ ] Multi-language support
- [ ] Interview analytics dashboard
- [ ] Candidate comparison reports
- [ ] Integration with ATS systems
- [ ] Email notifications

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
