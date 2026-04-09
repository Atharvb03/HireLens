# MongoDB Connection Error - Fix Guide

## Problem
```
❌ MongoDB connection error: Could not connect to any servers in your MongoDB Atlas cluster. 
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

## Solution: Whitelist Your IP in MongoDB Atlas

### Step 1: Go to MongoDB Atlas
1. Open https://www.mongodb.com/cloud/atlas
2. Sign in with your account
3. Click on your cluster (Cluster0)

### Step 2: Access Network Access Settings
1. In the left sidebar, click **"Network Access"** (under Security)
2. You'll see a list of whitelisted IPs

### Step 3: Add Your Current IP
**Option A: Add Your Specific IP (Recommended for Development)**
1. Click **"+ ADD IP ADDRESS"** button
2. Click **"ADD CURRENT IP ADDRESS"**
3. MongoDB will auto-detect your current IP
4. Click **"Confirm"**

**Option B: Allow All IPs (Quick Fix, Less Secure)**
1. Click **"+ ADD IP ADDRESS"** button
2. Enter `0.0.0.0/0` in the IP address field
3. Click **"Confirm"**
⚠️ **Warning**: This allows anyone to connect. Only use for development!

### Step 4: Wait for Changes to Apply
- Changes take 1-2 minutes to apply
- You'll see a green checkmark when ready

### Step 5: Test Connection
Run your server again:
```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
```

## Alternative: Use MongoDB Local

If you continue having issues, use MongoDB locally:

### Install MongoDB Community
1. Download from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service

### Update .env
```
MONGODB_URI=mongodb://localhost:27017/hirelens
```

### Restart Server
```bash
npm run dev
```

## Verify Connection

Check server logs for:
```
✅ MongoDB connected successfully
🚀 Server running on port 5555
```

## Common Issues

### Still Getting Connection Error?
1. **Check username/password**: Verify in .env matches MongoDB Atlas
2. **Check database name**: Should be included in URI
3. **Wait for whitelist**: Changes can take 2-3 minutes
4. **Restart server**: After whitelisting, restart the server
5. **Check cluster status**: Ensure cluster is running (not paused)

### Connection Timeout?
- Increase timeout in MongoDB URI:
```
mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000
```

### Authentication Failed?
- Verify username and password are correct
- Check for special characters (may need URL encoding)
- Reset password in MongoDB Atlas if needed

## MongoDB Atlas IP Whitelist Management

### View Current Whitelist
1. Go to Network Access
2. See all whitelisted IPs and their status

### Remove an IP
1. Click the trash icon next to the IP
2. Confirm deletion

### Edit an IP
1. Click the pencil icon
2. Update the IP address
3. Click "Update"

## For Production

When deploying to production:
1. Whitelist your server's IP address
2. Use environment-specific credentials
3. Enable IP whitelist for security
4. Never use `0.0.0.0/0` in production

## Quick Checklist

- [ ] Logged into MongoDB Atlas
- [ ] Navigated to Network Access
- [ ] Added current IP or `0.0.0.0/0`
- [ ] Waited 1-2 minutes for changes
- [ ] Restarted server
- [ ] See "✅ MongoDB connected successfully" in logs

## Still Not Working?

Try these steps:
1. Clear browser cache
2. Restart your terminal
3. Restart MongoDB Atlas cluster (pause then resume)
4. Check if your ISP is blocking connections
5. Try from a different network (mobile hotspot)

## Support

If you continue having issues:
1. Check MongoDB Atlas status: https://status.mongodb.com
2. Review MongoDB documentation: https://www.mongodb.com/docs/atlas/
3. Check server logs for detailed error messages
