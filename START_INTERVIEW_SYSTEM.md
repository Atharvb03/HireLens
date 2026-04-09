# Quick Start - Interview System

## Prerequisites
- Node.js installed
- MongoDB Atlas account with connection string
- Gemini API key (from Google AI Studio)

## Setup Steps

### 1. Configure Environment
Edit `server/.env`:
```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
PORT=5555
```

### 2. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Expected output:
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Expected output:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:3000/
```

### 4. Test Interview Flow

1. **Register as Recruiter**
   - Go to http://localhost:3000
   - Click "Admin Register"
   - Fill form and register

2. **Register as Candidate**
   - Go to http://localhost:3000
   - Click "Candidate Register"
   - Fill form and register

3. **Create Job (as Recruiter)**
   - Login as recruiter
   - Go to Recruiter Dashboard
   - Create a job posting

4. **Apply for Job (as Candidate)**
   - Login as candidate
   - Browse jobs
   - Apply for the job

5. **Generate Interview Link (as Recruiter)**
   - Go to Recruiter Dashboard
   - Find candidate in "Candidates & Interviews" tab
   - Click "Generate AI Interview Link"
   - Copy the generated link

6. **Take Interview (as Candidate)**
   - Open the interview link
   - Answer all 5 questions
   - View final score

7. **View Rankings (as Recruiter)**
   - Go to Recruiter Dashboard
   - Check "Candidates & Interviews" tab
   - See candidates ranked by interview score

## Key Files

- `server/routes/interviewSession.js` - Interview Q&A endpoints
- `server/services/interviewService.js` - Gemini API integration
- `client/src/pages/InterviewPage.jsx` - Interview UI
- `server/models/InterviewSession.js` - Session data model
- `server/models/InterviewQuestion.js` - Question data model

## Troubleshooting

### Backend won't start
```
Error: Cannot find package '@google/generative-ai'
```
Solution: Run `npm install` in server directory

### 400 Bad Request on interview start
- Check browser console for error details
- Verify all required fields are sent
- Check server logs for validation errors

### Gemini API errors
- Verify GEMINI_API_KEY in .env
- System uses fallback questions if API fails
- Check server console for detailed errors

### Interview link not working
- Ensure candidate is logged in
- Check token hasn't expired (7 days)
- Verify browser console for errors

## API Testing with cURL

### Get Interview Details
```bash
curl http://localhost:5555/api/ai-interview/{token}
```

### Start Interview Session
```bash
curl -X POST http://localhost:5555/api/interview-session/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "candidateId": "user_id",
    "jobRole": "Software Engineer",
    "interviewToken": "interview_token"
  }'
```

### Submit Answer
```bash
curl -X POST http://localhost:5555/api/interview-session/answer \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_id",
    "questionId": "question_id",
    "answer": "Your answer here"
  }'
```

### Complete Interview
```bash
curl -X POST http://localhost:5555/api/interview-session/{sessionId}/complete
```

## System Status

✅ Backend integrated
✅ Frontend integrated
✅ Gemini API integration
✅ Fallback questions
✅ Interview link generation
✅ Score tracking
✅ Candidate ranking

Ready to use!
