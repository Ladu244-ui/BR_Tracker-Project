import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ReadingPlanScreen from './src/screens/ReadingPlanScreen';
import SearchScreen from './src/screens/SearchScreen';
import LogReadingScreen from './src/screens/LogReadingScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ProgressScreen from './src/screens/ProgressScreen';

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
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
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
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
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
          backgroundColor: colors.primary,
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

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
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
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
          },
        })}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Log" component={LogStack} />
        <Tab.Screen name="Progress" component={ProgressStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
