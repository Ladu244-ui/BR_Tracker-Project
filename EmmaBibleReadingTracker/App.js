import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ReadingPlanScreen from './src/screens/ReadingPlanScreen';
import SearchScreen from './src/screens/SearchScreen';
import LogReadingScreen from './src/screens/LogReadingScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import DebugScreen from './src/screens/DebugScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import services
import notificationService from './src/services/notificationService';

// Import theme
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigator for Home and related screens
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTransparent: false,
      }}>
      <Stack.Screen 
        name="TodaysScripture" 
        component={HomeScreen}
        options={{ title: "Today's Scripture" }}
      />
      <Stack.Screen 
        name="ReadingPlan" 
        component={ReadingPlanScreen}
        options={{ title: 'Monthly Reading Plan' }}
      />
    </Stack.Navigator>
  );
}

// Stack navigator for Log Reading and related screens
function LogStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTransparent: false,
      }}>
      <Stack.Screen 
        name="LogReading" 
        component={LogReadingScreen}
        options={{ title: 'Log Reading' }}
      />
    </Stack.Navigator>
  );
}

// Stack navigator for Progress screens
function ProgressStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="ProgressView" 
        component={ProgressScreen}
        options={{ title: 'Reading Progress' }}
      />
      <Stack.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{ title: 'Reading Calendar' }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Log') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Debug') {
            iconName = focused ? 'bug' : 'bug-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderTopColor: 'rgba(139, 92, 246, 0.3)',
          borderTopWidth: 1,
          paddingBottom: insets.bottom,
          height: 50 + insets.bottom,
        },
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Log" component={LogStack} />
      <Tab.Screen name="Progress" component={ProgressStack} />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Tab.Screen name="Debug" component={DebugScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize push notifications on app start
    notificationService.initialize();

    // Cleanup on unmount
    return () => {
      notificationService.cleanup();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
