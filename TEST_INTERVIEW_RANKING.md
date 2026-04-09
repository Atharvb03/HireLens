# Test Interview Scoring and Ranking

## Quick Test (10 minutes)

### Step 1: Restart Backend
```bash
cd server
npm run dev
```

### Step 2: Create Job (Recruiter)
1. Login as recruiter
2. Go to "Job Management" tab
3. Click "Post New Job"
4. Fill in job details:
   - Title: "Software Engineer"
   - Description: "Develop web applications"
   - Skills: "JavaScript, React, Node.js"
   - Location: "Remote"
5. Click "Post Job"

### Step 3: Apply for Job (Candidate 1)
1. Login as candidate 1
2. Go to "Browse Jobs"
3. Find the job
4. Click "Apply"
5. Upload resume
6. Click "Submit Application"

### Step 4: Generate Interview Link (Recruiter)
1. Go to "Candidates & Interviews" tab
2. Select candidate 1
3. Click "Generate AI Interview Link"
4. Copy the link

### Step 5: Take Interview (Candidate 1)
1. Open the interview link
2. Answer all 5 questions
3. Click "Submit Answer" for each
4. Click "Complete Interview"
5. See final score

### Step 6: Check Rankings (Recruiter)
1. Go back to recruiter dashboard
2. Go to "Candidates & Interviews" tab
3. Scroll down to "AI Interview Rankings"
4. Should see candidate 1 with score

### Step 7: Test with Candidate 2
1. Create another candidate account
2. Apply for same job
3. Generate interview link
4. Take interview
5. Check rankings

### Step 8: Verify Ranking Order
1. Rankings should show highest score first
2. Both candidates should be listed
3. Scores should be different
4. Ranked correctly

---

## Expected Results

### After Candidate 1 Interview
```
AI Interview Rankings
Rank 1: Candidate 1 Name
Score: 78%
5/5 correct • Completed: Today
```

### After Candidate 2 Interview
```
AI Interview Rankings
Rank 1: Candidate 2 Name (if score higher)
Score: 85%
5/5 correct • Completed: Today

Rank 2: Candidate 1 Name
Score: 78%
5/5 correct • Completed: Today
```

---

## Verification Checklist

- [ ] Backend starts without errors
- [ ] Job can be created
- [ ] Candidate can apply
- [ ] Interview link can be generated
- [ ] Interview page loads
- [ ] Questions display
- [ ] Answers can be submitted
- [ ] Evaluation shows scores
- [ ] Interview completes
- [ ] Final score shown
- [ ] Rankings appear in dashboard
- [ ] Rankings are sorted by score
- [ ] Multiple candidates show correctly

---

## Debugging

### Rankings Not Showing
1. Check browser console for errors
2. Check backend logs
3. Verify interviews are completed
4. Refresh page

### Scores Not Correct
1. Check each question score
2. Verify calculation: (score1 + score2 + ... + score5) / 5
3. Check database for saved scores

### Wrong Ranking Order
1. Check score values
2. Verify sorting (highest first)
3. Refresh page

---

## Backend Logs to Check

When interview completes, should see:
```
=== START INTERVIEW SESSION ===
...
Generated 5 questions

Submitting answer for question ...
Answer evaluated. Score: 85

Interview completed. Final Score: 78%
Score recorded in main system
```

---

## Database Check

### Check AIInterview Collection
```javascript
db.aiinterviews.find({}).sort({ score: -1 })
```

Should show:
- All completed interviews
- Sorted by score (highest first)
- Score field populated
- Status: "completed"

---

## Frontend Check

### Check Browser Console
- No errors
- Rankings fetched successfully
- Scores displayed correctly

### Check Network Tab
- GET /api/ai-interview/job/{jobId} returns rankings
- Response includes all completed interviews
- Sorted by score

---

## Performance Check

- Rankings load quickly (< 1 second)
- No lag when switching tabs
- Smooth scrolling in rankings list

---

## Summary

The interview scoring and ranking system should:
1. ✅ Calculate scores automatically
2. ✅ Save scores to database
3. ✅ Display rankings in dashboard
4. ✅ Rank candidates by score
5. ✅ Update in real-time

**Status: ✅ READY TO TEST**

---

## Next Steps

1. Run through all test steps
2. Verify all checkboxes pass
3. Check backend logs
4. Check browser console
5. Deploy to production

---

**Questions?** Check `INTERVIEW_SCORING_AND_RANKING.md` for detailed information.
