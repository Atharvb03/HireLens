# Internet Job Search - Quick Setup

## What's New

System now searches for jobs from:
- ✓ Your database (internal jobs)
- ✓ Internet (via JSearch API)

Returns top 15 jobs ranked by match score.

## Setup (2 Minutes)

### Option 1: With Real Jobs (Recommended)

1. **Get API Key**
   - Go: https://rapidapi.com/laimoon/api/jsearch
   - Click "Subscribe to Test"
   - Choose Free Plan
   - Copy API key

2. **Add to .env**
   ```
   JSEARCH_API_KEY=your_api_key_here
   ```

3. **Restart Backend**
   ```bash
   cd server
   npm run dev
   ```

### Option 2: Without API Key (Mock Data)

1. Leave `JSEARCH_API_KEY` empty in .env
2. Restart backend
3. System uses mock job data for testing

## How It Works

```
Candidate score < 60%
↓
Click "Find Better Matching Jobs"
↓
System searches:
  - Database jobs
  - Internet jobs
↓
Returns top 15 ranked by match
↓
Shows source (Database/Internet)
```

## Features

✓ Searches database + internet
✓ Top 15 results
✓ Ranked by match score
✓ Source indicator
✓ Direct job links
✓ Mock data fallback

## Testing

1. Create job in database
2. Upload resume (score < 60%)
3. Click "Find Better Matching Jobs"
4. See jobs from both sources

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

## Configuration

**Change number of results**:
- File: `server/routes/analysis.js`
- Line: `.slice(0, 15)`
- Change 15 to desired number

**Change threshold**:
- File: `client/src/pages/CandidateDashboard.jsx`
- Line: `{analysisResult.matchScore < 60 && (`
- Change 60 to desired threshold

## Files Modified

1. `server/services/jobSearchService.js` (New)
2. `server/routes/analysis.js`
3. `client/src/pages/CandidateDashboard.jsx`
4. `server/.env`

## Success Criteria

✓ "Find Better Matching Jobs" works
✓ Shows database jobs
✓ Shows internet jobs (or mock)
✓ Jobs ranked by match score
✓ Source indicator visible
✓ Apply buttons work
✓ No console errors

Ready to test!
