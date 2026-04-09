# AI Interview System - Complete Setup Guide

## Overview
The AI Interview system is now fully integrated into the main HireLens backend. It uses Gemini API to generate interview questions and evaluate candidate answers.

## Prerequisites

### 1. Environment Variables
Ensure your `server/.env` file has:
```
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here (fallback)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5555
```

### 2. Install Dependencies
```bash
cd server
npm install
```

The `@google/generative-ai` package is already in package.json.

## System Architecture

### Backend Components

1. **Models**
   - `server/models/AIInterview.js` - Stores interview links and metadata
   - `server/models/InterviewSession.js` - Stores interview session data
   - `server/models/InterviewQuestion.js` - Stores questions and answers

2. **Services**
   - `server/services/aiInterviewService.js` - Manages interview links and scoring
   - `server/services/interviewService.js` - Gemini API integration for Q&A

3. **Routes**
   - `server/routes/aiInterview.js` - Interview link generation and management
   - `server/routes/interviewSession.js` - Interview session and Q&A endpoints

### Frontend Components

1. **Pages**
   - `client/src/pages/RecruiterDashboard.jsx` - Generate interview links
   - `client/src/pages/CandidateDashboard.jsx` - View pending/completed interviews
   - `client/src/pages/InterviewPage.jsx` - Interview UI

2. **Routes**
   - `/interview/:token` - Interview page (protected route)

## Workflow

### 1. Recruiter Generates Interview Link
- Recruiter selects a candidate and job
- Clicks "Generate AI Interview Link"
- System creates an interview session with unique token
- Link is displayed in green box with copy button
- Recruiter shares link manually with candidate

### 2. Candidate Receives Link
- Candidate receives link from recruiter
- Link format: `http://localhost:3000/interview/{token}`
- Candidate clicks link to start interview

### 3. Interview Starts
- Frontend calls `/api/ai-interview/{token}` to get interview details
- Frontend calls `/api/interview-session/start` to create session
- Gemini API generates 5 interview questions
- Questions are displayed one by one

### 4. Candidate Answers Questions
- Candidate reads question and types answer
- Clicks "Submit Answer"
- Gemini API evaluates answer and provides score
- Feedback and strengths/improvements shown
- Candidate clicks "Next Question" or "Complete Interview"

### 5. Interview Completes
- Final score calculated (average of all question scores)
- Score sent to `/api/ai-interview/update-score`
- Interview marked as completed
- Candidate redirected to dashboard
- Recruiter can view candidate rankings by score

## API Endpoints

### AI Interview Management
- `POST /api/ai-interview/send-link` - Generate interview link
- `GET /api/ai-interview/:token` - Get interview details
- `POST /api/ai-interview/update-score` - Update interview score
- `GET /api/ai-interview/job/:jobId` - Get all interviews for job
- `GET /api/ai-interview/candidate/all` - Get all interviews for candidate
- `GET /api/ai-interview/candidate/pending` - Get pending interviews
- `GET /api/ai-interview/candidate/completed` - Get completed interviews

### Interview Session
- `POST /api/interview-session/start` - Start new interview session
- `GET /api/interview-session/:sessionId` - Get session details
- `POST /api/interview-session/answer` - Submit answer
- `POST /api/interview-session/:sessionId/complete` - Complete interview

## Testing the System

### Step 1: Start Backend
```bash
cd server
npm run dev
```

### Step 2: Start Frontend
```bash
cd client
npm run dev
```

### Step 3: Create Test Data
1. Register as recruiter
2. Register as candidate
3. Recruiter creates a job posting
4. Candidate applies for job

### Step 4: Generate Interview Link
1. Go to Recruiter Dashboard
2. Find candidate in "Candidates & Interviews" tab
3. Click "Generate AI Interview Link"
4. Copy the generated link

### Step 5: Take Interview
1. Open the interview link in browser
2. Answer all 5 questions
3. View final score
4. Check recruiter dashboard for rankings

## Troubleshooting

### Issue: 400 Bad Request on /api/interview-session/start
**Solution**: Ensure all required fields are sent:
- `candidateId` - User ID of candidate
- `jobRole` - Job title/role
- `interviewToken` - Token from AI interview link
- `jobDescription` (optional) - Job description
- `requiredSkills` (optional) - Array of skills
- `candidateSkills` (optional) - Array of skills

### Issue: Gemini API Errors
**Solution**: 
- Check GEMINI_API_KEY in .env
- System has fallback questions if API fails
- Check console logs for detailed error messages

### Issue: Interview Link Not Working
**Solution**:
- Ensure candidate is logged in
- Check token is valid (not expired)
- Verify `/interview/:token` route exists in App.jsx
- Check browser console for errors

### Issue: Questions Not Generating
**Solution**:
- Check Gemini API key is valid
- System uses fallback questions if API fails
- Check server logs for Gemini API errors

### Issue: Scores Not Updating
**Solution**:
- Ensure interview completes successfully
- Check `/api/ai-interview/update-score` endpoint
- Verify MongoDB connection
- Check server logs for errors

## Features

✅ Gemini API integration for question generation
✅ Gemini API integration for answer evaluation
✅ Fallback questions if API fails
✅ Fallback evaluation if API fails
✅ Interview link generation with unique tokens
✅ Interview expiration (7 days)
✅ Candidate ranking by score
✅ Interview history tracking
✅ Real-time question display
✅ Answer evaluation with feedback
✅ Final score calculation

## Next Steps

1. Configure Gemini API key in .env
2. Test the complete interview flow
3. Monitor server logs for any issues
4. Adjust fallback questions as needed
5. Customize interview questions based on job role
