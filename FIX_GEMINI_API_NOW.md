# Fix Gemini API - Quick Action Guide

## Problem

System is showing "Gemini API available: false" and using fallback evaluation.

## Quick Fix (5 minutes)

### Step 1: Get API Key
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIza`)

### Step 2: Update `.env`
Edit `server/.env` and update:
```
GEMINI_API_KEY=your_new_key_here
```

### Step 3: Restart Backend
```bash
npm start
```

### Step 4: Check Logs
Look for:
```
✅ Gemini API client initialized successfully
```

### Step 5: Test
1. Start interview
2. Submit answer
3. Check score is not 5

## Done!

Gemini API should now be working.

## Verify It's Working

**During Interview**:
- Logs should show: "Gemini API Available: true"
- Logs should show: "✅ Gemini API response received"
- Scores should vary (not always 5)

**If Still Not Working**:
1. Check `.env` file is saved
2. Verify API key is not empty
3. Verify API key format (starts with `AIza`)
4. Restart backend again
5. Check internet connection

## Current Status

- API Key in `.env`: ✅ Present
- API Key Format: ✅ Looks valid
- Need to: Restart backend and test

## Next Steps

1. Restart backend
2. Start interview
3. Submit answer
4. Check logs for "✅ Gemini API response received"
5. Verify score is reasonable

That's it! Gemini API should be working now.
