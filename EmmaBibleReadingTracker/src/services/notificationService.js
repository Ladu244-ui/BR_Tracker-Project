import * as Notifications from 'expo-notifications';
import bibleAPI from './bibleAPI';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  async initialize() {
    // Register for push notifications
    const token = await bibleAPI.registerForPushNotifications();
    
    if (token) {
      console.log('Push notification token registered:', token);
    }

    // Listen for notifications received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for user interaction with notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      this.handleNotificationResponse(response);
    });
  }

  handleNotificationResponse(response) {
    const data = response.notification.request.content.data;
    
    // Handle different notification types
    if (data.type === 'daily_scripture_reminder') {
      // Navigate to today's scripture or log reading screen
      // You can use navigation here if you pass it to this service
      console.log('User tapped daily scripture reminder');
    }
  }

  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // For testing: send a local notification
  async sendTestNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📖 Daily Scripture Reminder",
        body: "Don't forget to read today's scripture!",
        data: { type: 'daily_scripture_reminder' },
      },
      trigger: { seconds: 2 },
    });
  }
}

export default new NotificationService();
