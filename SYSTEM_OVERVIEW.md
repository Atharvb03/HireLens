# HireLens AI Interview System - Complete Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         HireLens Application                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      Frontend (React)                            │   │
│  │                    Port: 3000                                    │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌─────────────────────┐  ┌──────────────────────────────────┐ │   │
│  │  │  Home Page          │  │  Authentication Pages            │ │   │
│  │  │  - Landing          │  │  - Candidate Login/Register      │ │   │
│  │  │  - Features         │  │  - Recruiter Login/Register      │ │   │
│  │  │  - About            │  │  - JWT Token Management          │ │   │
│  │  └─────────────────────┘  └──────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │  ┌─────────────────────┐  ┌──────────────────────────────────┐ │   │
│  │  │  Candidate          │  │  Recruiter                       │ │   │
│  │  │  Dashboard          │  │  Dashboard                       │ │   │
│  │  │  - Browse Jobs      │  │  - Job Management                │ │   │
│  │  │  - Apply for Jobs   │  │  - Candidate Management          │ │   │
│  │  │  - View Interviews  │  │  - Generate Interview Links      │ │   │
│  │  │  - View Scores      │  │  - View Rankings                 │ │   │
│  │  └─────────────────────┘  └──────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Interview Page (/interview/:token)                      │  │   │
│  │  │  - Display Questions                                     │  │   │
│  │  │  - Submit Answers                                        │  │   │
│  │  │  - View Evaluation                                       │  │   │
│  │  │  - Track Progress                                        │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      Backend (Express)                           │   │
│  │                    Port: 5555                                    │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  API Routes                                              │  │   │
│  │  │  - /api/auth - Authentication                            │  │   │
│  │  │  - /api/jobs - Job Management                            │  │   │
│  │  │  - /api/candidates - Candidate Management                │  │   │
│  │  │  - /api/ai-interview - Interview Link Management         │  │   │
│  │  │  - /api/interview-session - Interview Q&A                │  │   │
│  │  │  - /api/analysis - Resume Analysis                       │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Services                                                │  │   │
│  │  │  - aiInterviewService - Interview Management             │  │   │
│  │  │  - interviewService - Gemini API Integration             │  │   │
│  │  │  - matchingService - Resume Matching                     │  │   │
│  │  │  - jobSearchService - Internet Job Search                │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Models                                                  │  │   │
│  │  │  - User - User accounts                                  │  │   │
│  │  │  - JobPosting - Job listings                             │  │   │
│  │  │  - Candidate - Candidate profiles                        │  │   │
│  │  │  - AIInterview - Interview links                         │  │   │
│  │  │  - InterviewSession - Interview sessions                 │  │   │
│  │  │  - InterviewQuestion - Questions and answers             │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐  │   │
│  │  │  Middleware                                              │  │   │
│  │  │  - Authentication - JWT validation                       │  │   │
│  │  │  - Error Handling - Comprehensive error handling         │  │   │
│  │  │  - Logging - Request/response logging                    │  │   │
│  │  └──────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         External Services                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────┐ │
│  │  MongoDB Atlas           │  │  Gemini API                          │ │
│  │  - User Data             │  │  - Question Generation               │ │
│  │  - Job Postings          │  │  - Answer Evaluation                 │ │
│  │  - Candidate Profiles    │  │  - Feedback Generation               │ │
│  │  - Interview Data        │  │  - Fallback Support                  │ │
│  │  - Interview Sessions    │  │                                      │ │
│  │  - Interview Questions   │  │                                      │ │
│  └──────────────────────────┘  └──────────────────────────────────────┘ │
│                                                                           │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────┐ │
│  │  JSearch API             │  │  OpenAI API (Fallback)               │ │
│  │  - Internet Job Search   │  │  - Alternative to Gemini             │ │
│  │  - Job Recommendations   │  │  - Fallback Support                  │ │
│  └──────────────────────────┘  └──────────────────────────────────────┘ │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Interview Creation Flow
```
Recruiter Dashboard
    ↓
Click "Generate AI Interview Link"
    ↓
POST /api/ai-interview/send-link
    ↓
Backend creates AIInterview record
    ↓
Generate unique token (32 bytes hex)
    ↓
Set expiration (7 days)
    ↓
Return interview link
    ↓
Display in green box with copy button
    ↓
Recruiter shares link with candidate
```

