# AI Interview - Troubleshooting Guide

## Error: 500 Internal Server Error on Send Interview Link

### Root Cause
The 500 error typically occurs when:
1. **MongoDB is not connected** (most common)
2. **Candidate record not found** in database
3. **Job record not found** in database
4. **Email configuration is incorrect**

## Step-by-Step Fix

### Step 1: Fix MongoDB Connection
This is the most common issue.

**Check if MongoDB is connected:**
Look at server logs when starting:
```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
```

If you see:
```
❌ MongoDB connection error
```

**Fix it:**
1. Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Click "Network Access" in left sidebar
3. Click "+ ADD IP ADDRESS"
4. Click "ADD CURRENT IP ADDRESS"
5. Wait 1-2 minutes
6. Restart server

### Step 2: Verify Candidate Exists in Database

The error occurs because the system can't find the candidate record.

**Check what's being sent:**
In browser console, when you click "Send AI Interview Link", check:
```javascript
// The request should include:
{
  "candidateId": "user-id-here",
  "jobId": "job-id-here"
}
```

**Verify candidate exists:**
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Find "candidates" collection
4. Check if a record exists with the userId you're sending

**If candidate doesn't exist:**
1. Have the candidate apply for a job first
2. This creates the candidate record
3. Then try sending the interview link

### Step 3: Check Server Logs

When you click "Send AI Interview Link", check the server terminal for:

**Success logs:**
```
=== SEND AI INTERVIEW LINK ===
Recruiter: 507f1f77bcf86cd799439011
Candidate: 507f1f77bcf86cd799439012
Job: 507f1f77bcf86cd799439013
=== INTERVIEW LINK SENT ===
```

**Error logs:**
```
Error sending interview link: [error message]
```

**Common error messages:**
- `Candidate or Job not found` → Verify IDs exist in database
- `Cannot read property 'email' of undefined` → Candidate record missing userId
- `ENOTFOUND` → Email service not configured

### Step 4: Verify Email Configuration

If MongoDB is connected but email isn't sending:

**Check .env file:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**For Gmail:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate a new app password
3. Copy the 16-character password
4. Update EMAIL_PASSWORD in .env
5. Restart server

**Test email manually:**
```bash
# In server directory
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});
transporter.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test',
  text: 'Test email'
}, (err, info) => {
  if (err) console.log('Error:', err);
  else console.log('Success:', info.response);
});
"
```

### Step 5: Check Network Request

In browser DevTools:

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Send AI Interview Link"
4. Find the request to `/api/ai-interview/send-link`
5. Check:
   - **Status**: Should be 200 (success) or 500 (error)
   - **Request**: Check candidateId and jobId are correct
   - **Response**: Shows error message

**If status is 500:**
- Click on the request
- Go to "Response" tab
- Read the error message
- Follow the fix for that specific error

## Common Errors and Fixes

### Error: "Candidate or Job not found"
**Cause**: The candidateId or jobId doesn't exist in database

**Fix**:
1. Make sure candidate has applied for a job
2. Get the correct IDs from the database
3. Verify IDs are being sent correctly

**Check IDs:**
```javascript
// In browser console, when candidate is selected:
console.log('Candidate ID:', selectedCandidate.userId._id);
console.log('Job ID:', selectedCandidate.jobId._id);
```

### Error: "Cannot read property 'email' of undefined"
**Cause**: Candidate record exists but doesn't have userId populated

**Fix**:
1. Delete the candidate record
2. Have them apply for a job again
3. Try sending interview link

### Error: "ENOTFOUND" or "getaddrinfo ENOTFOUND"
**Cause**: Email service can't be reached

**Fix**:
1. Check internet connection
2. Verify EMAIL_USER is correct
3. Verify EMAIL_PASSWORD is correct
4. Try a different email provider

### Error: "Invalid login credentials"
**Cause**: Gmail app password is incorrect

**Fix**:
1. Go to https://myaccount.google.com/apppasswords
2. Generate a new app password
3. Copy the exact 16-character password
4. Update .env
5. Restart server

## Debugging Steps

### Enable Detailed Logging

Add this to `server/routes/aiInterview.js` after line 40:

```javascript
console.log('Candidate record:', candidate);
console.log('Job record:', job);
console.log('Email config:', {
  from: process.env.EMAIL_USER,
  to: candidate?.userId?.email
});
```

### Check Database Directly

1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Check these collections:
   - **users**: Should have recruiter and candidate
   - **candidates**: Should have candidate record with userId
   - **jobpostings**: Should have job record

### Test API Endpoint Directly

```bash
# Get your token first (from login)
TOKEN="your-jwt-token"

# Send interview link
curl -X POST http://localhost:5555/api/ai-interview/send-link \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "user-id-here",
    "jobId": "job-id-here"
  }'
```

## Verification Checklist

Before sending interview link:

- [ ] MongoDB is connected (check server logs)
- [ ] Candidate has applied for a job
- [ ] Candidate record exists in database
- [ ] Job record exists in database
- [ ] Email is configured in .env
- [ ] Gmail app password is correct (16 characters)
- [ ] Candidate is selected in dashboard
- [ ] Recruiter is logged in

## Quick Fix Summary

1. **MongoDB not connected?**
   - Go to MongoDB Atlas → Network Access
   - Add your current IP
   - Wait 1-2 minutes
   - Restart server

2. **Candidate not found?**
   - Have candidate apply for a job first
   - Verify candidate record exists in database

3. **Email not sending?**
   - Check EMAIL_USER and EMAIL_PASSWORD in .env
   - Generate new Gmail app password
   - Restart server

4. **Still getting 500 error?**
   - Check server logs for specific error
   - Follow the error message fix above
   - Test API endpoint directly with curl

## Getting Help

If you're still stuck:

1. **Check server logs** - Most detailed error info
2. **Check browser DevTools** - Network tab shows request/response
3. **Check MongoDB Atlas** - Verify data exists
4. **Check .env file** - Verify all config is correct
5. **Restart everything** - Server, browser, MongoDB

## Success Indicators

When everything is working:

**Server logs show:**
```
✅ MongoDB connected successfully
=== SEND AI INTERVIEW LINK ===
Recruiter: [id]
Candidate: [id]
Job: [id]
Email sent: [response]
=== INTERVIEW LINK SENT ===
```

**Browser shows:**
```
Alert: "AI Interview link sent to [Candidate Name]!"
```

**Candidate receives:**
```
Email with subject: "AI Interview Invitation - [Job Title] at HireLens"
```

That's it! The AI Interview feature is working correctly.
