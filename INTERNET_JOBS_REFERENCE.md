# Internet Job Search - Quick Reference

## What's New

System now searches for jobs from:
- Database (internal jobs)
- Internet (via JSearch API)

## Setup (Choose One)

### With Real Jobs
```bash
# 1. Get API key from https://rapidapi.com/laimoon/api/jsearch
# 2. Add to server/.env
JSEARCH_API_KEY=your_api_key_here

# 3. Restart backend
cd server && npm run dev
```

### With Mock Data (No API Key)
```bash
# Leave JSEARCH_API_KEY empty in .env
# Restart backend
cd server && npm run dev
```

## How It Works

```
Score < 60%
  ↓
Click "Find Better Matching Jobs"
  ↓
Search database + internet
  ↓
Return top 15 ranked by match
  ↓
Show source indicator
  ↓
Apply or view on job site
```

## Features

- ✓ Searches database jobs
- ✓ Searches internet jobs
- ✓ Ranks by match score
- ✓ Shows source (Database/Internet)
- ✓ Direct apply for database jobs
- ✓ Direct link for internet jobs
- ✓ Mock data fallback
- ✓ Comprehensive logging

## Files Modified

1. `server/services/jobSearchService.js` (New)
2. `server/routes/analysis.js`
3. `client/src/pages/CandidateDashboard.jsx`
4. `server/.env`

## Configuration

**Number of results**:
```javascript
// server/routes/analysis.js, line: .slice(0, 15)
.slice(0, 10)  // For top 10
.slice(0, 20)  // For top 20
```

**Threshold**:
```javascript
// client/src/pages/CandidateDashboard.jsx
{analysisResult.matchScore < 60 && (  // Change 60
```

## Testing

1. Create job in database
2. Upload resume (score < 60%)
3. Click "Find Better Matching Jobs"
4. Verify jobs from both sources
5. Test apply buttons

## Console Output

```
Database Jobs Found: 10
Internet Jobs Found: 15
Total Jobs Analyzed: 25
Top Jobs: [
  { title: 'Senior Dev', score: 92, source: 'Internet' },
  { title: 'Python Dev', score: 88, source: 'Database' }
]
```

## API Provider

**JSearch (RapidAPI)**
- Free: 1000 requests/month
- Paid: More requests available
- URL: https://rapidapi.com/laimoon/api/jsearch

## Mock Jobs Included

1. Senior Python Developer
2. Full Stack JavaScript Developer
3. Data Scientist
4. DevOps Engineer
5. Frontend React Developer
6. Java Backend Developer
7. AI/ML Engineer
8. Database Administrator
9. Cloud Architect
10. QA Automation Engineer

## Success Criteria

✓ Button appears when score < 60%
✓ Shows database jobs
✓ Shows internet jobs
✓ Jobs ranked by match
✓ Source indicator visible
✓ Apply buttons work
✓ No console errors

## Documentation

- INTERNET_JOB_SEARCH_GUIDE.md - Full guide
- INTERNET_JOBS_QUICK_SETUP.md - Quick setup
- INTERNET_JOBS_IMPLEMENTATION.md - Technical details
- INTERNET_JOBS_COMPLETE.md - Feature summary
- INTERNET_JOBS_REFERENCE.md - This file

Ready to test!
