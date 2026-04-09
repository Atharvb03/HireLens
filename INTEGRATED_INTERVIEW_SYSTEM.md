# Integrated Interview System - Complete Guide

## ✅ What Changed

The AI Interview system is now **fully integrated** into the main Node.js backend:

### Before
- Separate FastAPI server on port 8000
- SQLite database
- Manual startup required
- External system

### Now
- Integrated into Node.js backend (port 5555)
- MongoDB database
- Automatic startup with main server
- Single unified system

## 🎯 How It Works

### 1. Recruiter Generates Interview Link
```
Recruiter Dashboard
    ↓
Select Candidate
    ↓
Click "Generate AI Interview Link"
    ↓
Link displayed: http://localhost:3000/interview/{token}
```

### 2. Candidate Takes Interview
```
Candidate Dashboard
    ↓
Click "Start Interview"
    ↓
Redirects to: http://localhost:3000/interview/{token}
    ↓
Interview Page Loads
    ├─ Calls /api/interview-session/start
    ├─ Generates questions using Gemini API
    ├─ Displays questions one by one
    ├─ Evaluates answers using Gemini API
    └─ Records scores in MongoDB
```

### 3. Score Recorded
```
Interview Complete
    ↓
Calls /api/interview-session/{sessionId}/complete
    ↓
Calculates final score
    ↓
Updates MongoDB
    ↓
Calls /api/ai-interview/update-score
    ↓
Recruiter sees rankings
```

## 📋 New Files Created

### Backend
- `server/routes/interviewSession.js` - Interview session endpoints
- `server/models/InterviewSession.js` - MongoDB model for sessions
- `server/models/InterviewQuestion.js` - MongoDB model for questions
- `server/services/interviewService.js` - Gemini API integration

### Frontend
- `client/src/pages/InterviewPage.jsx` - Interview UI component
- Updated `client/src/App.jsx` - Added interview route

## 🔄 API Endpoints

### Start Interview Session
```
POST /api/interview-session/start
{
  "candidateId": "user-id",
  "jobRole": "Senior Developer",
  "jobDescription": "...",
  "requiredSkills": ["JavaScript", "React"],
  "candidateSkills": ["JavaScript", "React"],
  "interviewToken": "unique-token"
}
```

### Get Interview Session
```
GET /api/interview-session/{sessionId}
```

### Submit Answer
```
POST /api/interview-session/answer
{
  "sessionId": "session-id",
  "questionId": "question-id",
  "answer": "candidate's answer"
}
```

### Complete Interview
```
POST /api/interview-session/{sessionId}/complete
```

## 📊 Database Schema

