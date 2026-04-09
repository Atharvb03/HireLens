# AI Interview Integration - Quick Start Guide

## What's New

The AI Interview feature is now fully integrated into HireLens. Recruiters can send AI-powered interview links to candidates, and candidates can take these interviews with automatic score tracking and ranking.

## Quick Setup (5 minutes)

### Step 1: Configure Email (Gmail)
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Generate and copy the 16-character app password
4. Update `server/.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   AI_INTERVIEW_BASE_URL=http://localhost:3001
   ```

### Step 2: Start Backend
```bash
cd server
npm run dev
```

### Step 3: Start Frontend
```bash
cd client
npm run dev
```

## How to Use

### For Recruiters

1. **Send Interview Link**
   - Go to "Candidates & Interviews" tab
   - Select a candidate
   - Click "Send AI Interview Link"
   - Candidate receives email with interview link

2. **View Rankings**
   - After candidates complete interviews
   - See "AI Interview Rankings" section
   - Candidates ranked by score (highest first)

### For Candidates

1. **View Pending Interviews**
   - Go to "AI Interviews" tab
   - See all pending interviews
   - Click "Start Interview" to take the interview

2. **View Completed Interviews**
   - See score and feedback
   - View correct answers count
   - Check completion date

## Key Features

✅ **Unique Interview Links** - Each candidate gets a unique, secure link
✅ **Email Notifications** - Automatic email with interview link
✅ **7-Day Expiration** - Links expire after 7 days
✅ **Auto Score Update** - Scores automatically reflected
✅ **Candidate Ranking** - Candidates ranked by interview score
✅ **Feedback Display** - AI feedback shown to candidates
✅ **Interview History** - Track all interviews taken

## API Endpoints

### Send Interview Link
```
POST /api/ai-interview/send-link
Authorization: Bearer {token}
{
  "candidateId": "user-id",
  "jobId": "job-id"
}
```

### Update Score (Called by AI Interview System)
```
POST /api/ai-interview/update-score
{
  "interviewToken": "token",
  "score": 85,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "feedback": "Great performance"
}
```

### Get Interview Rankings
```
GET /api/ai-interview/job/{jobId}
Authorization: Bearer {token}
```

### Get Candidate Interviews
```
GET /api/ai-interview/candidate/all
Authorization: Bearer {token}
```

## Environment Variables

Add to `server/.env`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
AI_INTERVIEW_BASE_URL=http://localhost:3001
```

## Troubleshooting

**Email not sending?**
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify Gmail app password (16 characters)
- Check server logs

**Interview link not working?**
- Verify AI_INTERVIEW_BASE_URL is correct
- Check if AI Interview system is running on port 3001

**Score not updating?**
- Verify AI Interview system calls the update-score endpoint
- Check interviewToken matches

## Files Updated

- `server/models/AIInterview.js` - Database model
- `server/services/aiInterviewService.js` - Service layer
- `server/routes/aiInterview.js` - API routes
- `server/server.js` - Route registration
- `server/.env` - Configuration
- `client/src/pages/RecruiterDashboard.jsx` - Send link button + rankings
- `client/src/pages/CandidateDashboard.jsx` - AI Interviews tab

## Next: Integrate with AI Interview System

Your AI Interview system should call this endpoint after candidate completes:

```bash
POST http://localhost:5555/api/ai-interview/update-score
Content-Type: application/json

{
  "interviewToken": "token-from-link",
  "score": 85,
  "totalQuestions": 10,
  "correctAnswers": 8,
  "feedback": "Excellent technical knowledge"
}
```

That's it! The AI Interview integration is ready to use.
