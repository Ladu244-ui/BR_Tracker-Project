// Add this to any screen to quickly check data in console
import AsyncStorage from '@react-native-async-storage/async-storage';

// Check all keys
const checkStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log('All keys:', keys);
  
  const items = await AsyncStorage.multiGet(keys);
  items.forEach(([key, value]) => {
    console.log(`${key}:`, JSON.parse(value));
  });
};

// Check specific key
const checkProgress = async () => {
  const progress = await AsyncStorage.getItem('reading_progress');
  console.log('Progress:', JSON.parse(progress));
};

// Usage: Add button in your app
// <TouchableOpacity onPress={checkStorage}>
//   <Text>Check Storage</Text>
// </TouchableOpacity>
