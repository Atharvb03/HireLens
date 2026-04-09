# Quick Fix Summary - 500 Error on Interview Start

## Problem
```
POST http://localhost:3000/api/interview-session/start 500 (Internal Server Error)
```

## Root Cause
Gemini API key not configured in `.env` file

## Quick Fix (2 minutes)

### 1. Get API Key
Go to https://aistudio.google.com/ → Get API Key → Copy

### 2. Update .env
Edit `server/.env`:
```
GEMINI_API_KEY=your_copied_key_here
```

### 3. Restart Backend
```bash
cd server
npm run dev
```

### 4. Test
Generate interview link and click it. Should work now!

## Verification
Backend logs should show:
```
API Key configured: true
Generated 5 questions
```

## If Still Not Working
1. Check .env file is saved
2. Verify no extra spaces in key
3. Restart backend again
4. Check server logs for errors

---

**That's it!** Interview system should now work. 🚀

For detailed troubleshooting, see `FIX_500_ERROR.md`
