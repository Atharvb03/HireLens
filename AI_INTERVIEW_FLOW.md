# AI Interview Integration - Complete User Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HireLens Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Recruiter       │         │  Candidate       │          │
│  │  Dashboard       │         │  Dashboard       │          │
│  └────────┬─────────┘         └────────┬─────────┘          │
│           │                            │                     │
│           │ Send Interview Link        │ View Pending       │
│           │                            │ Interviews         │
│           └────────────┬───────────────┘                     │
│                        │                                     │
│                   ┌────▼─────────────┐                       │
│                   │  AI Interview    │                       │
│                   │  Service         │                       │
│                   └────┬─────────────┘                       │
│                        │                                     │
│         ┌──────────────┼──────────────┐                      │
│         │              │              │                      │
│    ┌────▼────┐   ┌────▼────┐   ┌────▼────┐                 │
│    │ Email   │   │ Database │   │ Ranking │                 │
│    │ Service │   │ (MongoDB)│   │ System  │                 │
│    └─────────┘   └─────────┘   └─────────┘                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Complete User Flow

### Phase 1: Recruiter Sends Interview Link

**Step 1: Recruiter Selects Candidate**
```
Recruiter Dashboard → Candidates & Interviews Tab
↓
View list of candidates ranked by match score
↓
Click on a candidate to select
```

**Step 2: Send Interview Link**
```
Selected Candidate Panel → "Send AI Interview Link" Button
↓
System creates interview session:
  - Generates unique 64-character token
  - Creates interview record in database
  - Sets expiration to 7 days from now
  - Generates interview link: http://localhost:3001/interview/{token}
↓
Email sent to candidate with:
  - Job title
  - Interview details
  - Expiration date
  - Clickable "Start Interview" button
↓
Alert: "AI Interview link sent to [Candidate Name]!"
```

**Database Record Created:**
```json
{
  "_id": "ObjectId",
  "candidateId": "user-id",
  "jobId": "job-id",
  "recruiterId": "recruiter-id",
  "interviewLink": "http://localhost:3001/interview/abc123...",
  "interviewToken": "abc123...",
  "status": "pending",
  "score": null,
  "totalQuestions": 0,
  "correctAnswers": 0,
  "feedback": null,
  "expiresAt": "2024-03-18T10:30:00Z",
  "emailSent": true,
  "dashboardNotified": false,
  "createdAt": "2024-03-11T10:30:00Z"
}
```

### Phase 2: Candidate Receives and Takes Interview

**Step 1: Candidate Receives Email**
```
Email arrives with:
- Subject: "AI Interview Invitation - [Job Title] at HireLens"
- Body: Job details, interview format, expiration date
- CTA: "Start Interview" button (links to interview)
- Fallback: Direct link to interview
```

**Step 2: Candidate Views Pending Interview**
```
Candidate Dashboard → AI Interviews Tab
↓
Pending Interviews Section:
  - Job Title: [Job Title]
  - From: [Recruiter Name]
  - Expires: [Date]
  - Button: "Start Interview"
↓
Click "Start Interview"
↓
Opens interview link in new tab
```

**Step 3: Candidate Takes Interview**
```
AI Interview System (external):
  - Presents questions
  - Records answers
  - Calculates score
  - Generates feedback
↓
After completion, calls:
  POST /api/ai-interview/update-score
  {
    "interviewToken": "abc123...",
    "score": 85,
    "totalQuestions": 10,
    "correctAnswers": 8,
    "feedback": "Excellent technical knowledge..."
  }
```

### Phase 3: Score Update and Ranking

**Step 1: Score Recorded**
```
Backend receives score update:
↓
Validates interview token
↓
Updates interview record:
  - status: "completed"
  - score: 85
  - totalQuestions: 10
  - correctAnswers: 8
  - feedback: "Excellent..."
  - completedAt: now()
↓
Interview record updated in database
```

**Step 2: Candidate Sees Score**
```
Candidate Dashboard → AI Interviews Tab
↓
Completed Interviews Section:
  - Job Title: [Job Title]
  - From: [Recruiter Name]
  - Score: 85%
  - Correct Answers: 8/10
  - Completed: [Date]
  - Feedback: "Excellent technical knowledge..."
```

**Step 3: Recruiter Sees Rankings**
```
Recruiter Dashboard → Candidates & Interviews Tab
↓
AI Interview Rankings Section:
  #1 - Candidate A - 85% - 8/10 correct
  #2 - Candidate B - 78% - 7/10 correct
  #3 - Candidate C - 72% - 6/10 correct
↓
Candidates ranked by score (highest first)
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ RECRUITER SENDS INTERVIEW                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │ Create Interview Session        │
        │ - Generate unique token         │
        │ - Create DB record              │
        │ - Set 7-day expiration          │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │ Send Email to Candidate         │
        │ - Job details                   │
        │ - Interview link                │
        │ - Expiration date               │
        └─────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ CANDIDATE TAKES INTERVIEW                                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │ Candidate Clicks Interview Link │
        │ - Validates token               │
        │ - Checks expiration             │
        │ - Loads interview               │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │ AI Interview System             │
        │ - Presents questions            │
        │ - Records answers               │
        │ - Calculates score              │
        │ - Generates feedback            │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │ POST /update-score              │
        │ - Token                         │
        │ - Score                         │
        │ - Correct answers               │
        │ - Feedback                      │
        └─────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ SCORE RECORDED & RANKING UPDATED                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │ Update Interview Record         │
        │ - Mark as completed             │
        │ - Store score                   │
        │ - Store feedback                │
        │ - Set completion time           │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │ Candidate Sees Score            │
        │ - In AI Interviews tab          │
        │ - Completed section             │
        │ - Score & feedback              │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │ Recruiter Sees Rankings         │
        │ - All candidates ranked         │
        │ - Sorted by score               │
        │ - In Candidates tab             │
        └─────────────────────────────────┘
```

