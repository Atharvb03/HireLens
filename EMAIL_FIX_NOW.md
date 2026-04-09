# Email Fix - Do This Now (5 minutes)

## Current Status
✅ Interview link created successfully
❌ Email not sending (Gmail credentials incorrect)

## Quick Fix

### Step 1: Get Gmail App Password (2 minutes)

1. Go to: https://myaccount.google.com/apppasswords
2. Select:
   - App: **Mail**
   - Device: **Windows Computer**
3. Click **"Generate"**
4. Copy the 16-character password (ignore spaces)

**Example:** `abcd efgh ijkl mnop` → copy as `abcdefghijklmnop`

### Step 2: Update .env (1 minute)

Open `server/.env` and change:

```
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Example:**
```
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

### Step 3: Restart Server (1 minute)

```bash
cd server
npm run dev
```

### Step 4: Test (1 minute)

1. Go to http://localhost:3000
2. Login as Admin
3. Select a candidate
4. Click "Send AI Interview Link"
5. Should see: "AI Interview link sent to [Candidate Name]!"

## That's It!

Email should now work. Check candidate's email for the interview invitation.

## If Still Not Working

**Check:**
1. Is 2-Factor Authentication enabled on Gmail?
   - Go to https://myaccount.google.com/security
   - Look for "2-Step Verification"
   - Must be ON

2. Is the password 16 characters?
   - App passwords are always 16 characters
   - If not, generate a new one

3. Did you restart the server?
   - Stop: Ctrl+C
   - Start: `npm run dev`

4. Is the email address correct?
   - Must be your actual Gmail address
   - Not a placeholder

## Full Guide

See `GMAIL_SETUP_GUIDE.md` for detailed instructions.

---

**Ready?** Follow the 4 steps above and you're done! 🚀
