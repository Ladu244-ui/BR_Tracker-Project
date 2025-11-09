import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const API_URL = 'https://ayabackgroundservices-production-8b01.up.railway.app'; // Replace with your server URL

class BibleAPIService {
  constructor() {
    this.userId = null;
    this.init();
  }

  async init() {
    this.userId = await this.getUserId();
  }

  async getUserId() {
    let userId = await AsyncStorage.getItem('bible_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('bible_user_id', userId);
    }
    return userId;
  }

  // ==================== Reading Progress ====================

  async saveReadingProgress(date, scriptureReference) {
    try {
      const userId = await this.getUserId();
      const response = await fetch(`${API_URL}/bible/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date,
          scriptureReference
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving reading progress:', error);
      return { success: false, error: error.message };
    }
  }

  async getReadingProgress(startDate, endDate) {
    try {
      const userId = await this.getUserId();
      let url = `${API_URL}/bible/progress/${userId}`;
      
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reading progress:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async checkTodayReading() {
    try {
      const userId = await this.getUserId();
      const response = await fetch(`${API_URL}/bible/check-today/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking today reading:', error);
      return { success: false, hasRead: false };
    }
  }

  async getReadingStreak() {
    try {
      const userId = await this.getUserId();
      const response = await fetch(`${API_URL}/bible/streak/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reading streak:', error);
      return { success: true, streak: 0 };
    }
  }

  // ==================== Push Notifications ====================

  async registerForPushNotifications() {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission not granted for push notifications');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await this.savePushToken(token);

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  async savePushToken(token) {
    try {
      const userId = await this.getUserId();
      const platform = Platform.OS;

      const response = await fetch(`${API_URL}/bible/save-push-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          token,
          platform
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving push token:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== Reminder Settings ====================

  async updateReminderSettings(settings) {
    try {
      const userId = await this.getUserId();
      const response = await fetch(`${API_URL}/bible/reminder-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...settings
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating reminder settings:', error);
      return { success: false, error: error.message };
    }
  }

  async getReminderSettings() {
    try {
      const userId = await this.getUserId();
      const response = await fetch(`${API_URL}/bible/reminder-settings/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reminder settings:', error);
      return {
        success: true,
        data: {
          reminder_enabled: true,
          reminder_time: '08:00:00',
          timezone: 'UTC'
        }
      };
    }
  }

  // ==================== Testing ====================

  async triggerTestReminder() {
    try {
      const response = await fetch(`${API_URL}/bible/trigger-reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error triggering test reminder:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new BibleAPIService();
