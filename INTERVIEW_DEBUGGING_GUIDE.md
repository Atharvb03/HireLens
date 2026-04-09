# Interview System - Debugging Guide

## Common Issues and Solutions

### Issue 1: 400 Bad Request on /api/interview-session/start

**Error Message:**
```
POST http://localhost:3000/api/interview-session/start 400 (Bad Request)
```

**Root Causes:**
1. Missing required fields in request body
2. Invalid field values
3. Authentication token missing

**Debug Steps:**

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Network tab
   - Click on the failed request
   - Check Request body and Response

2. **Check Server Logs**
   - Look for error messages in terminal running `npm run dev`
   - Should show which fields are missing

3. **Verify Request Payload**
   - Required fields:
     - `candidateId` - Must be valid MongoDB ObjectId
     - `jobRole` - Must be non-empty string
     - `interviewToken` - Must be valid token from AI interview link
   - Optional fields:
     - `jobDescription` - String
     - `requiredSkills` - Array of strings
     - `candidateSkills` - Array of strings

4. **Check Authentication**
   - Ensure Authorization header has valid JWT token
   - Token should be from localStorage.getItem('token')

**Solution:**
```javascript
// In InterviewPage.jsx, verify the payload:
const payload = {
  candidateId: localStorage.getItem('userId'),  // Must exist
  jobRole: interview.jobTitle || 'Interview',   // Must not be empty
  jobDescription: `Interview for ${jobTitle}`,
  requiredSkills: [],
  candidateSkills: [],
  interviewToken: token  // Must match the token from URL
}

console.log('Sending payload:', payload)
```

---

### Issue 2: Gemini API Errors

**Error Messages:**
```
Error generating questions: Error: Invalid API key
Error generating questions: Error: API rate limit exceeded
```

**Root Causes:**
1. GEMINI_API_KEY not set in .env
2. Invalid API key
3. API rate limit exceeded
4. Network connectivity issue

**Debug Steps:**

1. **Verify API Key**
   ```bash
   # In server/.env, check:
   GEMINI_API_KEY=your_actual_key_here
   ```

2. **Check Server Logs**
   - Look for "Generating questions for:" message
   - Should show Gemini response or fallback message

3. **Test API Key**
   ```javascript
   // Add to interviewService.js temporarily:
   console.log('Using API key:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...')
   ```

**Solution:**
- System has fallback questions if Gemini API fails
- Check server console for "Using fallback questions" message
- Verify API key is valid at https://aistudio.google.com/

---

### Issue 3: Interview Link Not Working

**Error Message:**
```
Interview not found or expired
```

**Root Causes:**
1. Token expired (7 days)
2. Token doesn't exist in database
3. Interview marked as expired
4. Candidate not logged in

**Debug Steps:**

1. **Check Token Validity**
   ```bash
   # In browser console:
   const token = window.location.pathname.split('/').pop()
   console.log('Interview token:', token)
   ```

2. **Check API Response**
   ```javascript
   // In InterviewPage.jsx, add logging:
   const interviewResponse = await axios.get(`/api/ai-interview/${token}`)
   console.log('Interview response:', interviewResponse.data)
   ```

3. **Verify Database**
   - Check MongoDB for AIInterview collection
   - Verify token exists and not expired
   - Check status is not 'expired'

4. **Check Authentication**
   - Ensure candidate is logged in
   - Check localStorage has 'token' and 'userId'

**Solution:**
- Generate new interview link from recruiter dashboard
- Ensure candidate is logged in before accessing link
- Check token hasn't expired (7 days)

---

### Issue 4: Questions Not Generating

**Symptoms:**
- Interview starts but no questions displayed
- Empty questions array
- Blank question text

**Root Causes:**
1. Gemini API failed and fallback not working
2. Invalid response format from Gemini
3. JSON parsing error

**Debug Steps:**

1. **Check Server Logs**
   - Look for "Generating questions for:" message
   - Look for "Generated X questions" message
   - Look for "Using fallback questions" message

2. **Check Response Format**
   ```javascript
   // In interviewService.js, add logging:
   console.log('Gemini response:', responseText)
   console.log('JSON match:', jsonMatch)
   ```

