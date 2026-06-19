# Real-Time Notification System - Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CANDIDATE SIDE                               │
└─────────────────────────────────────────────────────────────────────┘

    [Candidate Dashboard]
            │
            │ 1. Completes AI Interview
            ↓
    [Interview Page]
            │
            │ 2. Submits Final Answers
            ↓
    POST /api/interview-session/:sessionId/complete
            │
            │ 3. Calculates Score
            ↓
    POST /api/ai-interview/update-score
            │
            ├─→ 4. Updates Interview Score in DB
            │
            ├─→ 5. Auto-determines Status (hired/rejected)
            │       • Score >= 70% → hired
            │       • Score < 70% → rejected
            │
            ├─→ 6. Calculates Combined Score
            │       • 40% Match Score + 60% Interview Score
            │
            ├─→ 7. Re-ranks All Candidates for Job
            │
            └─→ 8. Emits Socket.io Event
                    │
                    ↓

┌─────────────────────────────────────────────────────────────────────┐
│                         SOCKET.IO SERVER                             │
└─────────────────────────────────────────────────────────────────────┘

    [Socket.io Server]
            │
            │ Event: 'interview-completed'
            │ Room: 'recruiters'
            │
            │ Payload:
            │ {
            │   type: 'interview_completed',
            │   timestamp: Date,
            │   data: {
            │     candidateId, candidateName, candidateEmail,
            │     jobId, jobTitle,
            │     interviewScore, combinedScore, matchScore,
            │     status
            │   }
            │ }
            │
            ↓
    [Broadcast to All Recruiters in Room]
            │
            ↓

┌─────────────────────────────────────────────────────────────────────┐
│                         RECRUITER SIDE                               │
└─────────────────────────────────────────────────────────────────────┘

    [Recruiter Dashboard]
            │
            │ 9. Receives Socket Event
            ↓
    [Socket Event Handler]
            │
            ├─→ 10a. Updates Notification State
            │        • Adds to notification list
            │        • Shows badge counter
            │
            ├─→ 10b. Shows Toast Notification
            │        • Slide-in animation
            │        • Color-coded by status
            │        • Auto-dismiss after 5s
            │
            ├─→ 10c. Shows Browser Notification
            │        • Native OS notification
            │        • Requires permission
            │        • Works when tab inactive
            │
            └─→ 10d. Auto-refreshes Candidate List
                     • Fetches latest data
                     • Shows updated scores
                     • Shows new rankings
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                           CLIENT SIDE                                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        App.jsx                               │   │
│  │  ┌────────────────────────────────────────────────────┐     │   │
│  │  │              SocketProvider                         │     │   │
│  │  │  • Manages socket connection                        │     │   │
│  │  │  • Provides socket instance to children             │     │   │
│  │  │  • Handles reconnection logic                       │     │   │
│  │  └────────────────────────────────────────────────────┘     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              │ useSocket()                           │
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              RecruiterDashboard.jsx                          │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────┐       │   │
│  │  │  useEffect(() => {                                │       │   │
│  │  │    socket.emit('join-recruiter-room')             │       │   │
│  │  │    socket.on('interview-completed', handler)      │       │   │
│  │  │  })                                               │       │   │
│  │  └──────────────────────────────────────────────────┘       │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────┐       │   │
│  │  │  Notification Bell                                │       │   │
│  │  │  • Badge counter                                  │       │   │
│  │  │  • Dropdown panel                                 │       │   │
│  │  │  • Notification history                           │       │   │
│  │  └──────────────────────────────────────────────────┘       │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────┐       │   │
│  │  │  Toast Component                                  │       │   │
│  │  │  • Slide-in animation                             │       │   │
│  │  │  • Auto-dismiss                                   │       │   │
│  │  │  • Color-coded                                    │       │   │
│  │  └──────────────────────────────────────────────────┘       │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────┐       │   │
│  │  │  Connection Status                                │       │   │
│  │  │  • Green: Connected                               │       │   │
│  │  │  • Red: Disconnected                              │       │   │
│  │  └──────────────────────────────────────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
                              ↕
                    WebSocket Connection
                              ↕
┌──────────────────────────────────────────────────────────────────────┐
│                           SERVER SIDE                                 │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      server.js                               │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────┐       │   │
│  │  │  Socket.io Server                                 │       │   │
│  │  │  • HTTP server wrapper                            │       │   │
│  │  │  • CORS configuration                             │       │   │
│  │  │  • Connection handling                            │       │   │
│  │  │  • Room management                                │       │   │
│  │  └──────────────────────────────────────────────────┘       │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────┐       │   │
│  │  │  io.on('connection', (socket) => {                │       │   │
│  │  │    socket.on('join-recruiter-room', ...)          │       │   │
│  │  │  })                                               │       │   │
│  │  └──────────────────────────────────────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│                              │ app.set('io', io)                     │
│                              ↓                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              routes/aiInterview.js                           │   │
│  │                                                               │   │
│  │  ┌──────────────────────────────────────────────────┐       │   │
│  │  │  POST /api/ai-interview/update-score             │       │   │
│  │  │                                                   │       │   │
│  │  │  1. Update interview score                       │       │   │
│  │  │  2. Auto-determine status                        │       │   │
│  │  │  3. Calculate combined score                     │       │   │
│  │  │  4. Re-rank candidates                           │       │   │
│  │  │  5. Get io instance: req.app.get('io')           │       │   │
│  │  │  6. Emit event: io.to('recruiters').emit(...)    │       │   │
│  │  └──────────────────────────────────────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Notification Types Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION CHANNELS                         │
└─────────────────────────────────────────────────────────────────┘

