# Voice Features - Visual Guide

## Interview Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Interview                             │
│                  Question 1 of 10                            │
│                    Progress: 10%                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TECHNICAL QUESTION                                         │
│  "Explain the difference between let and const in JS"       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 🔊 Hear Question  │  🎤 ▶️ Start Recording          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  🔴 Recording in progress...                                │
│  Speak clearly. Your words will appear below.               │
│                                                              │
│  Your Answer                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Let is block-scoped while const is also block-scoped │   │
│  │ but cannot be reassigned. Let can be reassigned...   │   │
│  │                                                      │   │
│  │                                                      │   │
│  │                                                      │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  145 characters                                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next Question                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Button States

### Hear Question Button (🔊)

#### Before Click
```
┌─────────────────────────┐
│ 🔊 Hear Question        │
└─────────────────────────┘
```

#### During Click (Speaking)
```
┌─────────────────────────┐
│ 🔊 Speaking...          │
└─────────────────────────┘
```

#### After Click
```
┌─────────────────────────┐
│ 🔊 Hear Question        │
└─────────────────────────┘
```

---

### Record Answer Button (🎤)

#### Before Click (Not Recording)
```
┌─────────────────────────┐
│ 🎤 ▶️ Start Recording    │  (Green)
└─────────────────────────┘
```

#### During Click (Recording)
```
┌─────────────────────────┐
│ 🎤 ⏹️ Stop Recording     │  (Red, Pulsing)
└─────────────────────────┘
```

#### After Click (Stopped)
```
┌─────────────────────────┐
│ 🎤 ▶️ Start Recording    │  (Green)
└─────────────────────────┘
```

---

## Recording Status Indicator

### When Recording
```
┌──────────────────────────────────────────────────┐
│ 🔴 Recording in progress...                      │
│ Speak clearly. Your words will appear below.     │
└──────────────────────────────────────────────────┘
```

### When Not Recording
```
(No indicator shown)
```

---

## Answer Box

### Before Speaking
```
┌──────────────────────────────────────────────────┐
│ Your Answer                                      │
│ ┌────────────────────────────────────────────┐   │
│ │ (empty)                                    │   │
│ │                                            │   │
│ │                                            │   │
│ │                                            │   │
│ │                                            │   │
│ │                                            │   │
│ └────────────────────────────────────────────┘   │
│ 0 characters                                     │
└──────────────────────────────────────────────────┘
```

### While Speaking
```
┌──────────────────────────────────────────────────┐
│ Your Answer 🔴 Recording...                      │
│ ┌────────────────────────────────────────────┐   │
│ │ Let is block-scoped while const is also    │   │
│ │ block-scoped but cannot be reassigned      │   │
│ │                                            │   │
│ │                                            │   │
│ │                                            │   │
│ │                                            │   │
│ └────────────────────────────────────────────┘   │
│ 85 characters                                    │
└──────────────────────────────────────────────────┘
```

### After Speaking
```
┌──────────────────────────────────────────────────┐
│ Your Answer                                      │
│ ┌────────────────────────────────────────────┐   │
│ │ Let is block-scoped while const is also    │   │
│ │ block-scoped but cannot be reassigned      │   │
│ │ Let can be reassigned multiple times       │   │
│ │                                            │   │
│ │                                            │   │
│ │                                            │   │
│ └────────────────────────────────────────────┘   │
│ 145 characters                                   │
└──────────────────────────────────────────────────┘
```

---

## Voice Not Supported Warning

```
┌──────────────────────────────────────────────────┐
│ ⚠️ Voice features not supported in your browser. │
│ Please use Chrome, Edge, or Firefox.             │
└──────────────────────────────────────────────────┘
```

---

## User Workflow

### Step 1: Read Question
```
User sees question on screen
```

### Step 2: Click "Hear Question"
```
User clicks 🔊 Hear Question button
         ↓
Browser reads question aloud
         ↓
Button shows "Speaking..." while audio plays
         ↓
Button returns to "Hear Question" when done
```

### Step 3: Click "Start Recording"
```
User clicks 🎤 Start Recording button
         ↓
Button turns red and shows "Stop Recording"
         ↓
Recording status message appears
         ↓
User speaks into microphone
         ↓
Text appears in answer box in real-time
         ↓
Character count updates
```

### Step 4: Click "Stop Recording"
```
User clicks 🎤 Stop Recording button
         ↓
Recording stops
         ↓
Button returns to green "Start Recording"
         ↓
Recording status message disappears
         ↓
Text remains in answer box
```

### Step 5: Submit Answer
```
User clicks "Next Question" button
         ↓
Answer is submitted for evaluation
         ↓
Move to next question
         ↓
Repeat steps 1-5
```

---

## Browser Console Output

### Successful Setup
```
✅ Voice recognition setup complete
```

### Hear Question Clicked
```
🔊 Speaking: Explain the difference between let and const in JS...
🔊 Speech synthesis started
🔊 Speech synthesis ended
```

### Start Recording Clicked
```
🎤 Starting to listen...
✅ Recording started - listening for voice input
```

### Speaking
```
🎤 Speech result received: 1 results
  Result 0: "Let is block-scoped" (isFinal: false)
📝 Updated answer: Let is block-scoped

🎤 Speech result received: 2 results
  Result 1: "while const is also block-scoped" (isFinal: true)
📝 Updated answer: Let is block-scoped while const is also block-scoped
```

### Stop Recording Clicked
```
⏹️ Recording stopped
```

---

## Error Messages

### Microphone Permission Denied
```
❌ Speech recognition error: not-allowed
Microphone permission denied. Please allow microphone access in browser settings.
```

### No Microphone Detected
```
❌ Speech recognition error: audio-capture
No microphone available. Please connect a microphone.
```

### Network Error
```
❌ Speech recognition error: network
Network error. Please check your internet connection.
```

### No Speech Detected
```
❌ Speech recognition error: no-speech
No speech detected. Please try again.
```

### Voice Not Supported
```
⚠️ Speech Recognition not supported in this browser
```

---

## Color Coding

| Color | Meaning | Example |
|-------|---------|---------|
| 🟢 Green | Ready to record | Start Recording button |
| 🔴 Red | Recording in progress | Stop Recording button |
| 🟡 Yellow | Warning | Voice not supported message |
| 🔵 Blue | Information | Question text, progress |
| 🟣 Purple | Audio | Hear Question button |

---

## Accessibility Features

- Clear button labels with emojis
- Recording status indicator
- Character count display
- Real-time text feedback
- Error messages with solutions
- Console logging for debugging
- Disabled buttons when not available

