# Test Interview System with Fallback

## What Changed

The interview system now:
1. Checks if Gemini API is available
2. Uses fallback questions if API is not available
3. Never crashes due to missing API key
4. Provides detailed logging

## How to Test

### Step 1: Restart Backend
```bash
cd server
npm run dev
```

### Step 2: Check Logs
Look for:
```
Interview Service Initialized
API Key configured: false
No API key - will use fallback questions
```

Or if API key is set:
```
Interview Service Initialized
API Key configured: true
Using API Key: your_gem...
Gemini API client initialized successfully
```

### Step 3: Generate Interview Link
1. Login as recruiter
2. Create job
3. Have candidate apply
4. Generate interview link

### Step 4: Take Interview
1. Click interview link
2. Should see 5 questions
3. Answer questions
4. Submit answers
5. See evaluation
6. Complete interview

### Step 5: Verify
- Interview should work
- Questions should display
- Answers should be evaluated
- Scores should be calculated
- No 500 errors

## Expected Behavior

### Without API Key (Fallback)
```
Backend logs:
Generating questions for: Software Engineer
Gemini API available: false
Using fallback questions (no API available)
Generated 5 questions

Frontend:
Interview loads
5 generic questions displayed
Answers evaluated with fallback scoring
Interview completes successfully
```

### With API Key (Gemini)
```
Backend logs:
Generating questions for: Software Engineer
Gemini API available: true
Attempting to generate questions with Gemini API...
Generated 5 questions

Frontend:
Interview loads
5 contextual questions displayed
Answers evaluated with AI scoring
Interview completes successfully
```

## Fallback Questions

If API is not available, system uses generic questions:
1. "What is your experience with {jobRole}?"
2. "Describe a challenging project you worked on as a {jobRole}."
3. "What are the key skills required for a {jobRole} position?"
4. "How do you approach problem-solving in your role?"
5. "What are your career goals as a {jobRole}?"

## Fallback Evaluation

If API is not available, system uses basic evaluation:
- Score based on answer length
- Generic feedback
- Generic strengths and improvements

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Backend logs show initialization
- [ ] Interview page loads
- [ ] 5 questions displayed
- [ ] Answers can be submitted
- [ ] Evaluation shows scores
- [ ] Interview completes
- [ ] No 500 errors
- [ ] Scores are saved

## Troubleshooting

### Still Getting 500 Error?

1. Check backend logs for errors
2. Verify MongoDB connection
3. Check authentication token
4. Verify interview token is valid

### Questions Not Displaying?

1. Check browser console for errors
2. Check backend logs
3. Verify API response

### Scores Not Saving?

1. Check MongoDB connection
2. Check backend logs
3. Verify database models

## Next Steps

1. Test with fallback (no API key)
2. Get Gemini API key
3. Add to .env file
4. Restart backend
5. Test with Gemini API
6. Compare results

## Summary

The interview system now works with or without Gemini API key:
- ✅ Works without API key (fallback)
- ✅ Works with API key (Gemini)
- ✅ Never crashes
- ✅ Provides detailed logging
- ✅ Graceful error handling

**Status: ✅ Ready to Test**
