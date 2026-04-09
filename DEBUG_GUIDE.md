# HireLens Match Score Debugging Guide

## Current Setup
- **Backend**: Running on port 5555
- **Frontend**: Running on port 3000
- **Frontend Proxy**: `/api` → `http://localhost:5555`

## Step-by-Step Testing

### 1. Start Backend
```bash
cd server
npm run dev
```
Wait for: `✅ MongoDB connected successfully`

### 2. Start Frontend (in new terminal)
```bash
cd client
npm run dev
```
Wait for: `Local: http://localhost:3000/`

### 3. Open Browser
```
http://localhost:3000
```

### 4. Create Admin Account
- Click "Admin Login"
- Click "Sign Up"
- Fill in:
  - Email: `admin@test.com`
  - Password: `admin123`
  - Company: `Test Company`
- Click "Sign Up"

### 5. Post a Job
- Go to "Job Management" tab
- Click "Post New Job"
- Fill in:
  - **Title**: `React Developer`
  - **Description**: `We are looking for an experienced React developer with strong JavaScript skills. Must have experience with Node.js and MongoDB. You should be familiar with Express and REST APIs.`
  - **Required Skills**: `React, JavaScript, Node.js, MongoDB`
  - **Experience**: `2-3 years`
  - **Salary**: `$50k-$70k`
  - **Location**: `Remote`
- Click "Post Job"

### 6. Create Candidate Account
- Click "Logout"
- Click "Candidate Login"
- Click "Sign Up"
- Fill in:
  - Name: `John Doe`
  - Email: `candidate@test.com`
  - Password: `candidate123`
- Click "Sign Up"

### 7. Apply for Job
- Go to "Browse Jobs" tab
- Find "React Developer" job
- Click "Apply Now"
- **Upload Resume**: Select `test_resume.txt` from project root
- **Availability**: Select `Immediate Joining`
- Click "Submit Application"

### 8. Check Match Score
- Go to "My Applications" tab
- You should see the job with a **Match Score** (e.g., "85%")

### 9. View in Recruiter Dashboard
- Logout
- Login as admin
- Go to "Candidates & Interviews" tab
- You should see the candidate ranked with match score

## Debugging Checklist

### If Match Score is 0%:

1. **Check Server Console** for these logs:
   ```
   Apply Request: { jobId: '...', availability: 'immediate', fileName: 'test_resume.txt' }
   Resume extracted: { length: 450, mimeType: 'text/plain' }
   Match Calculation: {
     resumeTextLength: 450,
     jobDescLength: 200,
     requiredSkills: [ 'React', 'JavaScript', 'Node.js', 'MongoDB' ],
     extractedSkills: [ 'react', 'javascript', 'node.js', 'mongodb' ],
     skillMatchScore: 100,
     semanticSimilarity: 75.5,
     finalScore: 82.3
   }
   ```

2. **If Resume Text Length is 0**:
   - File parsing failed
   - Try with a plain `.txt` file first
   - Check if file is being uploaded

3. **If Extracted Skills is Empty**:
   - Skills not found in resume
   - Make sure resume contains the required skills
   - Skills are case-insensitive

4. **If Skill Match Score is 0%**:
   - No matching skills between resume and job
   - Add more skills to resume

5. **If Semantic Similarity is 0%**:
   - Resume and job description have no common words
   - Make sure resume mentions relevant topics

### Common Errors:

| Error | Solution |
|-------|----------|
| "Resume file is required" | Make sure you selected a file |
| "Availability is required" | Make sure you selected availability |
| "Already applied to this job" | Use a different candidate or job |
| "Failed to apply for job" | Check server console for error |
| Match score not showing | Refresh page or check browser console |

## Test Resume Content

The `test_resume.txt` file should contain:
- Skills: React, JavaScript, Node.js, MongoDB, Express
- Experience with relevant technologies
- Project descriptions mentioning the skills

## Expected Match Score

For the test resume and job:
- **Skill Match**: 100% (all 4 required skills present)
- **Semantic Similarity**: 70-80% (common words and topics)
- **Final Score**: 82-88% (weighted average)

## Ports Configuration

- Backend: 5555
- Frontend: 3000
- Proxy: `/api` → `http://localhost:5555`

If you change ports, update:
1. `server/.env` - PORT variable
2. `client/vite.config.js` - proxy URL
