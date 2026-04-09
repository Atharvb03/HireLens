# AI Interview Integration - Complete Implementation

## Overview
The AI Interview integration has been fully implemented for the HireLens recruitment platform. This feature allows recruiters to send AI-powered interview links to selected candidates, and candidates can take these interviews. Interview scores are automatically reflected in the system and candidates are ranked by their performance.

## Implementation Summary

### 1. Backend Setup

#### Database Model (`server/models/AIInterview.js`)
- Stores AI interview sessions with the following fields:
  - `candidateId`: Reference to the candidate (User)
  - `jobId`: Reference to the job posting
  - `recruiterId`: Reference to the recruiter who sent the interview
  - `interviewLink`: The unique interview URL
  - `interviewToken`: Unique token for accessing the interview
  - `status`: pending, in_progress, completed, or expired
  - `score`: Interview score (0-100)
  - `totalQuestions`: Total number of questions in the interview
  - `correctAnswers`: Number of correct answers
  - `feedback`: Interview feedback from the AI system
  - `expiresAt`: Interview expiration date (7 days from creation)
  - `emailSent`: Flag indicating if email was sent
  - `dashboardNotified`: Flag indicating if dashboard notification was sent

#### Service Layer (`server/services/aiInterviewService.js`)
Provides methods for:
- `createInterviewSession()`: Creates a new AI interview session with unique token and link
- `getInterviewByToken()`: Retrieves interview details by token (with expiration check)
- `updateInterviewScore()`: Updates interview score when candidate completes the interview
- `getInterviewsForJob()`: Gets all completed interviews for a job (for ranking)
- `getInterviewsForCandidate()`: Gets all interviews for a candidate
- `getPendingInterviews()`: Gets pending interviews for a candidate
- `getCompletedInterviews()`: Gets completed interviews for a candidate
- `markEmailSent()`: Marks email as sent
- `markDashboardNotified()`: Marks dashboard notification as sent

#### API Routes (`server/routes/aiInterview.js`)
- `POST /api/ai-interview/send-link`: Send interview link to candidate (requires authentication)
- `GET /api/ai-interview/:token`: Get interview details by token (public, for candidate access)
- `POST /api/ai-interview/update-score`: Update interview score (called by AI Interview system)
- `GET /api/ai-interview/job/:jobId`: Get all interviews for a job with rankings (requires authentication)
- `GET /api/ai-interview/candidate/all`: Get all interviews for a candidate (requires authentication)
- `GET /api/ai-interview/candidate/pending`: Get pending interviews for a candidate (requires authentication)
- `GET /api/ai-interview/candidate/completed`: Get completed interviews for a candidate (requires authentication)

#### Email Configuration (`server/.env`)
Added the following environment variables:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
AI_INTERVIEW_BASE_URL=http://localhost:3001
```

**Note**: For Gmail, use an App Password (not your regular password). Generate one at: https://myaccount.google.com/apppasswords

### 2. Frontend Implementation

#### Recruiter Dashboard (`client/src/pages/RecruiterDashboard.jsx`)
**New Features:**
- "Send AI Interview Link" button in the candidate selection panel
- `handleSendAIInterview()` function to send interview links to candidates
- `fetchAIInterviewRankings()` function to fetch and display ranked candidates by AI interview score
- AI Interview Rankings section showing:
  - Candidate rank
  - Candidate name and email
  - Interview score (percentage)
  - Number of correct answers
  - Completion date

**How it works:**
1. Recruiter selects a candidate from the list
2. Clicks "Send AI Interview Link" button
3. System creates an interview session and sends email to candidate
4. Interview link is generated and sent via email
5. Recruiter can view AI interview rankings for completed interviews

#### Candidate Dashboard (`client/src/pages/CandidateDashboard.jsx`)
**New Features:**
- New "AI Interviews" tab alongside "Browse Jobs" and "My Applications"
- Pending Interviews section showing:
  - Job title
  - Recruiter name
  - Expiration date
  - "Start Interview" button (clickable link to interview)
- Completed Interviews section showing:
  - Job title
  - Recruiter name
  - Interview score
  - Correct answers / Total questions
  - Completion date
  - Feedback from the AI system

**How it works:**
1. Candidate receives email with interview link
2. Candidate can view pending interviews in the "AI Interviews" tab
3. Candidate clicks "Start Interview" to take the interview
4. After completion, interview appears in "Completed Interviews" section
5. Candidate can see their score and feedback

### 3. Email Notification System

When a recruiter sends an AI interview link:
1. System creates an interview session with unique token
2. Email is sent to candidate with:
   - Job title
   - Interview details (duration, format)
   - Expiration date (7 days)
   - Clickable "Start Interview" button
   - Direct link to interview

Email template includes:
- Professional HireLens branding
- Clear call-to-action
- Interview details
- Expiration warning

### 4. Interview Link Generation

- Each interview gets a unique 64-character token (using crypto.randomBytes)
- Interview link format: `{AI_INTERVIEW_BASE_URL}/interview/{token}`
- Default base URL: `http://localhost:3001`
- Can be customized via `AI_INTERVIEW_BASE_URL` environment variable

