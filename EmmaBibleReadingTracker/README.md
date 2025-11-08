# Emma Bible Reading Tracker - React Native

A beautiful and functional Bible reading tracker app built with React Native and Expo. Track your daily scripture reading, search the Bible, and monitor your progress throughout the year.

## Features

✨ **Today's Scripture** - View daily scripture readings
� **Monthly Reading Plan** - Access full monthly reading schedules
🔍 **Bible Search** - Search for any verse or passage using the Bible API
📝 **Log Readings** - Track your daily Bible reading progress
📊 **Progress Dashboard** - Visualize your reading statistics and milestones
📆 **Calendar View** - See your reading history on an interactive calendar

## Tech Stack

- **React Native** with **Expo**
- **React Navigation** (Tab & Stack navigators)
- **AsyncStorage** for local data persistence
- **React Native Calendars** for calendar visualization
- **Bible API** integration for verse search
- **Expo Linear Gradient** for beautiful UI effects

## Project Structure

```
EmmaBibleReadingTracker/
├── App.js                      # Main app entry with navigation
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js       # Today's scripture & quick actions
│   │   ├── ReadingPlanScreen.js # Monthly reading schedules
│   │   ├── SearchScreen.js     # Bible verse search
│   │   ├── LogReadingScreen.js # Log reading progress
│   │   ├── CalendarScreen.js   # Calendar with reading history
│   │   └── ProgressScreen.js   # Statistics & progress tracking
│   ├── data/
│   │   └── scriptures.js       # Scripture reading data
│   ├── utils/
│   │   └── storage.js          # AsyncStorage utilities
│   └── theme.js                # App-wide theme & styles
├── package.json
└── README.md
```

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Run on your device
   - **iOS**: Press `i` for iOS simulator (Mac only)
   - **Android**: Press `a` for Android emulator
   - **Physical Device**: Scan QR code with Expo Go app

## Key Dependencies

```json
{
  "@react-navigation/native": "Navigation framework",
  "@react-navigation/bottom-tabs": "Bottom tab navigation",
  "@react-navigation/stack": "Stack navigation",
  "@react-native-async-storage/async-storage": "Local storage",
  "react-native-calendars": "Calendar component",
  "@react-native-picker/picker": "Month picker",
  "expo-linear-gradient": "Gradient backgrounds",
  "axios": "HTTP requests for Bible API"
}
```

## Usage Guide

### 1. Home Screen
- View today's assigned scriptures
- Quick access buttons to all features
- Inspirational verse at the bottom

### 2. Monthly Reading Plan
- Select any month from the dropdown
- View the complete reading schedule
- See all daily scripture assignments

### 3. Search
- Search for any Bible verse (e.g., "John 3:16")
- Popular verses quick access
- Powered by bible-api.com

### 4. Log Reading
- Enter scripture reference you've read
- Automatically saves with timestamp
- View recent reading history

### 5. Progress Dashboard
- Visual progress bar
- Statistics (total days, readings, average)
- Motivational messages
- Next milestone tracker

### 6. Calendar
- Interactive calendar view
- Marked dates show reading activity
- Tap any date to see readings
- Monthly statistics

## Customization

### Adding More Scripture Data

Edit `src/data/scriptures.js` and add more months following the existing format from your original `scriptures.js` file.

### Changing Theme Colors

Edit `src/theme.js`:

```javascript
export const colors = {
  primary: '#2a6ece',  // Main brand color
  secondary: '#7c97f1', // Secondary color
  // ... customize other colors
};
```

## API Integration

The app uses the free Bible API (https://bible-api.com) for verse search. No API key required.

## Data Storage

All reading progress is stored locally using AsyncStorage:
- Reading history by date
- Recent readings list
- Statistics calculations

Data persists across app restarts.

## Troubleshooting

### Calendar not showing marked dates
Make sure you've logged at least one reading.

### Search not working
Check your internet connection.

### App won't start
Try clearing the cache:
```bash
npx expo start -c
```

## Learn more

To learn more about developing React Native apps with Expo:
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