1. IN-APP NOTIFICATION BELL
   ┌──────────────────────────────────────┐
   │  🔔 [3]  ← Badge Counter             │
   │                                       │
   │  ┌─────────────────────────────────┐ │
   │  │  Notifications                   │ │
   │  ├─────────────────────────────────┤ │
   │  │  🎯 Interview Completed          │ │
   │  │  John Doe completed interview    │ │
   │  │  for Senior Developer            │ │
   │  │  [Score: 85%] [Combined: 82%]   │ │
   │  │  [hired]                         │ │
   │  │  2 minutes ago                   │ │
   │  ├─────────────────────────────────┤ │
   │  │  🎯 Interview Completed          │ │
   │  │  Jane Smith completed interview  │ │
   │  │  for Frontend Developer          │ │
   │  │  [Score: 65%] [Combined: 68%]   │ │
   │  │  [rejected]                      │ │
   │  │  5 minutes ago                   │ │
   │  └─────────────────────────────────┘ │
   └──────────────────────────────────────┘

2. TOAST NOTIFICATION
   ┌──────────────────────────────────────┐
   │  ✓  Interview Completed!             │
   │     John Doe scored 85% for          │
   │     Senior Developer                 │
   │                                  [×] │
   └──────────────────────────────────────┘
   ↑ Slides in from right, auto-dismiss

3. BROWSER NOTIFICATION
   ┌──────────────────────────────────────┐
   │  HireLens                        [×] │
   │  Interview Completed                 │
   │  John Doe completed interview for    │
   │  Senior Developer. Score: 85%        │
   └──────────────────────────────────────┘
   ↑ Native OS notification

4. CONNECTION STATUS
   ┌──────────────────────────────────────┐
   │  Header:  [●] Live    [Logout]       │
   │           ↑ Green = Connected        │
   │           ↑ Red = Disconnected       │
   └──────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT STATE FLOW                              │
└─────────────────────────────────────────────────────────────────┘

Socket Event Received
        ↓
┌───────────────────────────────────────┐
│  socket.on('interview-completed')     │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│  setNotifications(prev => [           │
│    notification, ...prev              │
│  ])                                   │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│  setToastNotification({               │
│    title: '...',                      │
│    body: '...',                       │
│    type: 'success' | 'error'          │
│  })                                   │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│  fetchCandidates()                    │
│  • Refreshes candidate list           │
│  • Shows updated scores               │
│  • Shows new rankings                 │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│  new Notification(...)                │
│  • Browser notification               │
│  • Requires permission                │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│  UI Re-renders                        │
│  • Notification bell badge updates    │
│  • Toast appears                      │
│  • Candidate list refreshes           │
└───────────────────────────────────────┘
```

## Error Handling & Reconnection

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONNECTION LIFECYCLE                          │
└─────────────────────────────────────────────────────────────────┘

Initial Connection
        ↓
┌───────────────────────────────────────┐
│  socket.on('connect')                 │
│  • Set connected = true               │
│  • Join recruiter room                │
│  • Show green indicator               │
└───────────────────────────────────────┘
        ↓
    Connected
        ↓
┌───────────────────────────────────────┐
│  socket.on('disconnect')              │
│  • Set connected = false              │
│  • Show red indicator                 │
│  • Auto-reconnect starts              │
└───────────────────────────────────────┘
        ↓
    Disconnected
        ↓
┌───────────────────────────────────────┐
│  Auto-Reconnection                    │
│  • Attempt 1 (1s delay)               │
│  • Attempt 2 (1s delay)               │
│  • Attempt 3 (1s delay)               │
│  • Attempt 4 (1s delay)               │
│  • Attempt 5 (1s delay)               │
└───────────────────────────────────────┘
        ↓
    Reconnected
        ↓
┌───────────────────────────────────────┐
│  socket.on('connect')                 │
│  • Set connected = true               │
│  • Re-join recruiter room             │
│  • Show green indicator               │
└───────────────────────────────────────┘
```

## Data Flow Summary

```
Candidate → Interview → Score → Status → Combined Score → Ranking
                                                              ↓
                                                    Socket.io Event
                                                              ↓
                                                    Recruiter Dashboard
                                                              ↓
                                    ┌─────────────────────────┴─────────────────────────┐
                                    ↓                         ↓                         ↓
                            Notification Bell          Toast Notification      Browser Notification
                                    ↓                         ↓                         ↓
                            Badge Counter              Auto-dismiss              Native OS Alert
                            Dropdown Panel             Slide-in Animation        Works when inactive
                            History View               Color-coded               Requires permission
```

This visual representation helps understand how all components work together to deliver real-time notifications to recruiters!
