# Quick Reference - Start All Services

## 🚀 Start Everything (3 Terminals)

### Terminal 1: Frontend
```bash
cd client
npm run dev
```
✅ Port 3000

### Terminal 2: Backend
```bash
cd server
npm run dev
```
✅ Port 5555

### Terminal 3: AI Interview
```bash
cd server/AI\ Inter/backend
python app.py
```
✅ Port 8000

## ✅ Verify All Running

| Service | URL | Check |
|---------|-----|-------|
| Frontend | http://localhost:3000 | See landing page |
| Backend | http://localhost:5555/api/health | See JSON response |
| AI Interview | http://localhost:8000/health | See JSON response |

## 🎯 Test Flow

1. Go to http://localhost:3000
2. Login as Admin
3. Go to "Candidates & Interviews"
4. Select candidate
5. Click "Generate AI Interview Link"
6. Copy link
7. Share with candidate
8. Candidate clicks link
9. AI Interview opens on port 8000
10. Candidate takes interview
11. Score recorded
12. Recruiter sees rankings

## 🔧 Ports

- **3000** = Frontend (React)
- **5555** = Backend (Node.js)
- **8000** = AI Interview (FastAPI)

## ⚠️ If Port Already in Use

```bash
# Find what's using the port
lsof -i :3000
lsof -i :5555
lsof -i :8000

# Kill it (if needed)
kill -9 <PID>
```

## 📋 Configuration

**Backend (.env):**
```
AI_INTERVIEW_BASE_URL=http://localhost:8000
```

**AI Interview (.env):**
```
GEMINI_API_KEY=your-key
```

## 🎉 Done!

All services running = Full system working! 🚀
