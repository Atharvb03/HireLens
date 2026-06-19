# Socket.io Installation Guide

## Current Status
✅ Server: socket.io installed (v4.8.3)
❌ Client: socket.io-client NOT installed yet

## Installation Steps

### Method 1: Double-Click Installation Script (Easiest!)

```
D:\New Projects\HireLens\
├── install-dependencies.bat  ← Double-click this!
└── install-dependencies.ps1  ← Or this (PowerShell)
```

Just double-click the `.bat` file and wait for it to finish!

### Method 2: Manual Installation

#### Step 1: Open Command Prompt
Press `Win + R`, type `cmd`, press Enter

#### Step 2: Navigate to Client Folder
```cmd
cd "D:\New Projects\HireLens\client"
```

#### Step 3: Install Socket.io Client
```cmd
npm install socket.io-client
```

You should see:
```
added X packages in Xs
```

#### Step 4: Verify Installation
```cmd
npm list socket.io-client
```

Expected output:
```
talentai-client@1.0.0
└── socket.io-client@4.x.x
```

## Starting the Application

### Terminal 1: Start Server
```cmd
cd "D:\New Projects\HireLens\server"
npm run dev
```

Expected output:
```
[nodemon] starting `node --openssl-legacy-provider server.js`
✅ MongoDB connected successfully
🔑 GEMINI_API_KEY loaded: true
🔑 OPENAI_API_KEY loaded: true
🚀 Server running on port 5000
📍 API Health: http://localhost:5000/api/health
🔗 Frontend should connect to: http://localhost:5000
🔌 Socket.io ready for real-time updates  ← Look for this!
```

### Terminal 2: Start Client
```cmd
cd "D:\New Projects\HireLens\client"
npm run dev
```

Expected output:
```
VITE v5.x.x ready in XXX ms
➜  Local:   http://localhost:5173/
```

## Verification Checklist

### ✅ Server Running
- [ ] Server started without errors
- [ ] See "Socket.io ready for real-time updates" message
- [ ] MongoDB connected successfully

### ✅ Client Running
- [ ] Client started without errors
- [ ] Can access http://localhost:5173

### ✅ Socket.io Connected
- [ ] Login as recruiter
- [ ] See green "Live" indicator in header
- [ ] Open browser console (F12)
- [ ] See "🔌 Connected to Socket.io server" message

## Visual Indicators

### In Recruiter Dashboard Header:
```
┌─────────────────────────────────────────────┐
│  HireLens              🔔  [●] Live  Logout │
│                         ↑    ↑              │
│                    Notification Green dot   │
│                       Bell    (Connected)   │
└─────────────────────────────────────────────┘
```

### If Disconnected:
```
┌─────────────────────────────────────────────┐
│  HireLens              🔔  [●] Offline      │
│                         ↑    ↑              │
│                    Notification Red dot     │
│                       Bell    (Disconnected)│
└─────────────────────────────────────────────┘
```

## Testing Real-Time Notifications

### Step 1: Login as Recruiter
- Go to http://localhost:5173
- Click "Admin Login"
- Login with recruiter credentials
- Verify green "Live" indicator

### Step 2: Complete Interview (as Candidate)
- Open new browser window (or incognito)
- Login as candidate
- Complete an AI interview
- Submit all answers

### Step 3: Check Recruiter Dashboard
You should see:
1. **Notification Bell:** Badge with count appears
2. **Toast Notification:** Slides in from right
3. **Browser Notification:** OS notification (if permitted)
4. **Candidate List:** Auto-refreshes with new data

## Troubleshooting

### Error: "Cannot find package 'socket.io'"
**Solution:** Install server dependencies
```cmd
cd "D:\New Projects\HireLens\server"
npm install socket.io
```

### Error: "Cannot find package 'socket.io-client'"
**Solution:** Install client dependencies
```cmd
cd "D:\New Projects\HireLens\client"
npm install socket.io-client
```

### Error: "The system cannot find the path specified"
**Solution:** Use quotes around path with spaces
```cmd
cd "D:\New Projects\HireLens\client"
```

### Client shows "Offline" status
**Possible causes:**
1. Server not running → Start server first
2. Wrong CLIENT_URL in .env → Check server/.env
3. Port mismatch → Verify client runs on 5173
4. Firewall blocking → Check Windows Firewall

**Check server console for:**
```
🔌 Client connected: <socket-id>
👔 Recruiter joined room: <socket-id>
```

### No notifications appearing
**Checklist:**
- [ ] Server running with "Socket.io ready" message
- [ ] Client shows green "Live" indicator
- [ ] Logged in as recruiter (not candidate)
- [ ] Interview actually completed
- [ ] Check browser console for errors

## Environment Variables

### server/.env
```env
# Required for Socket.io
CLIENT_URL=http://localhost:5173

# Other required variables
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

### client/.env (Optional)
```env
VITE_API_URL=http://localhost:5000
```

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Server | 5000 | http://localhost:5000 |
| Client | 5173 | http://localhost:5173 |
| Socket.io | 5000 | ws://localhost:5000 |

## Success Indicators

### ✅ Everything Working
```
Server Terminal:
  ✅ MongoDB connected successfully
  ✅ Socket.io ready for real-time updates
  ✅ Server running on port 5000

Client Browser:
  ✅ Green "Live" indicator
  ✅ Notification bell visible
  ✅ Console: "🔌 Connected to Socket.io server"

Test Notification:
  ✅ Badge appears on bell
  ✅ Toast notification slides in
  ✅ Browser notification shows
  ✅ Candidate list refreshes
```

## Need Help?

1. Check `QUICK_FIX.md` for common issues
2. Review `SOCKET_IO_IMPLEMENTATION.md` for technical details
3. See `NOTIFICATION_FLOW_DIAGRAM.md` for system architecture
4. Check browser console (F12) for errors
5. Check server terminal for error messages

## Next Steps After Installation

1. ✅ Install dependencies (you're here!)
2. ✅ Start server and client
3. ✅ Verify "Live" connection
4. ✅ Test notifications
5. ✅ Review documentation
6. 🚀 Start using real-time notifications!

---

**Current Task:** Install socket.io-client in the client directory

**Command:**
```cmd
cd "D:\New Projects\HireLens\client"
npm install socket.io-client
```

**Then restart your server:**
```cmd
cd "D:\New Projects\HireLens\server"
npm run dev
```

Good luck! 🎉
