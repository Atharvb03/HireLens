# Voice Features Debug Guide - HireLens AI Interview

## What Was Fixed

### 1. **Improved Voice Recognition Setup**
- Added `isListeningRef` to track listening state more reliably
- Better error handling with specific error messages
- Added `voiceSupported` state to disable buttons if voice not available
- Improved console logging for debugging

### 2. **Enhanced Speech Recognition**
- Better error detection for:
  - `no-speech`: No speech detected
  - `network`: Network connectivity issues
  - `not-allowed`: Microphone permission denied
  - Other errors with descriptive messages

### 3. **Improved Text-to-Speech**
- Added language specification (`lang: 'en-US'`)
- Better error handling and logging
- Added audio feedback messages

### 4. **UI Improvements**
- Added warning message if voice not supported
- Disabled voice buttons if not supported
- Better visual feedback during recording/speaking

---

## How to Test Voice Features

### Prerequisites
1. **Browser**: Use Chrome, Edge, or Firefox (Safari has limited support)
2. **Microphone**: Ensure your microphone is connected and working
3. **Permissions**: Allow microphone access when browser asks
4. **Audio**: Ensure speakers/headphones are working

### Step 1: Start the Frontend
```bash
cd client
npm run dev
```

### Step 2: Hard Refresh Browser
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- This clears cache and loads the latest code

### Step 3: Test Text-to-Speech (Hear Question)
1. Navigate to an interview page
2. Click the **🔊 Hear Question** button
3. You should hear the question read aloud
4. Check browser console (F12) for messages like:
   - `🔊 Speaking: [question text]...`
   - `🔊 Speech synthesis started`
   - `🔊 Speech synthesis ended`

### Step 4: Test Speech Recognition (Record Answer)
1. Click the **🎤 Start Recording** button
2. Speak clearly into your microphone
3. You should see:
   - Button changes to red with "⏹️ Stop Recording"
   - Recording status message appears
   - Text appears in the answer box as you speak
4. Click **⏹️ Stop Recording** to stop
5. Check browser console for messages like:
   - `🎤 Starting to listen...`
   - `🎤 Speech result received: X results`
   - `📝 Updated answer: [your transcribed text]`
   - `⏹️ Recording stopped`

---

## Troubleshooting

### Issue: "Hear Question" Button Not Producing Sound

**Check:**
1. Open browser console (F12)
2. Click "Hear Question" button
3. Look for error messages

**Solutions:**
- Check if speakers/headphones are connected
- Ensure volume is not muted
- Try a different browser (Chrome recommended)
- Check if browser has permission to use audio
- Try refreshing the page with Ctrl+Shift+R

### Issue: "Record Answer" Button Not Capturing Voice

**Check:**
1. Open browser console (F12)
2. Click "Start Recording" button
3. Speak and look for console messages

**Solutions:**
- **Microphone not detected**: Check if microphone is connected
- **Permission denied**: 
  - Chrome: Click lock icon in address bar → Microphone → Allow
  - Firefox: Allow when prompted
  - Edge: Check Settings → Privacy → Microphone
- **No speech detected**: Speak louder and clearer
- **Network error**: Check internet connection
- Try a different browser (Chrome recommended)

### Issue: Text Not Appearing While Speaking

**Check:**
1. Open browser console (F12)
2. Look for `🎤 Speech result received` messages
3. Check if `📝 Updated answer` messages appear

**Solutions:**
- Ensure microphone is working (test in system settings)
- Speak clearly and pause between sentences
- Check browser permissions for microphone
- Try refreshing with Ctrl+Shift+R
- Try a different browser

### Issue: Voice Features Not Available

**Message**: "⚠️ Voice features not supported in your browser"

**Solutions:**
- Use Chrome, Edge, or Firefox
- Safari has limited support - use a different browser
- Update your browser to the latest version
- Check if you're using a private/incognito window (may have restrictions)

---

## Browser Console Debugging

### Enable Console Logging
1. Press `F12` to open Developer Tools
2. Go to "Console" tab
3. Refresh the page

### What to Look For

**Successful Setup:**
```
✅ Voice recognition setup complete
```

**Recording Started:**
```
✅ Recording started - listening for voice input
🎤 Starting to listen...
```

**Speech Detected:**
```
🎤 Speech result received: 1 results
  Result 0: "your transcribed text" (isFinal: true)
📝 Updated answer: your transcribed text
```

**Recording Stopped:**
```
⏹️ Recording stopped
```

**Text-to-Speech:**
```
🔊 Speaking: [question text]...
🔊 Speech synthesis started
🔊 Speech synthesis ended
```

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `no-speech` | No speech detected | Speak louder, check microphone |
| `network` | Network error | Check internet connection |
| `not-allowed` | Microphone permission denied | Allow microphone in browser settings |
| `audio-capture` | No microphone available | Connect microphone, check device settings |

---

## Testing Checklist

- [ ] Frontend restarted with `npm run dev`
- [ ] Page hard-refreshed with Ctrl+Shift+R
- [ ] Using Chrome, Edge, or Firefox
- [ ] Microphone is connected and working
- [ ] Microphone permission granted to browser
- [ ] Speakers/headphones are connected
- [ ] Volume is not muted
- [ ] Browser console shows no errors
- [ ] "Hear Question" button produces sound
- [ ] "Record Answer" button captures voice
- [ ] Text appears in answer box while speaking
- [ ] Recording stops when clicking "Stop Recording"

---

## Next Steps

If voice features still don't work:
1. Check all items in the Testing Checklist
2. Try a different browser
3. Try a different device/microphone
4. Check browser console for specific error messages
5. Share the console error messages for further debugging

