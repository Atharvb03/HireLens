# HireLens - Quick Reference Guide

## 🚀 Start the Application

### Terminal 1: Backend
```bash
cd server
npm run dev
```

### Terminal 2: Frontend
```bash
cd client
npm run dev
```

### Browser
```
http://localhost:3000
```

---

## 📋 Key Features

### 1. Real-Time Resume Analysis
- Upload resume → Instant analysis
- Match score calculated in real-time
- All 6 metrics displayed

### 2. Smart Application Gating
- **Score >= 70%**: ✓ Submit button enabled
- **Score < 70%**: ✗ Submit button disabled

### 3. Skill Gap Suggestions
- Shows missing skills
- Provides learning suggestions
- Recommends resources

### 4. Job Recommendations
- "Find Better Matching Jobs" button
- Top 5 matching jobs displayed
- Sorted by match score

---

## 🧪 Quick Test

### Test High Match (>= 70%)
1. Login as candidate
2. Browse jobs
3. Click "Apply Now"
4. Upload resume with all required skills
5. **Expected**: Score >= 70%, submit button ENABLED

### Test Low Match (< 70%)
1. Login as candidate
2. Browse jobs
3. Click "Apply Now"
4. Upload resume with few required skills
5. **Expected**: Score < 70%, submit button DISABLED, skill gaps shown

---

## 📊 Match Score Breakdown

| Component | Weight | Example |
|-----------|--------|---------|
| Skill Match | 35% | 100% |
| Semantic Similarity | 25% | 80% |
| Experience Match | 20% | 100% |
| Education Match | 10% | 85% |
| Project Relevance | 10% | 90% |
| **Final Score** | **100%** | **92%** |

---

## 🎯 Scoring Examples

### Perfect Match (92%)
- All required skills present
- Relevant experience
- Good education
- Relevant projects
- ✓ Can apply

### Partial Match (58%)
- Some required skills
- Mid-level experience
- Bachelor's degree
- Generic projects
- ✗ Cannot apply (< 70%)

### Poor Match (35%)
- Few required skills
- Junior experience
- No degree
- No relevant projects
- ✗ Cannot apply (< 70%)

---

## 🔧 Configuration

| Setting | Value |
|---------|-------|
| Backend Port | 5555 |
| Frontend Port | 3000 |
| Match Threshold | 70% |
| Database | MongoDB Atlas |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `server/routes/analysis.js` | Analysis endpoints |
| `server/server.js` | Main server file |
| `client/src/pages/CandidateDashboard.jsx` | Candidate UI |
| `server/.env` | Configuration |
| `client/vite.config.js` | Frontend proxy |

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Analysis not showing | Refresh page |
| Submit button always disabled | Check if score >= 70% |
| Port already in use | Kill node processes |
| Resume not uploading | Try .txt file first |
| Backend not responding | Check port 5555 |

---

## ✅ Verification Checklist

- [ ] Backend running on port 5555
- [ ] Frontend running on port 3000
- [ ] Can login as candidate
- [ ] Can browse jobs
- [ ] Can upload resume
- [ ] Real-time analysis works
- [ ] Submit button conditional on score
- [ ] Skill gaps show when score < 70%
- [ ] Job recommendations work
- [ ] Can submit when score >= 70%

---

## 📞 API Endpoints

### Analysis Endpoints
```
POST /api/analysis/analyze-resume-for-job
POST /api/analysis/find-best-jobs
```

### Candidate Endpoints
```
POST /api/candidates/apply
GET /api/candidates/applications/:userId
DELETE /api/candidates/:candidateId
```

### Job Endpoints
```
GET /api/jobs
POST /api/jobs
DELETE /api/jobs/:id
```

---

## 🎓 Learning Resources

- `REAL_TIME_RESUME_ANALYSIS.md` - Feature documentation
- `TEST_REAL_TIME_ANALYSIS.md` - Testing guide
- `IMPROVED_MATCHING_ALGORITHM.md` - Algorithm details
- `FEATURE_COMPLETE_SUMMARY.md` - Complete overview

---

## 🚀 System Status

✅ Backend: Running
✅ Frontend: Ready
✅ Real-time Analysis: Active
✅ All Features: Working
✅ Production Ready: Yes

---

**Ready to use!** 🎉
