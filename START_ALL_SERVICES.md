# Start All Services - Complete Guide

## System Architecture

Your HireLens platform has 3 separate services that need to run:

```
┌─────────────────────────────────────────────────────────┐
│                    HireLens Platform                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Frontend (React)          Port 3000                  │
│     client/                                              │
│                                                           │
│  2. Backend (Node.js/Express) Port 5555                  │
│     server/                                              │
│                                                           │
│  3. AI Interview (FastAPI)    Port 8000                  │
│     server/AI Inter/backend/                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Start All Services

### Terminal 1: Start Frontend

```bash
cd client
npm run dev
```

**Expected output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:3000
```

### Terminal 2: Start Backend

```bash
cd server
npm run dev
```

**Expected output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
📍 API Health: http://localhost:5555/api/health
```

### Terminal 3: Start AI Interview System

```bash
cd server/AI\ Inter/backend
python app.py
```

**Or if using virtual environment:**

```bash
cd server/AI\ Inter/backend
source venv/Scripts/activate  # On Windows
python app.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

## ✅ Verification

### Check Frontend
- Go to http://localhost:3000
- Should see HireLens landing page

### Check Backend
- Go to http://localhost:5555/api/health
- Should see: `{"status": "Server is running", "timestamp": "..."}`

### Check AI Interview
- Go to http://localhost:8000/health
- Should see: `{"status": "healthy", "environment": "..."}`

## 🔄 Complete Flow

### 1. Recruiter Generates Interview Link
```
Frontend (3000)
    ↓
Backend (5555)
    ↓
Generate unique link
    ↓
Display link to recruiter
```

### 2. Candidate Takes Interview
```
Frontend (3000)
    ↓
Click "Start Interview"
    ↓
Redirect to AI Interview (8000)
    ↓
AI Interview System
    ├─ Generate questions (using Gemini API)
    ├─ Present questions
    ├─ Record answers
    ├─ Evaluate answers
    └─ Calculate score
```

### 3. Score Recorded
```
AI Interview (8000)
    ↓
Call Backend (5555)
    ↓
Update score in database
    ↓
Recruiter sees rankings
```

## 📋 Port Configuration

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Frontend | 3000 | http://localhost:3000 | React App |
| Backend | 5555 | http://localhost:5555 | Node.js API |
| AI Interview | 8000 | http://localhost:8000 | FastAPI |

## 🔧 Configuration Files

### Frontend (.env if needed)
```
VITE_API_URL=http://localhost:5555
```

### Backend (server/.env)
```
MONGODB_URI=mongodb+srv://...
PORT=5555
AI_INTERVIEW_BASE_URL=http://localhost:8000
```

### AI Interview (server/AI Inter/backend/.env)
```
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=sqlite:///./ai_interview.db
```

## 🎯 Quick Start (All Services)

**Open 3 terminals and run:**

**Terminal 1:**
```bash
cd client && npm run dev
```

**Terminal 2:**
```bash
cd server && npm run dev
```

**Terminal 3:**
```bash
cd server/AI\ Inter/backend && python app.py
```

**Wait for all to start, then:**
- Go to http://localhost:3000
- Login as Admin
- Generate interview link
- Share link with candidate
- Candidate clicks link → AI Interview opens on port 8000

## 🐛 Troubleshooting

### Frontend Not Loading
- Check if running on port 3000
- Check for errors in terminal
- Clear browser cache

### Backend Not Responding
- Check if running on port 5555
- Check MongoDB connection
- Check for errors in terminal

### AI Interview Not Opening
- Check if running on port 8000
- Check if AI_INTERVIEW_BASE_URL is correct (http://localhost:8000)
- Check for Python errors in terminal

### Port Already in Use
```bash
# Find process using port
lsof -i :3000   # Frontend
lsof -i :5555   # Backend
lsof -i :8000   # AI Interview

# Kill process (if needed)
kill -9 <PID>
```

## 📊 System Status Check

### Check All Services Running

```bash
# Terminal 1: Frontend
curl http://localhost:3000

# Terminal 2: Backend
curl http://localhost:5555/api/health

# Terminal 3: AI Interview
curl http://localhost:8000/health
```

**Expected responses:**
- Frontend: HTML page
- Backend: `{"status": "Server is running", ...}`
- AI Interview: `{"status": "healthy", ...}`

## 🔄 Interview Flow

```
1. Recruiter Dashboard (3000)
   ↓
2. Generate Interview Link
   ↓
3. Link displayed: http://localhost:8000/interview/{token}
   ↓
4. Recruiter copies and shares link
   ↓
5. Candidate receives link
   ↓
6. Candidate clicks link
   ↓
7. AI Interview System (8000) opens
   ├─ Generates questions using Gemini API
   ├─ Presents questions to candidate
   ├─ Records answers
   ├─ Evaluates answers
   └─ Calculates score
   ↓
8. Score sent to Backend (5555)
   ↓
9. Backend updates database
   ↓
10. Recruiter sees rankings (3000)
```

## ✨ Features Working

✅ Interview link generation
✅ Link display in dashboard
✅ Link copying
✅ Manual sharing
✅ AI Interview system
✅ Question generation (Gemini API)
✅ Answer evaluation
✅ Score calculation
✅ Score recording
✅ Candidate ranking

## 📝 Notes

- All 3 services must be running for full functionality
- Frontend communicates with Backend (5555)
- Backend communicates with AI Interview (8000)
- AI Interview uses Gemini API for question generation
- Scores are automatically sent back to Backend

## 🎉 You're Ready!

All services are configured and ready to run. Just start all 3 in separate terminals and you're good to go!

---

**Next:** Open 3 terminals and start all services! 🚀
