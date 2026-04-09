# Start Voice Testing - Quick Commands

## Copy & Paste These Commands

### Step 1: Stop Current Frontend (if running)
Press `Ctrl+C` in the terminal where frontend is running

### Step 2: Restart Frontend Server
```bash
cd client
npm run dev
```

**Expected Output**:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 3: Hard Refresh Browser
In your browser, press:
- **Windows**: `Ctrl+Shift+R`
- **Mac**: `Cmd+Shift+R`

### Step 4: Navigate to Interview Page
1. Go to http://localhost:5173/
2. Login as candidate
3. Start an interview

---

## What to Look For

### Hear Question Button (🔊)
1. Click the button
2. **Expected**: You hear the question read aloud
3. **Check Console**: Look for `🔊 Speaking:` message

### Record Answer Button (🎤)
1. Click the button
2. **Expected**: Button turns red, shows "Stop Recording"
3. Speak into microphone
4. **Expected**: Text appears in answer box
5. **Check Console**: Look for `🎤 Speech result received:` message
6. Click "Stop Recording"
7. **Expected**: Button returns to green

---

## Browser Console (F12)

### Open Console
1. Press `F12` to open Developer Tools
2. Click "Console" tab
3. Refresh page with `Ctrl+Shift+R`

### Look for These Messages

**Setup Complete**:
```
✅ Voice recognition setup complete
```

**Hear Question Clicked**:
```
🔊 Speaking: [question text]...
🔊 Speech synthesis started
🔊 Speech synthesis ended
```

**Start Recording Clicked**:
```
🎤 Starting to listen...
✅ Recording started - listening for voice input
```

**Speaking**:
```
🎤 Speech result received: 1 results
  Result 0: "your transcribed text" (isFinal: true)
📝 Updated answer: your transcribed text
```

**Stop Recording Clicked**:
```
⏹️ Recording stopped
```

---

## Troubleshooting Quick Fixes

### No Sound from "Hear Question"
```bash
# 1. Check speakers are connected
# 2. Check volume is not muted
# 3. Hard refresh browser: Ctrl+Shift+R
# 4. Try different browser (Chrome recommended)
```

### No Text from "Record Answer"
```bash
# 1. Check microphone is connected
# 2. Allow microphone permission in browser
# 3. Speak louder and clearer
# 4. Hard refresh browser: Ctrl+Shift+R
# 5. Try different browser (Chrome recommended)
```

### Voice Features Not Available
```bash
# 1. Use Chrome, Edge, or Firefox (not Safari)
# 2. Update browser to latest version
# 3. Try a different device/microphone
```

---

## Browser Requirements

| Browser | Support |
|---------|---------|
| Chrome | ✅ Use this |
| Edge | ✅ Use this |
| Firefox | ✅ Use this |
| Safari | ⚠️ Don't use |

---

## Microphone Permission

### Chrome
1. Click lock icon in address bar
2. Click "Microphone"
3. Select "Allow"

### Firefox
1. Browser will ask for permission
2. Click "Allow"

### Edge
1. Settings → Privacy → Microphone
2. Enable microphone access

---

## If Still Not Working

1. **Check all items above**
2. **Open browser console (F12)**
3. **Look for error messages**
4. **See VOICE_FEATURES_DEBUG_GUIDE.md for detailed help**

---

## Files to Reference

- `VOICE_FEATURES_READY.md` - Quick start
- `VOICE_FEATURES_ACTION_PLAN.md` - Detailed steps
- `VOICE_FEATURES_DEBUG_GUIDE.md` - Troubleshooting
- `VOICE_FEATURES_VISUAL_GUIDE.md` - Visual layout
- `VOICE_FEATURES_IMPROVEMENTS.md` - Technical details

---

## Summary

1. Run: `cd client && npm run dev`
2. Press: `Ctrl+Shift+R` to hard refresh
3. Test: Click voice buttons
4. Check: Browser console for messages
5. Debug: See troubleshooting guides if needed

**Good luck! 🎤🔊**