## Interview Status Lifecycle

```
┌─────────┐
│ PENDING │  ← Interview link sent, waiting for candidate
└────┬────┘
     │
     ▼
┌──────────────┐
│ IN_PROGRESS  │  ← Candidate started the interview
└────┬─────────┘
     │
     ├─────────────────────────────────┐
     │                                 │
     ▼                                 ▼
┌──────────────┐              ┌──────────────┐
│ COMPLETED    │              │ EXPIRED      │
│ (Score: 85%) │              │ (7 days old) │
└──────────────┘              └──────────────┘
```

## Email Template

```
Subject: AI Interview Invitation - [Job Title] at HireLens

Dear [Candidate Name],

You have been invited to take an AI-powered interview for the position of [Job Title].

Interview Details:
- Position: [Job Title]
- Duration: ~30 minutes
- Format: AI-based technical interview
- Expires in: 7 days

Click the link below to start your interview:
[Start Interview Button]

Or copy this link: http://localhost:3001/interview/[token]

Best of luck!

HireLens Team
```

## API Response Examples

### Send Interview Link Response
```json
{
  "success": true,
  "message": "Interview link sent to candidate",
  "interview": {
    "interviewId": "507f1f77bcf86cd799439011",
    "candidateName": "John Doe",
    "candidateEmail": "john@example.com",
    "jobTitle": "Senior Developer",
    "interviewLink": "http://localhost:3001/interview/abc123...",
    "expiresAt": "2024-03-18T10:30:00Z"
  }
}
```

### Update Score Response
```json
{
  "success": true,
  "message": "Interview score updated",
  "interview": {
    "interviewId": "507f1f77bcf86cd799439011",
    "candidateId": "507f1f77bcf86cd799439012",
    "score": 85,
    "status": "completed"
  }
}
```

### Get Rankings Response
```json
{
  "success": true,
  "interviews": [
    {
      "rank": 1,
      "candidateName": "John Doe",
      "candidateEmail": "john@example.com",
      "score": 85,
      "totalQuestions": 10,
      "correctAnswers": 8,
      "completedAt": "2024-03-11T14:30:00Z"
    },
    {
      "rank": 2,
      "candidateName": "Jane Smith",
      "candidateEmail": "jane@example.com",
      "score": 78,
      "totalQuestions": 10,
      "correctAnswers": 7,
      "completedAt": "2024-03-11T15:00:00Z"
    }
  ],
  "totalCandidates": 2
}
```

## Key Features Summary

| Feature | Recruiter | Candidate |
|---------|-----------|-----------|
| Send Interview Link | ✅ | - |
| View Pending Interviews | - | ✅ |
| View Completed Interviews | ✅ (Rankings) | ✅ (Score & Feedback) |
| Email Notifications | - | ✅ |
| Interview Expiration | ✅ (7 days) | ✅ (Shown in UI) |
| Score Tracking | ✅ | ✅ |
| Candidate Ranking | ✅ | - |
| Feedback Display | ✅ | ✅ |

## Security Features

- **Unique Tokens**: 64-character cryptographic tokens
- **Token Validation**: Tokens validated before interview access
- **Expiration**: Interviews expire after 7 days
- **Authentication**: Recruiter endpoints require authentication
- **Email Verification**: Email sent flag prevents duplicate sends
- **Status Tracking**: Interview status prevents invalid transitions

## Performance Considerations

- **Database Indexing**: Indexes on candidateId, jobId, interviewToken
- **Pagination**: Rankings support pagination for large candidate lists
- **Caching**: Interview links cached in browser
- **Email Queue**: Emails sent asynchronously (non-blocking)

## Monitoring & Logging

All operations logged with:
- Timestamp
- User ID
- Action performed
- Result (success/failure)
- Error details (if applicable)

Example log:
```
=== SEND AI INTERVIEW LINK ===
Recruiter: 507f1f77bcf86cd799439011
Candidate: 507f1f77bcf86cd799439012
Job: 507f1f77bcf86cd799439013
=== INTERVIEW LINK SENT ===

=== UPDATE INTERVIEW SCORE ===
Token: abc123...
Score: 85
Total Questions: 10
Correct Answers: 8
=== SCORE UPDATED ===
```

This completes the AI Interview integration with full tracking, ranking, and notification capabilities.
