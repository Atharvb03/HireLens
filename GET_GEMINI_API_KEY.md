# How to Get Gemini API Key

## Step-by-Step Guide

### 1. Go to Google AI Studio
- Open https://aistudio.google.com/ in your browser
- You may need to sign in with your Google account

### 2. Create API Key
- Click on "Get API Key" button (usually in the top right or left sidebar)
- Select "Create new API key"
- Choose "Create API key in new project" or select existing project
- The API key will be generated and displayed

### 3. Copy the API Key
- Copy the entire API key (it's a long string)
- Keep it safe and don't share it

### 4. Add to .env File
Edit `server/.env` and update:
```
GEMINI_API_KEY=your_copied_api_key_here
```

Replace `your_copied_api_key_here` with the actual key you copied.

### 5. Restart Backend
```bash
cd server
npm run dev
```

The backend will now use the Gemini API for interview questions.

## Troubleshooting

### API Key Not Working
- Verify the key is copied correctly (no extra spaces)
- Check that you're using the right key (not OpenAI key)
- Try generating a new key

### Still Getting Errors
- Check server logs for error messages
- Verify .env file is saved
- Restart backend after updating .env
- Check that GEMINI_API_KEY line has no typos

## What Happens Without API Key

If GEMINI_API_KEY is not set:
- System will use fallback questions
- Interviews will still work
- Questions will be generic but functional
- No API calls will be made

## Free Tier Limits

Google's Gemini API has free tier limits:
- 60 requests per minute
- 1,500 requests per day
- Sufficient for testing and small deployments

For production, consider upgrading to paid tier.

## Alternative: Use OpenAI

If you don't have Gemini API key, the system will fall back to:
1. Using OPENAI_API_KEY if available
2. Using fallback questions if no API key

The system is designed to work with or without API keys.

---

**Need help?** Check the server logs for detailed error messages.
