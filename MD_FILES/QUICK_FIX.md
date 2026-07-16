# Quick Fix - Install Client Dependencies

## The Issue
Socket.io is installed on the server ✅, but we need to install it on the client too.

## Solution

### Option 1: Use the Installation Script (Easiest)
1. Go to your project root folder: `D:\New Projects\HireLens`
2. Double-click `install-dependencies.bat`
3. Wait for it to complete
4. Done!

### Option 2: Manual Installation (If script doesn't work)

**Step 1: Open Command Prompt or PowerShell**

**Step 2: Navigate to client folder**
```bash
cd "D:\New Projects\HireLens\client"
```

**Step 3: Install socket.io-client**
```bash
npm install socket.io-client
```

**Step 4: Verify installation**
```bash
npm list socket.io-client
```

You should see: `socket.io-client@4.x.x`

## After Installation

### Start the Server
```bash
cd "D:\New Projects\HireLens\server"
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
🔌 Socket.io ready for real-time updates
```

### Start the Client (in a new terminal)
```bash
cd "D:\New Projects\HireLens\client"
npm run dev
```

## Verify It's Working

1. Open browser to http://localhost:5173
2. Login as recruiter
3. Look for green "Live" indicator in the header
4. If you see "Live" with a green dot, Socket.io is connected! ✅

## Troubleshooting

### "Cannot find package 'socket.io-client'"
- Make sure you're in the client directory
- Run: `npm install socket.io-client`
- Check: `npm list socket.io-client`

### "The system cannot find the path specified"
- Use quotes around the path: `cd "D:\New Projects\HireLens\client"`
- Or use the installation script

### Server still shows error
- Make sure socket.io is installed: `cd server && npm list socket.io`
- Should show: `socket.io@4.8.3` ✅

### Client shows "Offline" status
- Verify server is running
- Check server console for "Socket.io ready" message
- Check browser console for connection errors
- Verify CLIENT_URL in server/.env matches your client URL

## Quick Test

After both are installed and running:

1. **Server Terminal:** Should show "Socket.io ready for real-time updates"
2. **Client Browser:** Should show green "Live" indicator
3. **Browser Console:** Should show "🔌 Connected to Socket.io server"

If you see all three, you're good to go! 🎉
