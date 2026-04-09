# Gmail Setup Guide - Fix Email Authentication Error

## Current Error
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

This means your Gmail credentials in `.env` are incorrect or not configured.

## Solution: Use Gmail App Password

### Step 1: Enable 2-Factor Authentication (if not already enabled)

1. Go to https://myaccount.google.com/security
2. Look for "2-Step Verification"
3. If not enabled, click "Enable 2-Step Verification"
4. Follow the prompts to set it up

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. You should see a dropdown menu at the top
3. Select:
   - **App:** Mail
   - **Device:** Windows Computer (or your device type)
4. Click **"Generate"**
5. Google will show you a 16-character password
6. **Copy this password** (you'll need it in the next step)

**Example password format:**
```
abcd efgh ijkl mnop
```
(16 characters, with spaces - copy without spaces)

### Step 3: Update .env File

Open `server/.env` and update:

```
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
AI_INTERVIEW_BASE_URL=http://localhost:3001
```

**Important:**
- Replace `your-actual-gmail@gmail.com` with your actual Gmail address
- Replace `abcdefghijklmnop` with the 16-character password from Step 2
- Remove any spaces from the password
- Do NOT use your regular Gmail password

### Step 4: Restart Server

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
```

### Step 5: Test Email

Try sending an interview link again:
1. Go to http://localhost:3000
2. Login as Admin
3. Go to "Candidates & Interviews" tab
4. Select a candidate
5. Click "Send AI Interview Link"

**Expected result:**
- Alert: "AI Interview link sent to [Candidate Name]!"
- No email error in server logs
- Candidate receives email

## Troubleshooting

### Still Getting "Invalid login" Error?

**Check these:**

1. **Is 2-Factor Authentication enabled?**
   - Go to https://myaccount.google.com/security
   - Look for "2-Step Verification"
   - Must be enabled to use app passwords

2. **Is the password 16 characters?**
   - App passwords are always 16 characters
   - If shorter, you may have copied wrong
   - Generate a new one

3. **Did you remove spaces?**
   - Google shows password with spaces: `abcd efgh ijkl mnop`
   - Copy without spaces: `abcdefghijklmnop`

4. **Did you restart the server?**
   - Changes to .env require server restart
   - Stop server (Ctrl+C)
   - Run `npm run dev` again

5. **Is the email address correct?**
   - Must be your actual Gmail address
   - Example: `john.doe@gmail.com`
   - Not a placeholder like `your-email@gmail.com`

### "Less secure app access" Error?

If you see this error, you're using the wrong password type:

**Solution:**
1. Go to https://myaccount.google.com/apppasswords
2. Generate a new app password (not your regular password)
3. Use the 16-character app password in .env

### Email Still Not Sending?

**Try these steps:**

1. **Verify credentials:**
   ```bash
   # In server directory, test email manually
   node -e "
   const nodemailer = require('nodemailer');
   const t = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: 'your-email@gmail.com',
       pass: 'your-16-char-password'
     }
   });
   t.sendMail({
     from: 'your-email@gmail.com',
     to: 'test@example.com',
     subject: 'Test',
     text: 'Test email'
   }, (e, i) => console.log(e ? 'Error: ' + e.message : 'Success'));
   "
   ```

2. **Check Gmail security:**
   - Go to https://myaccount.google.com/security
   - Look for "Less secure app access"
   - Should be OFF (you're using app password)

3. **Check if account is locked:**
   - Go to https://accounts.google.com/signin/recovery
   - Follow prompts if account is locked

4. **Generate new app password:**
   - Go to https://myaccount.google.com/apppasswords
   - Delete old password
   - Generate new one
   - Update .env

## Step-by-Step Example

### Your Gmail: john.doe@gmail.com

**Step 1: Go to app passwords**
- URL: https://myaccount.google.com/apppasswords

**Step 2: Select Mail and Windows Computer**
- App: Mail
- Device: Windows Computer

**Step 3: Generate**
- Click "Generate"
- Google shows: `abcd efgh ijkl mnop`

**Step 4: Update .env**
```
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Step 5: Restart server**
```bash
npm run dev
```

**Step 6: Test**
- Send interview link
- Check email

## Alternative: Use Different Email Provider

If you don't want to use Gmail, you can use other providers:

### Outlook/Hotmail
```
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

Update `server/routes/aiInterview.js` line 12:
```javascript
const transporter = nodemailer.createTransport({
  service: 'outlook',  // Change from 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})
```

### SendGrid
```
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

Update `server/routes/aiInterview.js`:
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.EMAIL_PASSWORD
  }
})
```

## Verification Checklist

- [ ] 2-Factor Authentication enabled on Gmail
- [ ] Generated app password (16 characters)
- [ ] Copied password without spaces
- [ ] Updated EMAIL_USER in .env
- [ ] Updated EMAIL_PASSWORD in .env
- [ ] Restarted server
- [ ] No errors in server logs
- [ ] Email received by candidate

## Success Indicators

### Server Logs
```
=== SEND AI INTERVIEW LINK ===
Recruiter: [id]
Candidate: [id]
Job: [id]
Email sent: [response]
=== INTERVIEW LINK SENT ===
```

### Browser
```
Alert: "AI Interview link sent to [Candidate Name]!"
```

### Email
```
Subject: AI Interview Invitation - [Job Title] at HireLens
From: your-email@gmail.com
To: candidate@example.com
```

## Quick Reference

| Step | Action | Time |
|------|--------|------|
| 1 | Enable 2FA on Gmail | 2 min |
| 2 | Generate app password | 1 min |
| 3 | Update .env | 1 min |
| 4 | Restart server | 1 min |
| 5 | Test feature | 1 min |
| **Total** | | **6 min** |

## Summary

The error is because your Gmail credentials are not configured. Follow these steps:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an app password** (16 characters)
3. **Update .env** with your email and app password
4. **Restart server**
5. **Test the feature**

That's it! Email should now work perfectly.

---

**Questions?** Check the troubleshooting section above.

**Ready?** Let's get email working! 🚀
