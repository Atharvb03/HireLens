# Test Domain-Specific Interview Questions

## Quick Test (10 minutes)

### Step 1: Restart Backend
```bash
cd server
npm run dev
```

### Step 2: Create Frontend Developer Job
1. Login as recruiter
2. Go to "Job Management"
3. Click "Post New Job"
4. Fill in:
   - Title: **"Senior React Developer"**
   - Description: **"Build scalable React applications using modern JavaScript. Experience with hooks, state management, and performance optimization required."**
   - Skills: **"React, JavaScript, CSS, Redux, TypeScript"**
   - Location: "Remote"
5. Click "Post Job"

### Step 3: Apply for Job (Candidate)
1. Login as candidate
2. Go to "Browse Jobs"
3. Find "Senior React Developer"
4. Click "Apply"
5. Upload resume
6. Click "Submit Application"

### Step 4: Generate Interview Link (Recruiter)
1. Go to "Candidates & Interviews"
2. Select candidate
3. Click "Generate AI Interview Link"
4. Copy link

### Step 5: Take Interview (Candidate)
1. Open interview link
2. **Verify questions are React-specific:**
   - Should see questions about React, hooks, state management
   - NOT generic questions
   - Should mention React, JavaScript, CSS
3. Answer all 5 questions
4. Complete interview

### Step 6: Verify Questions
Expected React-specific questions:
- ✅ "Explain React hooks and their use cases"
- ✅ "How would you optimize React component performance?"
- ✅ "Describe your approach to state management in React"
- ✅ "What is the virtual DOM and how does it work?"
- ✅ "How do you handle side effects in React?"

NOT expected (generic questions):
- ❌ "What is your experience with React?"
- ❌ "Describe a challenging project"
- ❌ "What are your career goals?"

---

## Test with Different Roles

### Test 1: Backend Developer
1. Create job: "Senior Backend Developer"
2. Description: "Build scalable APIs using Node.js and MongoDB..."
3. Skills: "Node.js, MongoDB, Express, REST APIs"
4. Apply and take interview
5. Verify questions about:
   - Database design
   - API architecture
   - Scalability
   - Authentication

### Test 2: DevOps Engineer
1. Create job: "DevOps Engineer"
2. Description: "Manage infrastructure using Docker and Kubernetes..."
3. Skills: "Docker, Kubernetes, CI/CD, AWS"
4. Apply and take interview
5. Verify questions about:
   - Containerization
   - CI/CD pipelines
   - Infrastructure
   - Monitoring

### Test 3: Data Scientist
1. Create job: "Data Scientist"
2. Description: "Build ML models for data analysis..."
3. Skills: "Python, Machine Learning, TensorFlow, SQL"
4. Apply and take interview
5. Verify questions about:
   - ML algorithms
   - Data preprocessing
   - Model evaluation
   - Feature engineering

---

## Verification Checklist

### Questions Should Be:
- [ ] Specific to the job role
- [ ] Related to required skills
- [ ] Practical and real-world
- [ ] Progressive difficulty
- [ ] Mix of question types

### Questions Should NOT Be:
- [ ] Generic/irrelevant
- [ ] About career goals
- [ ] About general experience
- [ ] Unrelated to job description

### System Should:
- [ ] Fetch job details correctly
- [ ] Pass job info to backend
- [ ] Generate role-specific questions
- [ ] Use fallback if API fails
- [ ] Calculate scores correctly
- [ ] Display rankings correctly

---

## Expected Results

### React Developer Interview
```
Question 1: Explain React hooks and their use cases
Question 2: How would you optimize React component performance?
Question 3: Describe your approach to state management
Question 4: What is the virtual DOM and how does it work?
Question 5: How do you handle side effects in React?
```

### Backend Developer Interview
```
Question 1: Explain the difference between SQL and NoSQL
Question 2: How would you design a scalable REST API?
Question 3: What is database indexing and why is it important?
Question 4: Describe your approach to authentication
Question 5: How do you ensure data consistency?
```

### DevOps Engineer Interview
```
Question 1: Explain containerization and Docker
Question 2: How would you design a CI/CD pipeline?
Question 3: What monitoring strategies do you use?
Question 4: Describe infrastructure as code approach
Question 5: How do you handle disaster recovery?
```

---

## Debugging

### If Questions Are Still Generic:
1. Check backend logs for Gemini API calls
2. Verify job details are being passed
3. Check if fallback is being used
4. Verify job description is not empty
5. Check required skills are populated

### Check Backend Logs:
```
Generating questions for: Senior React Developer
Job Description: Build scalable React applications...
Required Skills: React, JavaScript, CSS, Redux, TypeScript
Attempting to generate questions with Gemini API...
Generated 5 questions
```

### Check Frontend:
1. Open browser DevTools
2. Go to Network tab
3. Check GET /api/ai-interview/{token}
4. Verify response includes:
   - jobDescription
   - requiredSkills
   - jobTitle

---

## Performance

- Question generation: 2-5 seconds (Gemini API)
- Fallback questions: instant
- Interview flow: smooth
- No lag or delays

---

## Summary

Domain-specific questions are now:
- ✅ Role-specific
- ✅ Job-description aware
- ✅ Skill-focused
- ✅ Practical and relevant
- ✅ Better for assessment

**Status: ✅ READY TO TEST**

---

## Next Steps

1. Restart backend
2. Create job with specific role
3. Apply and take interview
4. Verify questions are domain-specific
5. Test with different roles
6. Deploy to production

---

**Questions?** Check `DOMAIN_SPECIFIC_QUESTIONS.md` for details.
