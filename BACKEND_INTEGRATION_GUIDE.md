# Backend Integration Setup Guide

## Overview
This guide will help you complete the integration of daily scripture reminders with Supabase backend and push notifications.

## ✅ Completed Steps

### 1. Supabase Schema ✓
- Created `supabase_schema.sql` with 4 tables
- Added RLS policies for security
- Created helper functions

### 2. Backend API ✓
- Added 8 REST endpoints to `server.js`
- Implemented daily reminder cron job (8 AM)
- Integrated expo-server-sdk for push notifications

### 3. React Native Services ✓
- Created `bibleAPI.js` service for backend communication
- Created `notificationService.js` for push notification management
- Updated `LogReadingScreen.js` to sync progress to backend
- Created `SettingsScreen.js` for reminder preferences
- Added Settings tab to navigation

## 🔧 Setup Instructions

### Step 1: Install Missing Dependencies

The following package needs to be installed:

```bash
cd EmmaBibleReadingTracker
npx expo install @react-native-community/datetimepicker
```

### Step 2: Deploy Supabase Schema

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file `supabase_schema.sql` from your project root
4. Copy and paste the entire SQL script
5. Click **Run** to execute
6. Verify tables were created in **Table Editor**

### Step 3: Configure Backend Server

1. Install backend dependencies:
```bash
cd backend  # Navigate to your backend folder
npm install expo-server-sdk node-cron
```

2. Update `server.js` environment variables:
```javascript
// Add these to your .env file
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

3. Start your backend server:
```bash
node server.js
```

### Step 4: Configure API URL in React Native

Open `src/services/bibleAPI.js` and update line 6:

```javascript
const API_URL = 'http://YOUR_SERVER_IP:3001';
```

Replace with:
- **Development (same network)**: `http://192.168.x.x:3001` (your computer's local IP)
- **Production**: `https://your-backend-domain.com`

To find your local IP:
- **Windows**: Run `ipconfig` in CMD
- **Mac/Linux**: Run `ifconfig` or `ip addr`

### Step 5: Test the Integration

1. **Start Expo app**:
```bash
cd EmmaBibleReadingTracker
npm start
```

2. **Test reading sync**:
   - Open the **Log** tab
   - Log a reading (e.g., "John 3:16")
   - Check backend console for sync confirmation

3. **Test notifications**:
   - Open the **Settings** tab
   - Enable "Daily Reminders"
   - Set reminder time
   - Tap "Send Test Notification"
   - You should receive a notification in 2 seconds

4. **Check backend data**:
   - Go to Supabase dashboard → **Table Editor**
   - Check `bible_reading_progress` for your logged reading
   - Check `bible_push_tokens` for your device token
   - Check `bible_reminder_settings` for your preferences

### Step 6: Test Daily Reminder Flow

1. **Manual trigger** (for testing without waiting):
```bash
# Send POST request to backend
curl -X POST http://localhost:3001/bible/trigger-reminders
```

2. **Check cron job**:
   - Wait until 8:00 AM (or modify cron schedule in server.js for testing)
   - Backend will check if you've read today's scripture
   - If not, you'll receive a push notification

3. **Verify cron schedule**:
```javascript
// In server.js, find this line:
cron.schedule('0 8 * * *', () => { ... });

// For testing, change to run every minute:
cron.schedule('* * * * *', () => { ... });
```

## 📱 App Features

### Settings Screen
- **Daily Reminders**: Toggle on/off
- **Reminder Time**: Pick your preferred time
- **Test Notification**: Send test notification
- **Stats**: View reading streak and today's status

### Auto-Sync
- All readings logged in the **Log** tab are automatically synced to Supabase
- Local AsyncStorage backup for offline use
- Backend tracks progress and calculates streaks

### Smart Reminders
- Reminders only sent if you haven't read today's scripture
- Check happens at your chosen reminder time (default 8 AM)
- No spam if you've already completed your reading

## 🔍 Troubleshooting

### Notifications Not Received
1. Check device notification permissions (Settings → App → Notifications)
2. Ensure app is registered for push notifications (check `bible_push_tokens` table)
3. Verify backend is running and accessible
4. Check backend console for error logs

### API Connection Failed
1. Verify `API_URL` in `bibleAPI.js` is correct
2. Ensure backend server is running on port 3001
3. Check firewall settings (allow port 3001)
4. For physical device, ensure same WiFi network as backend

### Supabase Errors
1. Verify RLS policies are enabled
2. Check service role key has proper permissions
3. Ensure tables were created successfully
4. Check Supabase logs in dashboard

### Time Picker Not Showing (iOS)
- Time picker is already configured for iOS spinner mode
- On Android, it shows native time picker dialog

## 🎯 Next Steps

1. **Deploy Backend**: Move server to production (Heroku, Railway, DigitalOcean)
2. **Environment Variables**: Use proper .env for production API URL
3. **Analytics**: Track user engagement and streak milestones
4. **Push Notification Badges**: Add badge count for unread scriptures
5. **Offline Sync**: Queue API calls when offline, sync when back online

## 📊 API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/bible/progress` | POST | Save reading completion |
| `/bible/progress/:userId` | GET | Fetch reading history |
| `/bible/check-today/:userId` | GET | Check today's reading status |
| `/bible/streak/:userId` | GET | Get consecutive reading days |
| `/bible/save-push-token` | POST | Register device for notifications |
| `/bible/reminder-settings` | POST | Configure reminder preferences |
| `/bible/reminder-settings/:userId` | GET | Fetch user preferences |
| `/bible/trigger-reminders` | POST | Manual reminder trigger (testing) |

## 🚀 Architecture

```
┌─────────────────┐
│  React Native   │
│   Expo App      │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐      ┌─────────────────┐
│   Node.js       │──────│   Supabase      │
│   Express       │      │   PostgreSQL    │
│   Backend       │      └─────────────────┘
└────────┬────────┘
         │
         │ Cron Job (8 AM)
         ▼
┌─────────────────┐
│  Expo Push      │
│  Notifications  │
└─────────────────┘
```

## 🎨 UI Updates

- **New Tab**: Settings (gear icon) between Progress and Debug
- **Settings Screen**: Dark glass theme matching app design
- **Streak Display**: Flame icon with consecutive days count
- **Today's Status**: Checkmark if read, circle if not
- **Time Picker**: Native iOS spinner, Android dialog

---

**Need Help?** Check the backend console logs and Supabase logs for detailed error messages.
