# Setup Instructions for Real-Time Notifications

## Quick Start

### 1. Install Dependencies

**Option A: Using Installation Script (Recommended)**

Double-click one of these files in the project root:
- `install-dependencies.bat` (Windows Command Prompt)
- `install-dependencies.ps1` (PowerShell - may need to run as administrator)

**Option B: Manual Installation**

Open two separate terminals:

**Terminal 1 - Server:**
```bash
cd server
npm install socket.io
```

**Terminal 2 - Client:**
```bash
cd client
npm install socket.io-client
```

This will install the newly added Socket.io dependencies:
- `socket.io` (server)
- `socket.io-client` (client)

**Note:** If you see path errors with spaces in folder names, use the installation scripts or navigate to each directory separately.

### 2. Environment Configuration

**Server (.env):**
Add or verify this line exists:
```env
CLIENT_URL=http://localhost:5173
```

**Client (.env):** (Optional)
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start the Application

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
🔌 Socket.io ready for real-time updates
```

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```

### 4. Test Real-Time Notifications

1. **Login as Recruiter:**
   - Go to http://localhost:5173
   - Click "Admin Login"
   - Login with recruiter credentials
   - You should see a green "Live" indicator in the header

2. **Complete an Interview (as Candidate):**
   - Open a new browser window (or incognito mode)
   - Login as a candidate
   - Complete an AI interview
   - Submit all answers

3. **Verify Notification:**
   - Switch back to recruiter dashboard
   - You should see:
     - Notification bell with badge count
     - Browser notification (if permitted)
     - Updated candidate list
   - Click the bell to see notification details

## Features Overview

### For Recruiters
- **Real-time notifications** when candidates complete interviews
- **Notification bell** with badge counter
- **Notification panel** with interview details
- **Browser notifications** for desktop alerts
- **Auto-refresh** of candidate list
- **Connection status** indicator (Live/Offline)

### Notification Details Include:
- Candidate name and email
- Job title
- Interview score
- Combined score (40% resume + 60% interview)
- Status (hired/rejected)
- Timestamp

## Troubleshooting

### "Cannot find module 'socket.io'"
Run `npm install` in the server directory.

### "Cannot find module 'socket.io-client'"
Run `npm install` in the client directory.

### Connection shows "Offline"
- Verify server is running
- Check server console for errors
- Verify CLIENT_URL in server/.env matches your client URL
- Check browser console for connection errors

### Notifications not appearing
- Verify you're logged in as a recruiter
- Check that the "Live" indicator is green
- Complete a test interview to trigger notification
- Check browser console for errors

### Browser notifications not working
- Click "Allow" when browser asks for notification permission
- Some browsers block notifications on localhost
- Check browser notification settings

## What Changed

### New Files Created:
1. `client/src/context/SocketContext.jsx` - Socket.io React context
2. `SOCKET_IO_IMPLEMENTATION.md` - Detailed documentation
3. `SETUP_INSTRUCTIONS.md` - This file

### Modified Files:
1. `server/package.json` - Added socket.io dependency
2. `client/package.json` - Added socket.io-client dependency
3. `server/server.js` - Integrated Socket.io server
4. `server/routes/aiInterview.js` - Emit notifications on interview completion
5. `client/src/App.jsx` - Added SocketProvider wrapper
6. `client/src/pages/RecruiterDashboard.jsx` - Added notification UI and listeners

## Next Steps

After setup, you can:
1. Customize notification appearance
2. Add sound alerts
3. Implement notification persistence
4. Add more notification types
5. Configure notification preferences

## Support

If you encounter issues:
1. Check console logs (both server and client)
2. Verify all dependencies are installed
3. Ensure environment variables are set correctly
4. Review SOCKET_IO_IMPLEMENTATION.md for detailed information
