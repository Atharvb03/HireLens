# HireLens - Quick Start Guide

## 🚀 Start the Application

### Terminal 1: Backend
```bash
cd server
npm run dev
```
Wait for: `✅ MongoDB connected successfully`

### Terminal 2: Frontend
```bash
cd client
npm run dev
```
Wait for: `Local: http://localhost:3000/`

### Browser
```
http://localhost:3000
```

---

## 📝 Testing Workflow

### 1. Admin Login & Post Job
- Click "Admin Login" → "Sign Up"
- Email: `admin@test.com` | Password: `admin123` | Company: `Test Company`
- Go to "Job Management" → "Post New Job"
- Fill in:
  - Title: `React Developer`
  - Description: `We are looking for an experienced React developer with strong JavaScript skills. Must have experience with Node.js and MongoDB. You should be familiar with Express and REST APIs.`
  - Required Skills: `React, JavaScript, Node.js, MongoDB`
  - Experience: `2-3 years`
  - Salary: `$50k-$70k`
  - Location: `Remote`
- Click "Post Job"

### 2. Candidate Login & Apply
- Click "Logout" → "Candidate Login" → "Sign Up"
- Name: `John Doe` | Email: `candidate@test.com` | Password: `candidate123`
- Go to "Browse Jobs" → Find "React Developer" → "Apply Now"
- Upload: `test_resume.txt`
- Availability: `Immediate Joining`
- Click "Submit Application"

### 3. View Match Score
- Go to "My Applications" tab
- **You should see the Match Score** (e.g., "49%")

### 4. View in Recruiter Dashboard
- Logout → Login as admin
- Go to "Candidates & Interviews" tab
- **You should see the candidate ranked with Match Score**

---

## 🔧 Configuration

| Setting | Value |
|---------|-------|
| Backend Port | 5555 |
| Frontend Port | 3000 |
| Database | MongoDB Atlas |
| Frontend Proxy | `/api` → `http://localhost:5555` |

---

## 📊 Match Score Calculation

```
Skill Match Score (40% weight)
+ Semantic Similarity (60% weight)
= Final Match Score (0-100%)
```

### Example:
- Skill Match: 100% (all 4 required skills present)
- Semantic Similarity: 15% (different document types)
- Final Score: (100 × 0.4) + (15 × 0.6) = **49%**

---

## ✅ Features

✅ Resume upload (PDF, DOCX, TXT)
✅ Automatic text extraction
✅ Skill extraction & matching
✅ Match score calculation
✅ Candidate ranking
✅ Interview score tracking
✅ Application management
✅ Recruiter dashboard

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill node processes: `Get-Process node \| Stop-Process -Force` |
| Match score is 0% | Check server console for errors |
| File upload fails | Try with `.txt` file first |
| Can't connect to backend | Verify port 5555 is open |
| Frontend not loading | Check `client/vite.config.js` proxy settings |

---

## 📁 Important Files

- `server/.env` - Backend configuration
- `client/vite.config.js` - Frontend proxy
- `server/services/matchingService.js` - Matching algorithm
- `test_resume.txt` - Test resume file
- `test_matching.js` - Algorithm test

---

## 🎯 Next Steps

1. Test with different resumes
2. Test with different jobs
3. Verify ranking updates
4. Test interview scores
5. Monitor server logs

---

**Ready to go!** 🚀
