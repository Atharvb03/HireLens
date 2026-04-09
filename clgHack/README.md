# AI Resume Matcher

A full-stack web application that uses Natural Language Processing (NLP) to match resumes with job descriptions, providing HR with ranked candidate lists and candidates with their match scores.

## Features

### HR Features
- Create and manage job descriptions
- Automatic skill extraction from job descriptions
- View ranked candidates for each job
- See match scores, skill matches, and semantic similarity scores
- Dashboard with job statistics

### Candidate Features
- Browse available job positions
- Upload resumes in PDF or DOCX format
- Automatic skill extraction from resumes
- View match scores and rankings
- Track submission history

### NLP Processing
- **Text Preprocessing**: Lowercasing, special character removal, tokenization
- **Skill Extraction**: Using predefined skill dictionary
- **Embeddings**: Sentence Transformers for semantic understanding
- **Similarity Scoring**: Cosine similarity between resume and job embeddings
- **Ranking**: Automatic ranking based on combined skill and semantic scores

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **NLP Libraries**:
  - spaCy: Advanced NLP processing
  - Sentence Transformers: Semantic embeddings
  - scikit-learn: Similarity calculations
- **File Processing**:
  - PyPDF2: PDF text extraction
  - python-docx: DOCX text extraction
- **Authentication**: JWT tokens with bcrypt password hashing

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router

## Project Structure

```
ai-resume-matcher/
├── backend/
│   ├── app.py                 # Main FastAPI application
│   ├── config.py              # Configuration settings
│   ├── database.py            # MongoDB connection
│   ├── models.py              # Pydantic models
│   ├── requirements.txt        # Python dependencies
│   ├── routes/
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── hr.py              # HR endpoints
│   │   └── candidate.py        # Candidate endpoints
│   ├── services/
│   │   ├── resume_parser.py    # Resume text extraction
│   │   ├── nlp_processor.py    # NLP processing
│   │   └── matcher.py          # Resume matching logic
│   └── utils/
│       └── helpers.py          # Utility functions
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── api.js              # API client
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── HRDashboard.jsx
│   │   │   └── CandidateUpload.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── JobDescriptionForm.jsx
│   │       ├── CandidateRankings.jsx
│   │       ├── JobList.jsx
│   │       └── ResumeUploadForm.jsx
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download spaCy model:
```bash
python -m spacy download en_core_web_sm
```

5. Create `.env` file:
```bash
cp .env.example .env
```

6. Update `.env` with your MongoDB URL and secret key

7. Run the backend:
```bash
python app.py
```

The backend will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### HR Endpoints
- `POST /api/hr/job-description` - Create job description
- `GET /api/hr/job-descriptions` - Get all job descriptions
- `GET /api/hr/candidates/{job_id}` - Get ranked candidates
- `GET /api/hr/dashboard` - Get HR dashboard data

### Candidate Endpoints
- `POST /api/candidate/upload-resume/{job_id}` - Upload resume
- `GET /api/candidate/jobs` - Get available jobs
- `GET /api/candidate/my-submissions` - Get submission history
- `GET /api/candidate/submission-status/{job_id}` - Get submission status

## Matching Algorithm

The system uses a two-pronged approach:

1. **Skill Matching (40% weight)**
   - Extracts skills from both resume and job description
   - Calculates percentage of required skills found in resume
   - Formula: (matched_skills / required_skills) × 100

2. **Semantic Similarity (60% weight)**
   - Converts resume and job description to embeddings using Sentence Transformers
   - Calculates cosine similarity between embeddings
   - Provides contextual understanding beyond keyword matching

**Final Score**: (Skill Match × 0.4) + (Semantic Similarity × 0.6)

## Usage

### For HR Users
1. Register as HR
2. Create job descriptions with detailed requirements
3. System automatically extracts skills and creates embeddings
4. View dashboard with all job postings
5. Click on a job to see ranked candidates
6. Rankings update automatically as new resumes are submitted

### For Candidates
1. Register as Candidate
2. Browse available job positions
3. Select a job and upload resume (PDF or DOCX)
4. System extracts skills and calculates match score
5. View your ranking among other candidates
6. Track all submissions in history

## Configuration

Edit `backend/config.py` to customize:
- Skill dictionary
- Embedding model
- File upload settings
- Database settings

## Performance Considerations

- Embeddings are cached in the database to avoid recalculation
- Indexes on frequently queried fields for faster lookups
- Asynchronous file processing for large uploads
- Batch ranking updates for efficiency

## Future Enhancements

- Advanced filtering and search
- Email notifications for candidates
- Resume parsing improvements with OCR
- Custom skill dictionaries per company
- Analytics and reporting dashboard
- Resume recommendations for candidates
- Interview scheduling integration

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
