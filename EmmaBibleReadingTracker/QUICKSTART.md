# Quick Start Guide

## Installation Steps

1. **Navigate to the project folder:**
   ```bash
   cd EmmaBibleReadingTracker
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   npx expo start
   ```

4. **Run the app:**
   - Press `i` for iOS simulator (Mac only)
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Navigation Structure

The app uses **Bottom Tab Navigation** with 4 main tabs:

1. **Home** 🏠
   - Today's Scripture
   - Quick action buttons
   - Navigation to Monthly Reading Plan

2. **Search** 🔍
   - Bible verse search
   - Popular verses quick access

3. **Log** ✍️
   - Log your daily reading
   - View recent readings

4. **Progress** 📊
   - View statistics
   - Navigate to Calendar view
   - Track milestones

## Features Overview

### Home Screen
- Displays today's scripture readings based on the date
- Quick navigation buttons to all major features
- Beautiful gradient background with glass-morphism cards

### Reading Plan Screen
- Month selector (Picker component)
- Displays full monthly reading schedule
- Each day shows multiple scripture references

### Search Screen
- Text input for verse lookup
- Bible API integration
- Results display with verse text and translation info
- Quick access to popular verses

### Log Reading Screen
- Input field for scripture reference
- Hint popup with examples
- Recent readings list with timestamps
- Data saved to AsyncStorage

### Calendar Screen
- Interactive calendar with marked reading dates
- Tap dates to view readings for that day
- Monthly statistics display
- Visual progress indicators

### Progress Screen
- Progress bar showing yearly completion
- Statistics cards (total days, readings, average)
- Quick action buttons
- Next milestone tracker

## File Structure

```
src/
├── screens/          # All screen components
├── data/            # Scripture data
├── utils/           # Storage utilities
└── theme.js         # Theme configuration
```

## Important Notes

1. **Scripture Data**: Currently includes January and February. Add more months in `src/data/scriptures.js`

2. **Storage**: Uses AsyncStorage for local persistence. Data remains even after app restarts.

3. **API**: Bible search uses https://bible-api.com (free, no key required)

4. **Styling**: Consistent theme using colors, spacing, and typography from `theme.js`

## Next Steps

1. Copy all scripture data from your original `scriptures.js` to `src/data/scriptures.js`
2. Customize colors in `src/theme.js` if desired
3. Test all features
4. Build for production when ready

## Common Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Install new package
npm install package-name
```

## Need Help?

- Check the main README.md for detailed documentation
- Review React Navigation docs: https://reactnavigation.org
- Expo documentation: https://docs.expo.dev