### 5. Score Update Flow

When candidate completes the AI interview:
1. AI Interview system calls: `POST /api/ai-interview/update-score`
2. Payload includes: `interviewToken`, `score`, `totalQuestions`, `correctAnswers`, `feedback`
3. System updates interview record with score and marks as completed
4. Candidate can immediately see score in dashboard
5. Recruiter can see ranked candidates by score

### 6. Ranking System

Candidates are ranked by AI interview score:
- Highest score = Rank #1
- Sorted in descending order
- Displayed in recruiter dashboard
- Shows score, correct answers, and completion date

## Configuration Steps

### 1. Email Setup (Gmail)
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Generate app password
4. Copy the 16-character password
5. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

### 2. AI Interview Base URL
Update `.env` with your AI Interview system URL:
```
AI_INTERVIEW_BASE_URL=http://localhost:3001
```

### 3. Start Backend Server
```bash
cd server
npm install  # if not already done
npm run dev
```

## API Integration with AI Interview System

The AI Interview system should call this endpoint after candidate completes interview:

```bash
POST /api/ai-interview/update-score
Content-Type: application/json

{
  "interviewToken": "unique-token-from-link",
  "score": 85,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "feedback": "Great performance on technical questions"
}
```

## User Flows

### Recruiter Flow
1. Go to "Candidates & Interviews" tab
2. Select a candidate from the list
3. Click "Send AI Interview Link"
4. System sends email to candidate
5. View AI Interview Rankings for completed interviews
6. See candidates ranked by score

### Candidate Flow
1. Receive email with interview link
2. Go to "AI Interviews" tab in dashboard
3. See pending interviews
4. Click "Start Interview" to take the interview
5. Complete the interview
6. See score and feedback in "Completed Interviews" section

## Features Implemented

✅ AI interview session creation with unique tokens
✅ Email notifications to candidates
✅ Interview link generation and expiration (7 days)
✅ Score update endpoint for AI Interview system
✅ Candidate dashboard with pending/completed interviews
✅ Recruiter dashboard with send interview link button
✅ AI interview rankings by score
✅ Interview feedback display
✅ Correct answers tracking
✅ Interview status management (pending, in_progress, completed, expired)

## Next Steps (Optional Enhancements)

1. **Interview Reminders**: Send reminder emails 1 day before expiration
2. **Bulk Send**: Send interviews to multiple candidates at once
3. **Interview Analytics**: Dashboard showing interview statistics
4. **Retake Option**: Allow candidates to retake interviews
5. **Interview History**: Archive completed interviews
6. **Custom Questions**: Allow recruiters to customize interview questions
7. **Interview Scheduling**: Schedule interviews for specific times
8. **Interview Feedback**: Detailed feedback from AI system

## Troubleshooting

### Email Not Sending
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Verify Gmail app password is correct (16 characters)
- Check if "Less secure app access" is enabled (if not using app password)
- Check server logs for email errors

### Interview Link Not Working
- Verify `AI_INTERVIEW_BASE_URL` is correct
- Check if AI Interview system is running on the specified port
- Verify interview token is valid and not expired

### Score Not Updating
- Check if AI Interview system is calling the correct endpoint
- Verify `interviewToken` matches the token in the database
- Check server logs for update errors

## Files Modified/Created

### Backend
- `server/models/AIInterview.js` - AI interview database model
- `server/services/aiInterviewService.js` - AI interview service layer
- `server/routes/aiInterview.js` - AI interview API routes
- `server/server.js` - Added AI interview routes registration
- `server/.env` - Added email and AI interview configuration

### Frontend
- `client/src/pages/RecruiterDashboard.jsx` - Added send interview link button and rankings
- `client/src/pages/CandidateDashboard.jsx` - Added AI interviews tab with pending/completed interviews

## Testing

### Test Sending Interview Link
```bash
curl -X POST http://localhost:5555/api/ai-interview/send-link \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "candidate-user-id",
    "jobId": "job-id"
  }'
```

### Test Getting Interview by Token
```bash
curl http://localhost:5555/api/ai-interview/unique-token
```

### Test Updating Score
```bash
curl -X POST http://localhost:5555/api/ai-interview/update-score \
  -H "Content-Type: application/json" \
  -d '{
    "interviewToken": "unique-token",
    "score": 85,
    "totalQuestions": 10,
    "correctAnswers": 8,
    "feedback": "Great performance"
  }'
```

## Summary

The AI Interview integration is now complete and ready for use. Recruiters can send interview links to candidates, candidates can take interviews, and scores are automatically reflected in the system with ranking functionality.