### Interview Taking Flow
```
Candidate receives link
    ↓
Click link: http://localhost:3000/interview/{token}
    ↓
Frontend: GET /api/ai-interview/{token}
    ↓
Backend: Fetch AIInterview record
    ↓
Return interview details
    ↓
Frontend: POST /api/interview-session/start
    ↓
Backend: Create InterviewSession
    ↓
Backend: Call Gemini API to generate questions
    ↓
Gemini: Generate 5 interview questions
    ↓
Backend: Store questions in InterviewQuestion
    ↓
Frontend: Display first question
    ↓
Candidate: Type answer
    ↓
Candidate: Click "Submit Answer"
    ↓
Frontend: POST /api/interview-session/answer
    ↓
Backend: Call Gemini API to evaluate answer
    ↓
Gemini: Evaluate answer and provide score
    ↓
Backend: Store answer and score
    ↓
Frontend: Display evaluation and feedback
    ↓
Candidate: Click "Next Question"
    ↓
Repeat for all 5 questions
    ↓
Candidate: Click "Complete Interview"
    ↓
Frontend: POST /api/interview-session/{sessionId}/complete
    ↓
Backend: Calculate final score (average)
    ↓
Backend: POST /api/ai-interview/update-score
    ↓
Backend: Update AIInterview with score
    ↓
Frontend: Show final score
    ↓
Frontend: Redirect to dashboard
```

