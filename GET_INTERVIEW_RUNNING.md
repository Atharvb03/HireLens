# Get Interview System Running - Step by Step

## Prerequisites Checklist
- [ ] Node.js installed
- [ ] MongoDB Atlas account
- [ ] Gemini API key from Google AI Studio
- [ ] Git (optional)

## Step 1: Configure Environment

### 1.1 Update `.env` file
Edit `server/.env` and ensure these are set:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hirelens?retryWrites=true&w=majority
GEMINI_API_KEY=your_actual_gemini_api_key_here
JWT_SECRET=your_jwt_secret_key_here
PORT=5555
NODE_ENV=development
```

**How to get Gemini API Key:**
1. Go to https://aistudio.google.com/
2. Click "Get API Key"
3. Create new API key
4. Copy and paste into `.env`

**How to get MongoDB URI:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Click "Connect"
4. Choose "Drivers"
5. Copy connection string
6. Replace `<password>` with your database password

### 1.2 Verify `.env` file
```bash
# Check that .env exists and has values
cat server/.env
```

## Step 2: Install Dependencies

### 2.1 Backend Dependencies
```bash
cd server
npm install
```

Expected output:
```
added 204 packages in 4s
```

### 2.2 Frontend Dependencies
```bash
cd ../client
npm install
```

Expected output:
```
added 500+ packages in 30s
```

## Step 3: Start Backend

### 3.1 Open Terminal 1
```bash
cd server
npm run dev
```

### 3.2 Wait for Connection
Look for these messages:
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
📍 API Health: http://localhost:5555/api/health
```

### 3.3 Test Backend Health
Open new terminal and run:
```bash
curl http://localhost:5555/api/health
```

Expected response:
```json
{"status":"Server is running","timestamp":"2026-03-12T..."}
```

## Step 4: Start Frontend

### 4.1 Open Terminal 2
```bash
cd client
npm run dev
```

### 4.2 Wait for Server
Look for this message:
```
VITE v... ready in ... ms
➜  Local:   http://localhost:3000/
```

### 4.3 Open Browser
Go to http://localhost:3000

## Step 5: Create Test Accounts

### 5.1 Register as Recruiter
1. Click "Admin Register"
2. Fill in form:
   - Name: Test Recruiter
   - Email: recruiter@test.com
   - Password: password123
3. Click Register
4. You'll be redirected to recruiter dashboard

### 5.2 Register as Candidate
1. Go to http://localhost:3000
2. Click "Candidate Register"
3. Fill in form:
   - Name: Test Candidate
   - Email: candidate@test.com
   - Password: password123
4. Click Register
5. You'll be redirected to candidate dashboard

## Step 6: Create Job Posting

### 6.1 Login as Recruiter
1. Go to http://localhost:3000/admin-login
2. Email: recruiter@test.com
3. Password: password123
4. Click Login

### 6.2 Create Job
1. Go to Recruiter Dashboard
2. Click "Job Management" tab
3. Fill in job form:
   - Job Title: Software Engineer
   - Description: Develop web applications
   - Location: Remote
   - Salary: $100,000
   - Vacancies: 1
4. Click "Post Job"

## Step 7: Apply for Job

### 7.1 Login as Candidate
1. Go to http://localhost:3000/candidate-login
2. Email: candidate@test.com
3. Password: password123
4. Click Login

### 7.2 Browse and Apply
1. Go to Candidate Dashboard
2. Click "Browse Jobs" tab
3. Find the job you created
4. Click "Apply"
5. Upload resume (any PDF file)
6. Select availability
7. Click "Submit Application"

## Step 8: Generate Interview Link

### 8.1 Login as Recruiter
1. Go to http://localhost:3000/admin-login
2. Login with recruiter credentials

### 8.2 Generate Link
1. Go to Recruiter Dashboard
2. Click "Candidates & Interviews" tab
3. Find the candidate who applied
4. Click "Generate AI Interview Link"
5. Copy the generated link (green box)

## Step 9: Take Interview

### 9.1 Open Interview Link
1. Open the copied link in browser
2. You should see "Starting interview..." loading message

### 9.2 Answer Questions
1. Read the first question
2. Type your answer in the text area
3. Click "Submit Answer"
4. Wait for evaluation (1-3 seconds)
5. View score and feedback
6. Click "Next Question"
7. Repeat for all 5 questions

### 9.3 Complete Interview
1. After last question, click "Complete Interview"
2. You'll see final score
3. Click "Back to Dashboard"

## Step 10: View Rankings

### 10.1 Login as Recruiter
1. Go to http://localhost:3000/admin-login
2. Login with recruiter credentials

### 10.2 View Rankings
1. Go to Recruiter Dashboard
2. Click "Candidates & Interviews" tab
3. You should see the candidate with their interview score

## Troubleshooting

### Backend Won't Start
```
Error: Cannot find package '@google/generative-ai'
```
**Solution:**
```bash
cd server
npm install
```

### MongoDB Connection Error
```
❌ MongoDB connection error: Could not connect to any servers
```
**Solution:**
1. Check MONGODB_URI in .env
2. Verify username and password
3. Check IP whitelist in MongoDB Atlas
4. Ensure cluster is running

### Frontend Won't Connect
```
Error: Cannot GET /
```
**Solution:**
1. Ensure backend is running on port 5555
2. Check frontend is running on port 3000
3. Check browser console for errors

### Interview Link Not Working
```
Interview not found or expired
```
**Solution:**
1. Generate new interview link
2. Ensure candidate is logged in
3. Check token hasn't expired (7 days)

### Gemini API Error
```
Error generating questions: Error: Invalid API key
```
**Solution:**
1. Verify GEMINI_API_KEY in .env
2. Get new key from https://aistudio.google.com/
3. System will use fallback questions if API fails

## Verification Checklist

- [ ] Backend running on port 5555
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Recruiter account created
- [ ] Candidate account created
- [ ] Job posting created
- [ ] Candidate applied for job
- [ ] Interview link generated
- [ ] Interview started successfully
- [ ] Questions displayed
- [ ] Answers evaluated
- [ ] Final score shown
- [ ] Score saved to database
- [ ] Recruiter can see rankings

## Next Steps

1. ✅ Test with multiple candidates
2. ✅ Test with different job types
3. ✅ Monitor server logs
4. ✅ Check database for saved data
5. ✅ Customize questions if needed
6. ✅ Deploy to production

## Quick Commands Reference

```bash
# Start backend
cd server && npm run dev

# Start frontend
cd client && npm run dev

# Check backend health
curl http://localhost:5555/api/health

# View MongoDB data
# Go to MongoDB Atlas dashboard

# View server logs
# Check terminal running backend

# View browser console
# Press F12 in browser
```

## Support

If you encounter issues:
1. Check `INTERVIEW_DEBUGGING_GUIDE.md`
2. Review server logs
3. Check browser console
4. Verify environment configuration
5. Test API endpoints with cURL

## Success Indicators

✅ Backend starts without errors
✅ Frontend loads at http://localhost:3000
✅ Can register accounts
✅ Can create jobs
✅ Can apply for jobs
✅ Can generate interview links
✅ Can take interviews
✅ Can see scores
✅ Can view rankings

---

**You're all set! The interview system is ready to use.** 🚀

For detailed documentation, see:
- `INTERVIEW_SYSTEM_SETUP.md` - Complete setup guide
- `INTERVIEW_DEBUGGING_GUIDE.md` - Troubleshooting
- `INTERVIEW_QUICK_REFERENCE.md` - API reference
