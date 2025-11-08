import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@bible_tracker_progress';
const RECENT_READINGS_KEY = '@bible_tracker_recent';

export const storageUtils = {
  // Save reading progress
  saveProgress: async (date, reading) => {
    try {
      const existingData = await AsyncStorage.getItem(PROGRESS_KEY);
      const progress = existingData ? JSON.parse(existingData) : {};
      
      if (!progress[date]) {
        progress[date] = [];
      }
      
      // Avoid duplicates
      if (!progress[date].some(entry => entry.book === reading.book)) {
        progress[date].push(reading);
      }
      
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  },

  // Get all progress
  getProgress: async () => {
    try {
      const data = await AsyncStorage.getItem(PROGRESS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting progress:', error);
      return {};
    }
  },

  // Save recent reading
  saveRecentReading: async (reading) => {
    try {
      const existingData = await AsyncStorage.getItem(RECENT_READINGS_KEY);
      const recent = existingData ? JSON.parse(existingData) : [];
      
      // Add timestamp
      const readingWithTime = {
        ...reading,
        timestamp: new Date().toISOString(),
      };
      
      // Add to beginning and limit to 10 items
      recent.unshift(readingWithTime);
      const limited = recent.slice(0, 10);
      
      await AsyncStorage.setItem(RECENT_READINGS_KEY, JSON.stringify(limited));
      return true;
    } catch (error) {
      console.error('Error saving recent reading:', error);
      return false;
    }
  },

  // Get recent readings
  getRecentReadings: async () => {
    try {
      const data = await AsyncStorage.getItem(RECENT_READINGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting recent readings:', error);
      return [];
    }
  },

  // Calculate reading statistics
  getStatistics: async () => {
    try {
      const progress = await storageUtils.getProgress();
      const dates = Object.keys(progress);
      const totalDays = dates.length;
      const totalReadings = dates.reduce((sum, date) => sum + progress[date].length, 0);
      
      return {
        totalDays,
        totalReadings,
        averagePerDay: totalDays > 0 ? (totalReadings / totalDays).toFixed(1) : 0,
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return { totalDays: 0, totalReadings: 0, averagePerDay: 0 };
    }
  },
};

// Format time ago
export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
