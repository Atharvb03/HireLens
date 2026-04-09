# HireLens AI Interview System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Gemini API key (from Google AI Studio)
- Git (optional)

---

## Step 1: Configure Environment Variables

### Backend (.env file)
Create or update `server/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
GEMINI_API_KEY=AIzaSy...
JWT_SECRET=your_jwt_secret_key
PORT=5555
NODE_ENV=development
```

**How to get these:**
- **MONGODB_URI**: MongoDB Atlas → Connect → Drivers → Copy connection string
- **GEMINI_API_KEY**: Google AI Studio → Create API key
- **JWT_SECRET**: Any random string (e.g., `super_secret_key_12345`)

---

## Step 2: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

---

## Step 3: Start the Services

### Terminal 1: Start Backend
```bash
cd server
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
✅ Gemini API client initialized successfully
🚀 Server running on port 5555
```

### Terminal 2: Start Frontend
```bash
cd client
npm run dev
```

Expected output:
```
VITE v5.0.8  ready in 123 ms

➜  Local:   http://localhost:3000/
```

---

## Step 4: Access the System

### Open in Browser
- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:5555/api/health

---

## 📋 User Flows

### For Recruiters

1. **Login**
   - Go to http://localhost:3000
   - Click "Admin Login"
   - Use recruiter credentials

2. **Post a Job**
   - Click "Job Management" tab
   - Click "Post New Job"
   - Fill in job details
   - Click "Post Job"

3. **Generate Interview Link**
   - Click "Candidates & Interviews" tab
   - Select a candidate from the list
   - Click "Generate AI Interview Link"
   - Copy the link
   - Share with candidate manually

4. **View Rankings**
   - After candidates complete interviews
   - Rankings appear in "AI Interview Rankings" section
   - Sorted by score (highest first)

### For Candidates

1. **Login**
   - Go to http://localhost:3000
   - Click "Candidate Login"
   - Use candidate credentials

2. **Browse Jobs**
   - Click "Browse Jobs" tab
   - Search or filter by skills
   - Click "Apply Now"

3. **Upload Resume**
   - Select resume file
   - System analyzes match score
   - If score ≥ 60%, can submit application

4. **Take Interview**
   - Click "AI Interviews" tab
   - Click "Start Interview" on pending interview
   - Answer 10 questions
   - View results after completion

---

## 🔑 Test Credentials

### Recruiter Account
- Email: `recruiter@example.com`
- Password: `password123`

### Candidate Account
- Email: `candidate@example.com`
- Password: `password123`

**Note**: Create your own accounts via registration pages if these don't exist.

---

## 🧪 Testing the Interview System

### Quick Test (5 minutes)

1. **Login as Recruiter**
   - Navigate to http://localhost:3000/admin-login
   - Enter credentials

2. **Create a Test Job**
   - Go to "Job Management"
   - Click "Post New Job"
   - Fill in details:
     - Title: "Frontend Developer"
     - Description: "Build web applications"
     - Skills: "React, JavaScript, CSS"
     - Location: "Remote"
   - Click "Post Job"

3. **Create Test Candidate**
   - Logout and register as candidate
   - Login with candidate account

4. **Generate Interview Link**
   - Login as recruiter
   - Go to "Candidates & Interviews"
   - Select candidate
   - Click "Generate AI Interview Link"
   - Copy the link

5. **Take Interview**
   - Logout and login as candidate
   - Go to "AI Interviews"
   - Click "Start Interview"
   - Answer all 10 questions
   - View results

6. **View Rankings**
   - Login as recruiter
   - Go to "Candidates & Interviews"
   - Scroll down to "AI Interview Rankings"
   - See candidate score

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: `MongoDB connection error`
- Check MONGODB_URI in .env
- Verify username and password
- Check IP whitelist in MongoDB Atlas

**Error**: `API Key configured: false`
- Check GEMINI_API_KEY in .env
- Verify API key is valid
- Restart server

### Frontend Won't Load

**Error**: `Cannot GET /`
- Verify frontend is running on port 3000
- Check browser console for errors
- Clear browser cache

**Error**: `API calls failing`
- Verify backend is running on port 5555
- Check proxy configuration in vite.config.js
- Check browser network tab for API errors

### Interview Not Loading

**Error**: `Interview not found or expired`
- Verify interview token is correct
- Check if interview link is still valid (7-day expiration)
- Verify candidate is logged in

**Error**: `Failed to start interview`
- Check server logs for errors
- Verify Gemini API key is valid
- Check MongoDB connection

---

## 📊 Monitoring

### Check Server Health
```bash
curl http://localhost:5555/api/health
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2026-03-12T10:30:00.000Z"
}
```

### Check Logs

**Backend logs**: Terminal where you ran `npm run dev`
- Look for errors or warnings
- Check API request/response logs

**Frontend logs**: Browser console (F12)
- Check for JavaScript errors
- Check network tab for API calls

---

## 🔧 Configuration

### Change Port Numbers

**Backend** (server/server.js):
```javascript
const PORT = process.env.PORT || 5555
```

**Frontend** (client/vite.config.js):
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': 'http://localhost:5555'
  }
}
```

### Change Interview Settings

**Number of Questions** (server/services/interviewService.js):
- Change `10` to desired number in prompt
- Update fallback questions array

**Interview Expiration** (server/models/InterviewSession.js):
- Change `7 * 24 * 60 * 60 * 1000` to desired milliseconds

**Scoring Threshold** (client/src/pages/CandidateDashboard.jsx):
- Change `60` to desired minimum score

---

## 📚 Documentation

- **System Overview**: SYSTEM_VERIFICATION_COMPLETE.md
- **Interview Flow**: AI_INTERVIEW_COMPLETE.md
- **API Documentation**: Check route files in server/routes/
- **Database Schema**: Check model files in server/models/

---

## 🎯 Next Steps

1. ✅ Start backend and frontend
2. ✅ Create test accounts
3. ✅ Post a test job
4. ✅ Generate interview link
5. ✅ Take interview as candidate
6. ✅ View rankings as recruiter
7. ✅ Deploy to production

---

## 💡 Tips

- **Faster Development**: Use `npm run dev` for hot reload
- **Better Debugging**: Check browser DevTools (F12) and server logs
- **Test Data**: Create multiple test candidates for ranking testing
- **API Testing**: Use Postman or curl to test API endpoints
- **Database**: Use MongoDB Compass to view database records

---

## 🚀 Ready to Go!

Your HireLens AI Interview System is now running. Start with the test flow above and explore the features.

**Happy interviewing!** 🎉

