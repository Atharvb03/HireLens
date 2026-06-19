# Socket.io Real-Time Notifications Implementation

## Overview
Implemented real-time notifications using Socket.io to push live updates to recruiters when candidates complete interviews.

## Features Implemented

### 1. Server-Side (Backend)
**File: `server/server.js`**
- Integrated Socket.io with Express server
- Created HTTP server wrapper for Socket.io
- Configured CORS for Socket.io connections
- Set up connection handling and room management
- Recruiters join a dedicated "recruiters" room for targeted notifications

**File: `server/routes/aiInterview.js`**
- Emit `interview-completed` event when interview score is updated
- Send comprehensive notification data including:
  - Candidate information (name, email, ID)
  - Job information (title, ID)
  - Scores (interview score, combined score, match score)
  - Status (hired/rejected)
  - Timestamp

### 2. Client-Side (Frontend)

**File: `client/src/context/SocketContext.jsx`**
- Created React Context for Socket.io
- Manages socket connection lifecycle
- Provides connection status
- Auto-reconnection with configurable attempts
- Exports `useSocket` hook for easy access

**File: `client/src/App.jsx`**
- Wrapped application with `SocketProvider`
- Makes socket available to all components

**File: `client/src/pages/RecruiterDashboard.jsx`**
- Integrated Socket.io notifications
- Features:
  - Real-time notification bell with badge counter
  - Notification dropdown panel
  - Browser notifications (with permission)
  - Auto-refresh candidate list on new interview completion
  - Connection status indicator (Live/Offline)
  - Notification history with timestamps
  - Clear all notifications functionality
  - Visual feedback for hired vs rejected candidates

## Installation

### Server Dependencies
```bash
cd server
npm install socket.io
```

### Client Dependencies
```bash
cd client
npm install socket.io-client
```

## Configuration

### Environment Variables
Add to `server/.env`:
```env
CLIENT_URL=http://localhost:5173
```

Add to `client/.env` (optional):
```env
VITE_API_URL=http://localhost:5000
```

## How It Works

### Flow Diagram
```
1. Candidate completes interview
   ↓
2. Interview score updated in database
   ↓
3. Status auto-determined (hired/rejected)
   ↓
4. Combined score calculated
   ↓
5. Candidates re-ranked
   ↓
6. Socket.io emits 'interview-completed' event to 'recruiters' room
   ↓
7. All connected recruiters receive notification instantly
   ↓
8. Notification appears in dashboard with badge
   ↓
9. Browser notification shown (if permitted)
   ↓
10. Candidate list auto-refreshes
```

### Event Structure

**Event Name:** `interview-completed`

**Payload:**
```javascript
{
  type: 'interview_completed',
  timestamp: Date,
  data: {
    candidateId: ObjectId,
    candidateName: String,
    candidateEmail: String,
    jobId: ObjectId,
    jobTitle: String,
    interviewScore: Number,
    combinedScore: Number,
    status: String, // 'hired' or 'rejected'
    matchScore: Number
  }
}
```

## UI Components

### Notification Bell
- Located in dashboard header
- Shows badge with notification count
- Animated pulse effect for new notifications
- Click to toggle notification panel

### Notification Panel
- Dropdown from notification bell
- Shows recent interview completions
- Color-coded by status (green for hired, red for rejected)
- Displays scores and timestamps
- Clear all functionality

### Connection Status
- Green dot: Connected and receiving live updates
- Red dot: Disconnected (will auto-reconnect)

### Browser Notifications
- Native OS notifications
- Requires user permission
- Shows candidate name, job title, and score
- Only shown when permission granted

## Testing

### Manual Testing Steps

1. **Start the servers:**
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

2. **Login as recruiter:**
   - Navigate to recruiter dashboard
   - Verify "Live" status indicator is green

3. **Complete an interview:**
   - Login as candidate in another browser/incognito
   - Complete an AI interview
   - Submit final answers

4. **Verify notification:**
   - Check recruiter dashboard
   - Notification bell should show badge
   - Click bell to see notification details
   - Verify browser notification appears
   - Verify candidate list refreshes automatically

### Console Logs
Server logs to watch:
```
🔌 Client connected: <socket-id>
👔 Recruiter joined room: <socket-id>
🔔 Real-time notification sent to recruiters
```

Client logs to watch:
```
🔌 Connected to Socket.io server
🔔 Interview completed notification: <data>
```

## Troubleshooting

### Connection Issues
- Verify server is running on correct port
- Check CORS configuration in `server.js`
- Ensure `CLIENT_URL` environment variable is set
- Check browser console for connection errors

### Notifications Not Appearing
- Verify recruiter joined the room (check server logs)
- Check if socket is connected (connection status indicator)
- Verify interview completion triggers the event
- Check browser console for errors

### Browser Notifications Not Working
- Check browser notification permissions
- Some browsers block notifications on localhost
- Try using HTTPS or production domain

## Security Considerations

1. **Authentication:** Consider adding JWT verification to socket connections
2. **Room Authorization:** Verify user role before joining recruiter room
3. **Rate Limiting:** Implement rate limiting for socket events
4. **Data Validation:** Validate all emitted data on server side

## Future Enhancements

1. **Candidate Notifications:** Add notifications for candidates (interview invites, status updates)
2. **Persistent Notifications:** Store notifications in database
3. **Notification Preferences:** Allow users to configure notification types
4. **Sound Alerts:** Add optional sound for new notifications
5. **Desktop App:** Electron wrapper for better notification support
6. **Mobile Push:** Integrate with Firebase Cloud Messaging
7. **Notification History:** Dedicated page for all notifications
8. **Mark as Read:** Track read/unread status
9. **Filtering:** Filter notifications by job, status, date
10. **Real-time Chat:** Add recruiter-candidate messaging

## Performance Notes

- Socket.io uses WebSocket for low-latency communication
- Falls back to polling if WebSocket unavailable
- Minimal overhead per connection (~1-2KB)
- Scales well with Socket.io clustering for production
- Consider Redis adapter for multi-server deployments

## Production Deployment

### Recommended Setup
1. Use Redis adapter for Socket.io clustering
2. Enable sticky sessions on load balancer
3. Configure proper CORS origins
4. Use WSS (WebSocket Secure) in production
5. Monitor socket connections and memory usage
6. Set up proper logging and error tracking

### Example with Redis
```javascript
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

const pubClient = createClient({ url: process.env.REDIS_URL })
const subClient = pubClient.duplicate()

await Promise.all([pubClient.connect(), subClient.connect()])

io.adapter(createAdapter(pubClient, subClient))
```