3. **Verify Fallback Questions**
   - If Gemini fails, system should use fallback
   - Check if fallback questions are being returned

**Solution:**
- Check Gemini API key is valid
- Check server logs for detailed error messages
- System will use fallback questions if API fails
- Fallback questions are generic but functional

---

### Issue 5: Scores Not Updating

**Symptoms:**
- Interview completes but score not saved
- Recruiter dashboard shows no score
- Score shows as null/undefined

**Root Causes:**
1. `/api/ai-interview/update-score` endpoint failed
2. Interview token not found
3. Database update failed
4. Network error

**Debug Steps:**

1. **Check Browser Console**
   - Look for errors after "Complete Interview" button clicked
   - Check Network tab for update-score request

2. **Check Server Logs**
   - Look for "UPDATE INTERVIEW SCORE" message
   - Look for "SCORE UPDATED" message
   - Look for any error messages

3. **Verify Interview Completion**
   ```javascript
   // In InterviewPage.jsx, add logging:
   const response = await axios.post(`/api/interview-session/${session.sessionId}/complete`)
   console.log('Completion response:', response.data)
   ```

4. **Check Database**
   - Verify AIInterview document has score field updated
   - Check status changed to 'completed'

**Solution:**
- Ensure interview completes successfully
- Check server logs for update-score errors
- Verify MongoDB connection
- Check interview token is valid

---

### Issue 6: Answer Evaluation Failing

**Symptoms:**
- Submit Answer button doesn't work
- No evaluation shown
- Error in console

**Root Causes:**
1. Gemini API failed
2. Invalid answer format
3. Network error
4. Session/question not found

**Debug Steps:**

1. **Check Answer Submission**
   ```javascript
   // In InterviewPage.jsx, verify:
   const answer = answers[currentQuestion.id]
   console.log('Submitting answer:', answer)
   ```

2. **Check Server Logs**
   - Look for "Evaluating answer for question type:" message
   - Look for "Answer evaluated. Score:" message
   - Look for any error messages

3. **Check Gemini Response**
   - Verify Gemini returns valid JSON
   - Check score is between 0-100
   - Check feedback is non-empty

**Solution:**
- Ensure answer is not empty
- Check Gemini API key is valid
- System uses fallback evaluation if API fails
- Check server logs for detailed errors

---

## Monitoring and Logging

### Enable Detailed Logging

**In server/routes/interviewSession.js:**
```javascript
console.log('\n=== START INTERVIEW SESSION ===')
console.log('Request body:', req.body)
console.log('Auth user ID:', req.userId)
```

**In server/services/interviewService.js:**
```javascript
console.log('Generating questions for:', jobRole)
console.log('Gemini response:', responseText)
console.log(`Generated ${questions.length} questions`)
```

**In client/src/pages/InterviewPage.jsx:**
```javascript
console.log('Interview token:', token)
console.log('Interview response:', interviewResponse.data)
console.log('Session response:', sessionResponse.data)
```

### Check Server Health

```bash
# Test API health
curl http://localhost:5555/api/health

# Expected response:
# {"status":"Server is running","timestamp":"2026-03-12T..."}
```

---

## Performance Tips

1. **Reduce API Calls**
   - Cache interview details
   - Reuse session data

2. **Optimize Question Generation**
   - Use shorter prompts
   - Batch process if needed

3. **Monitor Database**
   - Check MongoDB connection
   - Monitor query performance

---

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] MongoDB connection successful
- [ ] Recruiter can generate interview link
- [ ] Candidate can access interview link
- [ ] Questions generate successfully
- [ ] Answers can be submitted
- [ ] Evaluation shows score
- [ ] Interview completes successfully
- [ ] Score updates in database
- [ ] Recruiter can see rankings

---

## Getting Help

1. **Check Server Logs**
   - Most detailed error information
   - Shows API calls and responses

2. **Check Browser Console**
   - Frontend errors and network issues
   - API response details

3. **Check MongoDB**
   - Verify data is being saved
   - Check document structure

4. **Test API Endpoints**
   - Use cURL or Postman
   - Verify endpoint responses

5. **Review Code**
   - Check error handling
   - Verify field names match
   - Check data types
