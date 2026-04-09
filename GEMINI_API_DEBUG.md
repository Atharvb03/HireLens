# Gemini API Debugging Guide

## Issue

The system is showing "Gemini API available: false" and using fallback evaluation instead of the Gemini API.

## Root Causes

1. **API Key Not Configured**: `GEMINI_API_KEY` not set in `.env`
2. **Invalid API Key**: API key is expired or incorrect
3. **API Initialization Failed**: Error during GoogleGenerativeAI initialization
4. **Network Issue**: Cannot reach Gemini API servers

## Debugging Steps

### Step 1: Verify API Key is Configured

Check your `.env` file:
```bash
cat server/.env | grep GEMINI_API_KEY
```

Should show:
```
GEMINI_API_KEY=AIzaSyBhOeSmsVo8YUipmDWvrQEIIi_7uviy0qg
```

If not present or empty, add it:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 2: Check Server Logs on Startup

When you start the backend, look for:

**Good (API Working)**:
```
Interview Service Initialized
API Key configured: true
Using API Key: AIzaSyBh...
✅ Gemini API client initialized successfully
```

**Bad (API Not Working)**:
```
Interview Service Initialized
API Key configured: false
⚠️ No API key configured - will use fallback evaluation
```

### Step 3: Check Logs During Interview

When submitting an answer, look for:

**Good (Using Gemini)**:
```
=== EVALUATING ANSWER ===
Question Type: descriptive
Answer Length: 150 characters
Gemini API Available: true
API Key Configured: true
🔄 Attempting to evaluate with Gemini API...
✅ Gemini API response received
✅ Answer evaluated by Gemini. Score: 65%
```

**Bad (Using Fallback)**:
```
=== EVALUATING ANSWER ===
Question Type: descriptive
Answer Length: 150 characters
Gemini API Available: false
API Key Configured: false
⚠️ Using fallback evaluation (Gemini API not available)
```

### Step 4: Get a Valid Gemini API Key

If you don't have a valid API key:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Add to `.env`:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```

### Step 5: Restart Backend

After updating `.env`:
```bash
npm start
```

Watch for the initialization logs to confirm API is loaded.

### Step 6: Test with Interview

1. Start an interview
2. Submit an answer
3. Check logs for "✅ Gemini API response received"
4. Verify score is not 5 (fallback score)

## Common Issues and Solutions

### Issue: "API Key configured: false"

**Solution**:
1. Check `.env` file exists in `server/` directory
2. Verify `GEMINI_API_KEY=` line is present
3. Verify key is not empty
4. Restart backend after adding key

### Issue: "Error initializing Gemini API"

**Solution**:
1. Verify API key format is correct
2. Check if API key is expired
3. Try generating a new API key
4. Check internet connection

### Issue: "Invalid response format from Gemini API"

**Solution**:
1. Check if API key is valid
2. Check if API has rate limits
3. Try again after a few seconds
4. Check Gemini API status

### Issue: Score is always 5

**Solution**:
1. Verify Gemini API is available (check logs)
2. If not available, get a valid API key
3. Restart backend
4. Try interview again

## Verification Checklist

- [ ] `.env` file exists in `server/` directory
- [ ] `GEMINI_API_KEY=` is present in `.env`
- [ ] API key is not empty
- [ ] API key format looks correct (starts with `AIza`)
- [ ] Backend logs show "✅ Gemini API client initialized successfully"
- [ ] Interview logs show "Gemini API Available: true"
- [ ] Answer evaluation shows "✅ Gemini API response received"
- [ ] Scores are not always 5

## Testing

### Test 1: Verify API Initialization
1. Restart backend
2. Check logs for initialization message
3. Should see "✅ Gemini API client initialized successfully"

### Test 2: Verify API Usage
1. Start interview
2. Submit answer
3. Check logs for "✅ Gemini API response received"
4. Verify score is reasonable (not 5)

### Test 3: Verify Score Differentiation
1. Submit very short answer (e.g., "yes")
2. Should score low (5-20)
3. Submit detailed answer (200+ words)
4. Should score high (70+)
5. Scores should be different

## Logs to Monitor

### Startup Logs
```
Interview Service Initialized
API Key configured: [true/false]
Using API Key: [first 10 chars]...
✅ Gemini API client initialized successfully
```

### Question Generation Logs
```
=== GENERATING INTERVIEW QUESTIONS ===
Job Role: [role]
Gemini API Available: [true/false]
API Key Configured: [true/false]
🔄 Attempting to generate questions with Gemini API...
✅ Gemini API response received
✅ Generated 5 unique questions with Gemini API
```

### Answer Evaluation Logs
```
=== EVALUATING ANSWER ===
Question Type: [type]
Answer Length: [length] characters
Gemini API Available: [true/false]
API Key Configured: [true/false]
🔄 Attempting to evaluate with Gemini API...
✅ Gemini API response received
✅ Answer evaluated by Gemini. Score: [score]%
```

## Quick Fix

If Gemini API is not working:

1. **Get API Key**: https://aistudio.google.com/app/apikey
2. **Update `.env`**:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. **Restart Backend**:
   ```bash
   npm start
   ```
4. **Test Interview**: Start interview and submit answer
5. **Check Logs**: Should see "✅ Gemini API response received"

## Support

If still having issues:
1. Check all logs carefully
2. Verify API key is valid
3. Try generating new API key
4. Check internet connection
5. Restart backend completely
6. Clear browser cache and try again

## Status

After fixing:
- ✅ Gemini API should be available
- ✅ Scores should differentiate properly
- ✅ Questions should be generated by Gemini
- ✅ Evaluations should be accurate
