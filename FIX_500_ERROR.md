# Fix 500 Error on Interview Start

## Problem
```
POST http://localhost:3000/api/interview-session/start 500 (Internal Server Error)
Error starting interview: AxiosError: Request failed with status code 500
```

## Root Cause
The Gemini API key is not configured in the `.env` file. The system is trying to call the Gemini API but failing because no API key is available.

## Solution

### Step 1: Get Gemini API Key
1. Go to https://aistudio.google.com/
2. Click "Get API Key"
3. Create new API key
4. Copy the key

### Step 2: Update .env File
Edit `server/.env` and add/update:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Replace `your_actual_gemini_api_key_here` with the key you copied.

### Step 3: Restart Backend
```bash
cd server
npm run dev
```

Wait for the message:
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
```

### Step 4: Test Interview Again
1. Generate new interview link
2. Click interview link
3. Interview should start successfully

## Verification

### Check Backend Logs
When backend starts, you should see:
```
Interview Service Initialized
API Key configured: true
Using API Key: your_gem...
```

### Check Interview Start
When you start interview, you should see:
```
=== START INTERVIEW SESSION ===
Request body: {...}
Auth user ID: ...
Generating questions for: Software Engineer
API Key available: true
Generating content...
Generated 5 questions
=== INTERVIEW SESSION STARTED ===
```

## If Still Getting Error

### 1. Check API Key Format
- Ensure no extra spaces
- Ensure it's the Gemini key, not OpenAI key
- Ensure .env file is saved

### 2. Check Server Logs
Look for error messages like:
```
Error generating questions: Error: Invalid API key
Error generating questions: Error: API rate limit exceeded
```

### 3. Restart Everything
```bash
# Stop backend (Ctrl+C)
# Stop frontend (Ctrl+C)

# Restart backend
cd server
npm run dev

# In new terminal, restart frontend
cd client
npm run dev
```

### 4. Check .env File
```bash
# Verify GEMINI_API_KEY is set
cat server/.env | grep GEMINI_API_KEY
```

Should output:
```
GEMINI_API_KEY=your_actual_key_here
```

## Fallback Behavior

If API key is not available, the system will:
1. Log a warning
2. Use fallback questions
3. Interview will still work
4. Questions will be generic

This means interviews can continue even without API key, but with generic questions.

## What Each Error Means

| Error | Cause | Fix |
|-------|-------|-----|
| 500 Internal Server Error | API key not set or invalid | Add GEMINI_API_KEY to .env |
| Invalid API key | Wrong key format | Get new key from aistudio.google.com |
| API rate limit exceeded | Too many requests | Wait or upgrade to paid tier |
| Network error | Connection issue | Check internet connection |

## Testing the Fix

### Test 1: Check Backend Logs
```bash
# Look for "API Key configured: true"
# Look for "Generated 5 questions"
```

### Test 2: Start Interview
1. Login as candidate
2. Click interview link
3. Should see questions loading
4. Should see 5 questions displayed

### Test 3: Submit Answer
1. Type answer
2. Click "Submit Answer"
3. Should see evaluation with score

### Test 4: Complete Interview
1. Answer all 5 questions
2. Click "Complete Interview"
3. Should see final score
4. Should redirect to dashboard

## Success Indicators

✅ Backend logs show "API Key configured: true"
✅ Backend logs show "Generated 5 questions"
✅ Interview page loads questions
✅ Answers can be submitted
✅ Evaluation shows scores
✅ Interview completes successfully

## Next Steps

1. ✅ Get Gemini API key
2. ✅ Update .env file
3. ✅ Restart backend
4. ✅ Test interview flow
5. ✅ Verify scores are saved

---

**Still having issues?** Check `INTERVIEW_DEBUGGING_GUIDE.md` for more troubleshooting.
