# Test Resume Analysis System

## Quick Test Steps

### 1. Start the Backend
```bash
cd server
npm run dev
```
Watch for the server to start on port 5555.

### 2. Start the Frontend
```bash
cd client
npm run dev
```
Frontend will be on port 3000.

### 3. Create a Test Job (Admin)
1. Go to http://localhost:3000
2. Click "Admin Login"
3. Login with admin credentials
4. Go to "Job Management" tab
5. Click "Post New Job"
6. Fill in job details:
   - **Title**: Data Analyst
   - **Description**: Looking for a data analyst with strong Python and SQL skills
   - **Required Skills**: Python, MySQL, SQL, GitHub, Pandas, NumPy, Teamwork, Problem Solving
   - **Experience**: 2-3 years
   - **Salary**: $50k-$70k
   - **Location**: Remote
7. Click "Post Job"

### 4. Test Resume Analysis (Candidate)
1. Go to http://localhost:3000
2. Click "Candidate Login"
3. Login with candidate credentials
4. Go to "Browse Jobs" tab
5. Find the "Data Analyst" job you just created
6. Click "Apply Now"
7. Click "Upload Resume" and select `server/uploads/sample_resume.txt`
8. Wait for analysis to complete

### 5. Check Console Output
In the backend terminal, you should see:

```
=== ANALYSIS REQUEST ===
Job Title: Data Analyst
Job Required Skills: [ 'Python', 'MySQL', 'SQL', 'GitHub', 'Pandas', 'NumPy', 'Teamwork', 'Problem Solving' ]
...
=== MATCHING DEBUG START ===
...
MATCHED: python (frequency: 5)
MATCHED: mysql (frequency: 3)
MATCHED: sql (frequency: 2)
MATCHED: github (frequency: 2)
MATCHED: pandas (frequency: 3)
MATCHED: numpy (frequency: 2)
MATCHED: teamwork (frequency: 1)
MATCHED: problem solving (frequency: 1)
...
Final Match Score: 100
=== MATCHING DEBUG END ===
```

### 6. Verify Results
In the browser, you should see:
- **Match Score**: 100%
- **Matched Skills**: python, mysql, sql, github, pandas, numpy, teamwork, problem solving
- **Skill Gaps**: None
- **Submit Button**: Enabled (green) because score ≥ 60%

## Expected Behavior

### Scenario 1: Perfect Match (Sample Resume)
- **Resume**: Contains all 8 required skills
- **Expected Score**: 100%
- **Expected Result**: ✓ All skills matched, no gaps, can apply

### Scenario 2: Partial Match
- **Resume**: Contains 5 out of 8 skills
- **Expected Score**: ~62.5% (5/8 = 62.5% coverage)
- **Expected Result**: ✓ Can apply (≥60%), but shows 3 skill gaps

### Scenario 3: Below Threshold
- **Resume**: Contains 3 out of 8 skills
- **Expected Score**: ~37.5% (3/8 = 37.5% coverage)
- **Expected Result**: ✗ Cannot apply (<60%), shows 5 skill gaps and "Find Better Matching Jobs" button

## Debugging Tips

### Check Resume Text Extraction
Look for this in console:
```
Extracted Resume Text Length: 3500
Resume Text Preview: john anderson data analyst...
```

If length is 0 or preview is empty, file extraction failed.

### Check Skill Extraction
Look for this in console:
```
DEBUG - Resume Skills Found: [ 'python', 'mysql', 'github', ... ]
```

If skills are missing, they might not be in the dictionary.

### Check Skill Matching
Look for this in console:
```
MATCHED: python (frequency: 5)
MISSING: java
```

If a skill shows as MISSING but is in the resume, it might need an alias.

### Check Final Score Calculation
Look for this in console:
```
DEBUG - Match Calculation: {
  matchedCount: 8,
  totalSkills: 8,
  skillCoverageScore: 100,
  frequencyScore: 100,
  finalScore: 100
}
```

This shows the breakdown of how the score was calculated.

## Common Issues & Solutions

### Issue: Score is 0% even though skills are in resume

**Solution**:
1. Check console for "MISSING:" entries
2. Verify skill spelling in job posting
3. Add skill to `SKILL_DICTIONARY` if missing
4. Add alias if skill has variations

### Issue: Resume text is empty

**Solution**:
1. Try uploading a different file format (PDF, DOCX, TXT)
2. Ensure file is not corrupted
3. Check file size (should be > 0 bytes)

### Issue: Some skills not being extracted

**Solution**:
1. Check if skill is in `SKILL_DICTIONARY`
2. Check for typos in resume
3. Add skill alias if needed
4. Verify skill is separated by word boundaries

## File Locations

- **Sample Resume**: `server/uploads/sample_resume.txt`
- **Matching Service**: `server/services/matchingService.js`
- **Analysis Route**: `server/routes/analysis.js`
- **File Parser**: `server/utils/fileParser.js`
- **Candidate Dashboard**: `client/src/pages/CandidateDashboard.jsx`

## Next Steps After Testing

1. ✓ Verify sample resume gets 100% match
2. ✓ Test with partial skill matches
3. ✓ Test with below-threshold matches
4. ✓ Verify skill gap suggestions appear
5. ✓ Verify "Find Better Matching Jobs" button works
6. ✓ Check recruiter dashboard shows correct scores
7. ✓ Test application submission with ≥60% score
8. ✓ Test application blocking with <60% score

## Performance Notes

- Resume analysis typically takes 1-2 seconds
- File extraction depends on file size and format
- Skill matching is fast (< 100ms for typical resume)
- Score calculation is instant

## Success Criteria

✓ Sample resume shows 100% match for Data Analyst job
✓ All 8 skills are extracted and matched
✓ No skill gaps shown
✓ Submit button is enabled
✓ Console shows detailed debug information
✓ Recruiter dashboard shows correct match score
