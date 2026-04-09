# Immediate Fixes - MongoDB & 500 Error

## Current Issues

### Issue 1: MongoDB Connection Error
```
❌ MongoDB connection error: Could not connect to any servers in your MongoDB Atlas cluster
```

### Issue 2: 500 Error on Send Interview Link
```
POST http://localhost:3000/api/ai-interview/send-link 500 (Internal Server Error)
```

## Root Cause
Both issues are caused by **MongoDB not being connected**. When MongoDB is down, the database operations fail, causing 500 errors.

## Fix (5 minutes)

### Step 1: Whitelist Your IP in MongoDB Atlas

1. **Open MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign in with your account

2. **Navigate to Network Access**
   - Click on your cluster (Cluster0)
   - In the left sidebar, click **"Network Access"** (under Security section)

3. **Add Your IP**
   - Click **"+ ADD IP ADDRESS"** button
   - Click **"ADD CURRENT IP ADDRESS"** (MongoDB will auto-detect)
   - Click **"Confirm"**

4. **Wait for Changes**
   - Changes take 1-2 minutes to apply
   - You'll see a green checkmark when ready

### Step 2: Restart Your Server

```bash
# Stop the current server (Ctrl+C)

# Restart it
cd server
npm run dev
```

### Step 3: Check for Success

You should see in the terminal:
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
```

### Step 4: Test the Feature

1. Go to http://localhost:3000
2. Login as Admin
3. Go to "Candidates & Interviews" tab
4. Select a candidate
5. Click "Send AI Interview Link"
6. Should see: "AI Interview link sent to [Candidate Name]!"

## If Still Getting 500 Error

### Check Server Logs

Look at the server terminal for error messages:

**If you see:**
```
Candidate or Job not found
```
→ Have the candidate apply for a job first

**If you see:**
```
Cannot read property 'email' of undefined
```
→ Candidate record is incomplete, have them apply for a job

**If you see:**
```
ENOTFOUND
```
→ Email not configured, see "Email Configuration" below

### Email Configuration

If email errors appear:

1. **Update `server/.env`:**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   AI_INTERVIEW_BASE_URL=http://localhost:3001
   ```

2. **For Gmail:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password
   - Paste into EMAIL_PASSWORD in .env

3. **Restart server:**
   ```bash
   npm run dev
   ```

## Verify Everything Works

### Checklist

- [ ] MongoDB connected (see "✅ MongoDB connected successfully" in logs)
- [ ] Server running on port 5555
- [ ] Frontend running on port 3000
- [ ] Can login as admin
- [ ] Can select a candidate
- [ ] Can click "Send AI Interview Link"
- [ ] See success message
- [ ] Candidate receives email (check spam folder)

## Quick Troubleshooting

### MongoDB Still Not Connecting?

**Try these:**
1. Check if cluster is running (not paused)
2. Verify username and password in URI are correct
3. Wait 2-3 minutes after whitelisting
4. Restart server
5. Clear browser cache

### Still Getting 500 Error?

**Check:**
1. Server logs for specific error message
2. MongoDB is connected
3. Candidate has applied for a job
4. Email is configured

### Email Not Sending?

**Check:**
1. EMAIL_USER is correct
2. EMAIL_PASSWORD is 16 characters
3. Using app password (not regular Gmail password)
4. Server restarted after .env changes

## Alternative: Use Local MongoDB

If you continue having issues with MongoDB Atlas:

1. **Install MongoDB Community**
   - Download from: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service

2. **Update `server/.env`:**
   ```
   MONGODB_URI=mongodb://localhost:27017/hirelens
   ```

3. **Restart server:**
   ```bash
   npm run dev
   ```

## Success Indicators

### Server Terminal
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
📍 API Health: http://localhost:5555/api/health
```

### Browser Console
```
Alert: "AI Interview link sent to [Candidate Name]!"
```

### Candidate Email
```
Subject: AI Interview Invitation - [Job Title] at HireLens
```

## Next Steps

Once everything is working:

1. **Test Full Flow**
   - Send interview link
   - Candidate receives email
   - Candidate clicks link
   - Interview opens

2. **View Rankings**
   - After candidate completes interview
   - See rankings in recruiter dashboard

3. **Check Candidate Dashboard**
   - Candidate sees pending/completed interviews
   - Can view scores and feedback

## Support

### Still Stuck?

1. **Check `MONGODB_CONNECTION_FIX.md`** - Detailed MongoDB help
2. **Check `TROUBLESHOOTING_AI_INTERVIEW.md`** - Comprehensive troubleshooting
3. **Check server logs** - Most detailed error info
4. **Check browser DevTools** - Network tab shows request/response

## Summary

**The fix is simple:**
1. Whitelist your IP in MongoDB Atlas
2. Wait 1-2 minutes
3. Restart server
4. Test the feature

**That's it!** The AI Interview feature should now work perfectly.

---

**Questions?** See the documentation files or check the troubleshooting guide.

**Ready?** Let's go! 🚀
