# HireLens - Final Setup & Testing Guide

## ✅ System Status
- **Backend**: Port 5555 ✅
- **Frontend**: Port 3000 ✅
- **Database**: MongoDB Atlas ✅
- **Match Score Algorithm**: Fixed ✅

## 🚀 Quick Start Commands

### Terminal 1: Start Backend
```bash
cd server
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
```

### Terminal 2: Start Frontend
```bash
cd client
npm run dev
```

Expected output:
```
Local: http://localhost:3000/
```

### Browser
```
http://localhost:3000
```

---

## 📋 Complete Testing Workflow

### Step 1: Create Admin Account
1. Click **"Admin Login"** button
2. Click **"Sign Up"** link
3. Fill in:
   - Email: `admin@test.com`
   - Password: `admin123`
   - Company: `Test Company`
4. Click **"Sign Up"**

### Step 2: Post a Job
1. Go to **"Job Management"** tab
2. Click **"Post New Job"**
3. Fill in:
   - **Title**: `React Developer`
   - **Description**: `We are looking for an experienced React developer with strong JavaScript skills. Must have experience with Node.js and MongoDB. You should be familiar with Express and REST APIs.`
   - **Required Skills**: `React, JavaScript, Node.js, MongoDB`
   - **Experience**: `2-3 years`
   - **Salary**: `$50k-$70k`
   - **Location**: `Remote`
4. Click **"Post Job"**

### Step 3: Create Candidate Account
1. Click **"Logout"**
2. Click **"Candidate Login"**
3. Click **"Sign Up"**
4. Fill in:
   - Name: `John Doe`
   - Email: `candidate@test.com`
   - Password: `candidate123`
5. Click **"Sign Up"**

### Step 4: Apply for Job
1. Go to **"Browse Jobs"** tab
2. Find **"React Developer"** job
3. Click **"Apply Now"**
4. In the modal:
   - **Upload Resume**: Select `test_resume.txt` from project root
   - **Availability**: Select `Immediate Joining`
   - Click **"Submit Application"**

### Step 5: View Match Score
1. Go to **"My Applications"** tab
2. **You should see the Match Score** (should be around 49-60%)

### Step 6: View in Recruiter Dashboard
1. Click **"Logout"**
2. Login as admin (`admin@test.com` / `admin123`)
3. Go to **"Candidates & Interviews"** tab
4. **You should see the candidate ranked with Match Score**

---

## 🔍 Understanding Match Score

### How It's Calculated:
- **Skill Match (40% weight)**: Compares extracted skills with job requirements
- **Semantic Similarity (60% weight)**: Analyzes common words between resume and job description
- **Final Score**: Weighted average of both

### Example:
```
Resume Skills: React, JavaScript, Node.js, MongoDB, Express, TypeScript, CSS, REST, API
Job Required Skills: React, JavaScript, Node.js, MongoDB

Skill Match Score: 100% (all 4 required skills present)
Semantic Similarity: 15% (few common words)
Final Match Score: (100 * 0.4) + (15 * 0.6) = 49%
```

### Why Low Semantic Similarity?
- Resume and job description are different documents
- Resume focuses on experience and projects
- Job description focuses on requirements
- This is normal and expected behavior

---

## 📊 Expected Results

| Component | Expected Value |
|-----------|-----------------|
| Skill Match Score | 100% (all 4 skills present) |
| Semantic Similarity | 10-20% (different document types) |
| Final Match Score | 40-60% (weighted average) |
| Extracted Skills | react, javascript, node.js, mongodb, express, typescript, css, rest, api |

---

## 🐛 Troubleshooting

### Match Score is 0%
1. Check server console for errors
2. Make sure resume file is uploaded
3. Verify file is `.txt`, `.pdf`, or `.docx`
4. Check if resume contains required skills

### Match Score is Not Showing
1. Refresh the page
2. Check browser console for errors
3. Make sure backend is running on port 5555
4. Check frontend proxy in `client/vite.config.js`

### File Upload Fails
1. Try with `.txt` file first
2. Check file size (should be < 10MB)
3. Check server console for file parsing errors

### "Already applied to this job"
1. Use a different candidate account
2. Or create a new job to apply to

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `server/.env` | Backend configuration (PORT=5555) |
| `client/vite.config.js` | Frontend proxy configuration |
| `server/services/matchingService.js` | Matching algorithm |
| `server/routes/candidates.js` | Application endpoint |
| `test_resume.txt` | Test resume file |
| `test_matching.js` | Algorithm test script |

---

## 🔧 Configuration

### Backend Port
Edit `server/.env`:
```
PORT=5555
```

### Frontend Proxy
Edit `client/vite.config.js`:
```javascript
proxy: {
  '/api': 'http://localhost:5555'
}
```

---

## ✨ Features Implemented

✅ Resume file upload (PDF, DOCX, TXT)
✅ Text extraction from files
✅ Skill extraction from resume
✅ Match score calculation
✅ Candidate ranking by score
✅ Availability selection
✅ Notice period input
✅ Application deletion
✅ Interview score tracking
✅ Feedback management

---

## 📞 Support

If match score is still not showing:
1. Check server console for "Match Calculation" logs
2. Verify resume text is being extracted
3. Verify skills are being extracted
4. Check if match score is being saved to database

---

## 🎯 Next Steps

1. Test with different resumes
2. Test with different jobs
3. Verify ranking updates when new candidates apply
4. Test interview score updates
5. Test application deletion

---

**System is ready to use!** 🚀
