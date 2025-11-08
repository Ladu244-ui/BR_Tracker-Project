# Bible Reading Tracker - React Native Navigation Structure

## Navigation Architecture

This app uses **React Navigation** with a combination of **Tab Navigator** and **Stack Navigators**.

## Main Navigation Tree

```
NavigationContainer
└── Bottom Tab Navigator (4 tabs)
    ├── Home Tab
    │   └── Stack Navigator
    │       ├── TodaysScripture (HomeScreen) ← Default
    │       └── ReadingPlan (ReadingPlanScreen)
    │
    ├── Search Tab
    │   └── SearchScreen (No stack, direct screen)
    │
    ├── Log Tab
    │   └── Stack Navigator
    │       └── LogReading (LogReadingScreen) ← Default
    │
    └── Progress Tab
        └── Stack Navigator
            ├── ProgressView (ProgressScreen) ← Default
            └── Calendar (CalendarScreen)
```

## Screen Details

### 1. Home Stack Navigator
**Tab Name:** "Home"
**Tab Icon:** book / book-outline

#### Screens:
- **TodaysScripture** (HomeScreen)
  - Entry point of the app
  - Shows today's scripture readings
  - Quick action buttons to navigate to:
    - ReadingPlan screen
    - Search tab
    - Log tab
    - Progress tab

- **ReadingPlan** (ReadingPlanScreen)
  - Accessible from Home screen
  - Month selector dropdown
  - Displays full monthly scripture schedule

### 2. Search Tab
**Tab Name:** "Search"
**Tab Icon:** search / search-outline

#### Screen:
- **SearchScreen**
  - Direct tab access (no stack)
  - Bible verse search functionality
  - Popular verses quick access
  - API integration

### 3. Log Stack Navigator
**Tab Name:** "Log"
**Tab Icon:** create / create-outline

#### Screens:
- **LogReading** (LogReadingScreen)
  - Input form for logging readings
  - Recent readings list
  - AsyncStorage integration

### 4. Progress Stack Navigator
**Tab Name:** "Progress"
**Tab Icon:** stats-chart / stats-chart-outline

#### Screens:
- **ProgressView** (ProgressScreen)
  - Entry point of Progress tab
  - Statistics and progress bars
  - Quick actions to navigate to Calendar

- **Calendar** (CalendarScreen)
  - Accessible from Progress screen
  - Interactive calendar
  - Reading history visualization

## Navigation Methods

### Tab Navigation
Bottom tabs automatically handle navigation between main sections:
```javascript
navigation.navigate('Home')
navigation.navigate('Search')
navigation.navigate('Log')
navigation.navigate('Progress')
```

### Stack Navigation

#### From HomeScreen to ReadingPlan:
```javascript
navigation.navigate('ReadingPlan')
```

#### From HomeScreen to other tabs:
```javascript
navigation.navigate('Search', { screen: 'Search' })
navigation.navigate('Log', { screen: 'LogReading' })
navigation.navigate('Progress', { screen: 'ProgressView' })
```

#### From ProgressScreen to Calendar:
```javascript
navigation.navigate('Calendar')
```

## Header Configuration

All stack navigators share the same header styling:
- Background Color: `colors.primary` (#2a6ece)
- Text Color: White
- Font Weight: Bold

## Tab Bar Configuration

- Active Color: `colors.primary`
- Inactive Color: Gray
- Height: 60px
- Bottom Padding: 5px
- Icons: Ionicons from `@expo/vector-icons`

## Navigation Props Available in Each Screen

Every screen receives the `navigation` prop with these methods:

- `navigation.navigate(screenName, params?)` - Navigate to a screen
- `navigation.goBack()` - Go back to previous screen
- `navigation.replace(screenName)` - Replace current screen
- `navigation.reset()` - Reset navigation state
- `navigation.setOptions()` - Update screen options

And the `route` prop containing:
- `route.params` - Parameters passed to the screen
- `route.name` - Name of the current route

## Deep Linking Support

The structure supports deep linking for:
- `/home` → Home Tab (TodaysScripture)
- `/reading-plan` → ReadingPlan screen
- `/search` → Search Tab
- `/log` → Log Tab (LogReading)
- `/progress` → Progress Tab (ProgressView)
- `/calendar` → Calendar screen

## Example Navigation Flows

### User Journey 1: View Today's Scripture → View Monthly Plan
1. App opens → HomeScreen (TodaysScripture)
2. User taps "Monthly Plan" button
3. Navigation: `navigation.navigate('ReadingPlan')`
4. User sees ReadingPlanScreen

### User Journey 2: Log Reading → View Progress → Check Calendar
1. User taps "Log" tab → LogReadingScreen
2. User logs a reading
3. User taps "Progress" tab → ProgressScreen
4. User taps "View Calendar" button
5. Navigation: `navigation.navigate('Calendar')`
6. User sees CalendarScreen with marked dates

### User Journey 3: Search Verse → Return Home
1. User taps "Search" tab → SearchScreen
2. User searches for verse
3. User taps "Home" tab → HomeScreen
4. Tab navigation automatically handles return

## State Management

- **Local Component State**: Used in all screens for UI state
- **AsyncStorage**: Used for persisting reading data
  - Progress data (by date)
  - Recent readings list
  - Statistics

## Navigation Best Practices Used

1. ✅ Separate stack navigators for logical grouping
2. ✅ Consistent header styling across stacks
3. ✅ Tab navigator for main app sections
4. ✅ Deep navigation with nested params
5. ✅ Type-safe navigation with screen names
6. ✅ Gesture-enabled navigation
7. ✅ Platform-specific transitions

## Extending Navigation

To add a new screen:

1. Create screen component in `src/screens/`
2. Import in `App.js`
3. Add to appropriate stack:
   ```javascript
   <Stack.Screen 
     name="NewScreen" 
     component={NewScreenComponent}
     options={{ title: 'New Screen' }}
   />
   ```

To add a new tab:
```javascript
<Tab.Screen 
  name="NewTab" 
  component={NewStackNavigator}
  options={{
    tabBarIcon: ({ focused, color, size }) => (
      <Ionicons name={iconName} size={size} color={color} />
    ),
  }}
/>
```