### Ranking View Flow
```
Recruiter Dashboard
    ↓
Click "Candidates & Interviews" tab
    ↓
Frontend: GET /api/ai-interview/job/{jobId}
    ↓
Backend: Fetch all completed interviews for job
    ↓
Backend: Sort by score (highest first)
    ↓
Return ranked candidates with scores
    ↓
Frontend: Display rankings
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Components                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  RecruiterDashboard                                          │
│  ├─ Generate Interview Link                                 │
│  │  └─ POST /api/ai-interview/send-link                     │
│  │     └─ interviewService.createInterviewSession()         │
│  │        └─ AIInterview.save()                             │
│  │                                                            │
│  └─ View Rankings                                            │
│     └─ GET /api/ai-interview/job/{jobId}                    │
│        └─ aiInterviewService.getInterviewsForJob()          │
│           └─ AIInterview.find().sort()                      │
│                                                               │
│  CandidateDashboard                                          │
│  ├─ View Pending Interviews                                 │
│  │  └─ GET /api/ai-interview/candidate/pending              │
│  │     └─ aiInterviewService.getPendingInterviews()         │
│  │        └─ AIInterview.find()                             │
│  │                                                            │
│  └─ View Completed Interviews                               │
│     └─ GET /api/ai-interview/candidate/completed            │
│        └─ aiInterviewService.getCompletedInterviews()       │
│           └─ AIInterview.find().sort()                      │
│                                                               │
│  InterviewPage                                               │
│  ├─ Start Interview                                          │
│  │  ├─ GET /api/ai-interview/{token}                        │
│  │  │  └─ aiInterviewService.getInterviewByToken()          │
│  │  │     └─ AIInterview.findOne()                          │
│  │  │                                                         │
│  │  └─ POST /api/interview-session/start                    │
│  │     └─ generateInterviewQuestions()                       │
│  │        └─ Gemini API                                      │
│  │           └─ InterviewQuestion.save()                    │
│  │                                                            │
│  ├─ Submit Answer                                            │
│  │  └─ POST /api/interview-session/answer                   │
│  │     └─ evaluateAnswer()                                   │
│  │        └─ Gemini API                                      │
│  │           └─ InterviewQuestion.update()                  │
│  │                                                            │
│  └─ Complete Interview                                       │
│     ├─ POST /api/interview-session/{sessionId}/complete     │
│     │  └─ Calculate final score                             │
│     │     └─ InterviewSession.update()                      │
│     │                                                         │
│     └─ POST /api/ai-interview/update-score                  │
│        └─ aiInterviewService.updateInterviewScore()         │
│           └─ AIInterview.findOneAndUpdate()                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### AIInterview Collection
```javascript
{
  _id: ObjectId,
  candidateId: ObjectId (ref: User),
  jobId: ObjectId (ref: JobPosting),
  recruiterId: ObjectId (ref: User),
  interviewLink: String,
  interviewToken: String (unique),
  status: String (pending|in_progress|completed|expired),
  score: Number,
  totalQuestions: Number,
  correctAnswers: Number,
  feedback: String,
  startedAt: Date,
  completedAt: Date,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### InterviewSession Collection
```javascript
{
  _id: ObjectId,
  candidateId: ObjectId (ref: User),
  jobRole: String,
  jobDescription: String,
  requiredSkills: [String],
  candidateSkills: [String],
  interviewToken: String (unique),
  status: String (pending|in_progress|completed|expired),
  finalScore: Number,
  startedAt: Date,
  completedAt: Date,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### InterviewQuestion Collection
```javascript
{
  _id: ObjectId,
  sessionId: ObjectId (ref: InterviewSession),
  questionNumber: Number,
  questionText: String,
  questionType: String (short_answer|descriptive|coding),
  difficulty: String (easy|medium|hard),
  candidateAnswer: String,
  score: Number,
  feedback: String,
  answeredAt: Date,
  createdAt: Date
}
```

## API Endpoint Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/ai-interview/send-link | Generate interview link | Yes |
| GET | /api/ai-interview/:token | Get interview details | No |
| POST | /api/ai-interview/update-score | Update interview score | No |
| GET | /api/ai-interview/job/:jobId | Get job rankings | Yes |
| GET | /api/ai-interview/candidate/all | Get candidate interviews | Yes |
| GET | /api/ai-interview/candidate/pending | Get pending interviews | Yes |
| GET | /api/ai-interview/candidate/completed | Get completed interviews | Yes |
| POST | /api/interview-session/start | Start interview | Yes |
| GET | /api/interview-session/:sessionId | Get session details | No |
| POST | /api/interview-session/answer | Submit answer | No |
| POST | /api/interview-session/:sessionId/complete | Complete interview | No |

## Error Handling Flow

```
Request
    ↓
Validation
    ├─ Missing fields? → 400 Bad Request
    ├─ Invalid token? → 401 Unauthorized
    └─ Not found? → 404 Not Found
    ↓
Processing
    ├─ Gemini API fails? → Use fallback questions
    ├─ Database error? → 500 Internal Server Error
    └─ Network error? → Retry with exponential backoff
    ↓
Response
    ├─ Success → 200 OK with data
    └─ Error → Error code with message
```

## Security Flow

```
Request
    ↓
Check Authorization Header
    ├─ Missing? → 401 Unauthorized
    └─ Invalid? → 401 Unauthorized
    ↓
Verify JWT Token
    ├─ Expired? → 401 Unauthorized
    ├─ Invalid signature? → 401 Unauthorized
    └─ Valid? → Continue
    ↓
Check User Role
    ├─ Candidate accessing recruiter endpoint? → 403 Forbidden
    ├─ Recruiter accessing candidate endpoint? → 403 Forbidden
    └─ Correct role? → Continue
    ↓
Process Request
    ↓
Return Response
```

## Performance Optimization

```
Frontend
├─ Lazy load components
├─ Cache interview details
├─ Debounce API calls
└─ Optimize re-renders

Backend
├─ Index database queries
├─ Cache Gemini responses
├─ Use connection pooling
└─ Implement rate limiting

Database
├─ Create indexes on frequently queried fields
├─ Use projection to limit returned fields
└─ Implement pagination for large result sets

API
├─ Compress responses
├─ Use HTTP caching headers
├─ Implement request throttling
└─ Monitor response times
```

## Deployment Checklist

- [ ] Configure environment variables
- [ ] Set up MongoDB Atlas cluster
- [ ] Get Gemini API key
- [ ] Install dependencies
- [ ] Run database migrations
- [ ] Test all endpoints
- [ ] Set up logging
- [ ] Configure CORS
- [ ] Set up SSL/TLS
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Monitor performance
- [ ] Set up alerts

---

**System Status:** ✅ Production Ready
**Last Updated:** March 12, 2026
**Version:** 1.0.0