### InterviewSession
```javascript
{
  candidateId: ObjectId,
  jobRole: String,
  jobDescription: String,
  requiredSkills: [String],
  candidateSkills: [String],
  interviewToken: String (unique),
  status: "pending|in_progress|completed|expired",
  finalScore: Number,
  startedAt: Date,
  completedAt: Date,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### InterviewQuestion
```javascript
{
  sessionId: ObjectId,
  questionNumber: Number,
  questionText: String,
  questionType: "mcq|short_answer|coding|descriptive",
  difficulty: "easy|medium|hard",
  candidateAnswer: String,
  score: Number,
  feedback: String,
  answeredAt: Date,
  createdAt: Date
}
```

## 🚀 How to Use

### Step 1: Start Backend (Only One Service Needed!)
```bash
cd server
npm run dev
```

**That's it!** No need to start separate services.

### Step 2: Start Frontend
```bash
cd client
npm run dev
```

### Step 3: Test Interview Flow

**Recruiter:**
1. Go to http://localhost:3000
2. Login as Admin
3. Go to "Candidates & Interviews"
4. Select candidate
5. Click "Generate AI Interview Link"
6. Copy link

**Candidate:**
1. Go to http://localhost:3000
2. Login as Candidate
3. Go to "AI Interviews" tab
4. Click "Start Interview"
5. Answer questions
6. Complete interview

## ✨ Features

✅ **Automatic Question Generation**
- Uses Gemini API
- Based on job role and skills
- Adaptive difficulty

✅ **Automatic Answer Evaluation**
- Uses Gemini API
- Provides score and feedback
- Identifies strengths and improvements

✅ **Real-time Scoring**
- Scores calculated immediately
- Stored in MongoDB
- Displayed to recruiter

✅ **Interview Management**
- 7-day expiration
- Status tracking
- Complete history

✅ **Candidate Experience**
- Clean, intuitive UI
- Progress tracking
- Immediate feedback

✅ **Recruiter Experience**
- Generate links easily
- View rankings
- See detailed scores

## 🔧 Configuration

### .env File
```
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=your-gemini-api-key
PORT=5555
AI_INTERVIEW_BASE_URL=http://localhost:3000
```

**Note:** Uses OPENAI_API_KEY for Gemini API (can be renamed if needed)

## 📈 Interview Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  HireLens Platform                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend (3000)                                         │
│  ├─ Recruiter Dashboard                                 │
│  │  └─ Generate Interview Link                          │
│  │     └─ POST /api/ai-interview/send-link              │
│  │                                                       │
│  └─ Candidate Dashboard                                 │
│     └─ Click "Start Interview"                          │
│        └─ Navigate to /interview/{token}                │
│           └─ Interview Page                             │
│              ├─ POST /api/interview-session/start       │
│              ├─ Gemini API: Generate Questions          │
│              ├─ Display Questions                       │
│              ├─ POST /api/interview-session/answer      │
│              ├─ Gemini API: Evaluate Answer             │
│              ├─ Show Evaluation                         │
│              └─ POST /api/interview-session/complete    │
│                 └─ Calculate Score                      │
│                    └─ POST /api/ai-interview/update-score
│                       └─ Update Rankings                │
│                                                           │
│  Backend (5555)                                          │
│  ├─ Interview Session Routes                            │
│  ├─ Gemini API Integration                              │
│  ├─ MongoDB Storage                                     │
│  └─ Score Calculation                                   │
│                                                           │
│  Database (MongoDB)                                      │
│  ├─ InterviewSession Collection                         │
│  ├─ InterviewQuestion Collection                        │
│  └─ AIInterview Collection                              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## ✅ Verification Checklist

- [ ] Backend running on port 5555
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Gemini API key configured
- [ ] Can generate interview link
- [ ] Can start interview
- [ ] Questions display correctly
- [ ] Answers evaluated correctly
- [ ] Scores recorded
- [ ] Rankings displayed

## 🎉 Benefits

✅ **Single Service**
- No need to start multiple servers
- Simpler deployment
- Easier maintenance

✅ **Unified Database**
- All data in MongoDB
- Consistent schema
- Better integration

✅ **Automatic Startup**
- Starts with main backend
- No manual configuration
- Always available

✅ **Better Performance**
- Local API calls
- No network latency
- Faster response times

✅ **Seamless Integration**
- Same authentication
- Same database
- Same API structure

## 🚀 Deployment

### Development
```bash
# Terminal 1
cd client && npm run dev

# Terminal 2
cd server && npm run dev
```

### Production
```bash
# Single command to start everything
npm run dev  # in server directory
```

## 📝 Notes

- Interview questions are generated dynamically using Gemini API
- Answers are evaluated in real-time using Gemini API
- All data is stored in MongoDB
- Interview links expire after 7 days
- Scores are automatically recorded and ranked

## 🎯 Summary

The AI Interview system is now **fully integrated** into HireLens:

- ✅ No separate server needed
- ✅ Uses MongoDB for storage
- ✅ Automatic question generation
- ✅ Real-time answer evaluation
- ✅ Seamless candidate experience
- ✅ Complete recruiter visibility

**Just start the backend and frontend, and you're ready to go!** 🚀

---

**Next:** Restart your server and test the interview flow!
