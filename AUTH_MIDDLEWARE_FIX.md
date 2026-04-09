# Authentication Middleware Fix

## Problem
```
Error sending interview link: TypeError: Cannot read properties of undefined (reading 'id')
at file:///C:/Users/manas/OneDrive/Desktop/Hackathon!!/server/routes/aiInterview.js:27:34
```

## Root Cause
The authentication middleware sets `req.userId` and `req.role`, but the AI Interview routes were trying to access `req.user.id` which doesn't exist.

## Solution Applied
Updated all instances in `server/routes/aiInterview.js`:
- Changed `req.user.id` → `req.userId`

### Fixed Lines
1. Line 27: `const recruiterId = req.userId` (was `req.user.id`)
2. Line 212: `const candidateId = req.userId` (was `req.user.id`)
3. Line 234: `const candidateId = req.userId` (was `req.user.id`)
4. Line 254: `const candidateId = req.userId` (was `req.user.id`)

## How Authentication Works

### Middleware (`server/middleware/auth.js`)
```javascript
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId    // ← Sets this
    req.role = decoded.role        // ← Sets this
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

### Usage in Routes
```javascript
// Correct ✅
const recruiterId = req.userId

// Incorrect ❌
const recruiterId = req.user.id
```

## What Changed

### Before (Broken)
```javascript
router.post('/send-link', authenticate, async (req, res) => {
  const recruiterId = req.user.id  // ❌ undefined
  // ...
})
```

### After (Fixed)
```javascript
router.post('/send-link', authenticate, async (req, res) => {
  const recruiterId = req.userId   // ✅ correct
  // ...
})
```

## Test the Fix

1. **Restart server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Try sending interview link:**
   - Go to http://localhost:3000
   - Login as Admin
   - Go to "Candidates & Interviews" tab
   - Select a candidate
   - Click "Send AI Interview Link"

3. **Expected result:**
   - No error in server logs
   - Success message in browser
   - Email sent to candidate

## Verification

Check server logs for:
```
=== SEND AI INTERVIEW LINK ===
Recruiter: [id]
Candidate: [id]
Job: [id]
=== INTERVIEW LINK SENT ===
```

If you see this, the fix worked! ✅

## Files Modified
- `server/routes/aiInterview.js` - Fixed 4 instances of `req.user.id` → `req.userId`

## Related Files
- `server/middleware/auth.js` - Authentication middleware (no changes needed)
- `server/routes/aiInterview.js` - AI Interview routes (fixed)

## Summary
The authentication middleware was working correctly, but the routes were using the wrong property name. This has been fixed and the feature should now work properly.
