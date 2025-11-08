# Starry Background Setup

## To add the starry night background image:

1. **Save the starry night image** you provided to:
   ```
   assets/images/starry-background.jpg
   ```

2. **Or use a URL-based image** by modifying HomeScreen.js:
   ```javascript
   <ImageBackground
     source={{ uri: 'YOUR_IMAGE_URL_HERE' }}
     style={styles.container}
     resizeMode="cover">
   ```

3. **Image requirements:**
   - Format: JPG, PNG, or WebP
   - Recommended size: 1080x1920px or higher
   - Dark starry night theme for best glass-morphism effect

## The app now features:
- ✨ Glass-morphism containers with transparency
- 🌌 Starry night background
- 💫 Futuristic glowing effects
- 🎨 Purple/cyan color scheme
- 🔮 Semi-transparent cards with borders

## All screens will inherit the futuristic theme!
