# Get Started Now - AI Interview Feature

## 🚀 Quick Start (10 minutes)

### Step 1: Fix MongoDB Connection (2 minutes)

**Your current error:**
```
❌ MongoDB connection error: Could not connect to any servers
```

**Fix it:**
1. Open https://www.mongodb.com/cloud/atlas
2. Sign in
3. Click your cluster (Cluster0)
4. Click **"Network Access"** in left sidebar
5. Click **"+ ADD IP ADDRESS"**
6. Click **"ADD CURRENT IP ADDRESS"**
7. Click **"Confirm"**
8. Wait 1-2 minutes

**Restart server:**
```bash
cd server
npm run dev
```

**You should see:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
```

### Step 2: Configure Email (2 minutes)

**For Gmail:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Click "Generate"
4. Copy the 16-character password

**Update `server/.env`:**
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=paste-16-char-password-here
AI_INTERVIEW_BASE_URL=http://localhost:3001
```

**Restart server:**
```bash
npm run dev
```

### Step 3: Start Frontend (1 minute)

```bash
cd client
npm run dev
```

**You should see:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:3000
```

### Step 4: Test the Feature (5 minutes)

**As Recruiter:**
1. Go to http://localhost:3000
2. Login as Admin (use admin credentials)
3. Go to "Candidates & Interviews" tab
4. Select a candidate
5. Click "Send AI Interview Link"
6. Check candidate's email for interview link

**As Candidate:**
1. Go to http://localhost:3000
2. Login as Candidate
3. Go to "AI Interviews" tab
4. See pending interview
5. Click "Start Interview"

## ✅ Verification Checklist

### MongoDB
- [ ] Connected successfully (check server logs)
- [ ] Can see "✅ MongoDB connected successfully"

### Email
- [ ] EMAIL_USER set in .env
- [ ] EMAIL_PASSWORD set in .env (16 characters)
- [ ] Server restarted after .env changes

### Frontend
- [ ] Running on http://localhost:3000
- [ ] Can login as recruiter
- [ ] Can login as candidate

### Feature
- [ ] Can send interview link
- [ ] Candidate receives email
- [ ] Can view pending interviews
- [ ] Can click "Start Interview"

## 🔧 Troubleshooting

### MongoDB Still Not Connecting?

**Try this:**
1. Check if cluster is running (not paused)
2. Verify username and password in URI
3. Try adding `?retryWrites=true&w=majority` to URI
4. Restart server after whitelisting

**Alternative - Use Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/hirelens
```

### Email Not Sending?

**Check:**
1. EMAIL_USER is correct
2. EMAIL_PASSWORD is 16 characters (from app passwords)
3. Not using regular Gmail password
4. Server restarted after .env changes

**Test email:**
```bash
# In server directory
npm install nodemailer  # if not installed
node -e "
const nodemailer = require('nodemailer');
const t = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'your-email@gmail.com', pass: 'your-app-password' }
});
t.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test',
  text: 'Test'
}, (e, i) => console.log(e || 'Success'));
"
```

### 500 Error on Send Interview Link?

**Check server logs for:**
- `Candidate or Job not found` → Have candidate apply for job first
- `Cannot read property 'email'` → Candidate record incomplete
- `ENOTFOUND` → Email not configured

**Fix:**
1. Make sure candidate has applied for a job
2. Verify candidate record exists in MongoDB
3. Check email configuration

## 📋 What's Implemented

### Recruiter Features
✅ Send AI interview link to candidate
✅ View AI interview rankings
✅ See candidate scores
✅ View correct answers count

### Candidate Features
✅ View pending interviews
✅ Click to start interview
✅ View completed interviews
✅ See score and feedback

### Backend Features
✅ Unique interview tokens
✅ Email notifications
✅ 7-day expiration
✅ Score tracking
✅ Candidate ranking

## 📁 Files Created/Modified

### New Files
- `server/models/AIInterview.js` - Database model
- `server/services/aiInterviewService.js` - Service layer
- `server/routes/aiInterview.js` - API routes
- `AI_INTERVIEW_COMPLETE.md` - Full documentation
- `AI_INTERVIEW_QUICK_START.md` - Quick setup
- `AI_INTERVIEW_FLOW.md` - User flows
- `MONGODB_CONNECTION_FIX.md` - MongoDB help
- `TROUBLESHOOTING_AI_INTERVIEW.md` - Troubleshooting

### Modified Files
- `server/server.js` - Added AI interview routes
- `server/.env` - Added email config
- `client/src/pages/RecruiterDashboard.jsx` - Send link button + rankings
- `client/src/pages/CandidateDashboard.jsx` - AI Interviews tab

## 🎯 Next Steps

### Immediate (Now)
1. Fix MongoDB connection
2. Configure email
3. Test sending interview link

### Short Term (Today)
1. Test full flow (send → receive → take interview)
2. Verify scores update correctly
3. Check candidate ranking

### Integration (This Week)
1. Connect to your AI Interview system
2. Configure AI_INTERVIEW_BASE_URL
3. Test score callback endpoint

## 📞 Support

### Common Issues

**MongoDB Connection**
- See: `MONGODB_CONNECTION_FIX.md`

**Email Not Sending**
- See: `TROUBLESHOOTING_AI_INTERVIEW.md`

**500 Error**
- Check server logs
- See: `TROUBLESHOOTING_AI_INTERVIEW.md`

**Feature Not Working**
- See: `AI_INTERVIEW_COMPLETE.md`

## 🎓 Learning Resources

### Documentation Files
1. `AI_INTERVIEW_COMPLETE.md` - Full technical details
2. `AI_INTERVIEW_FLOW.md` - User flows and diagrams
3. `AI_INTERVIEW_QUICK_START.md` - Quick reference
4. `TROUBLESHOOTING_AI_INTERVIEW.md` - Problem solving

### API Documentation
- See `AI_INTERVIEW_COMPLETE.md` → "API Endpoints" section

### Database Schema
- See `AI_INTERVIEW_COMPLETE.md` → "Database Model" section

## ⚡ Performance Tips

- MongoDB indexes are automatically created
- Email sending is non-blocking
- Interview links cached in browser
- Ranking queries optimized

## 🔒 Security

- Unique 64-character tokens
- Token validation on access
- 7-day expiration
- Authentication required
- Email verification

## 📊 Monitoring

All operations logged with:
- Timestamp
- User ID
- Action
- Result
- Errors (if any)

Check server logs for detailed information.

## 🎉 You're All Set!

The AI Interview feature is ready to use. Follow the Quick Start steps above and you'll be up and running in 10 minutes.

**Questions?** Check the documentation files or review the troubleshooting guide.

**Ready?** Let's go! 🚀
