const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const { Expo } = require('expo-server-sdk');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const expo = new Expo();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// ==================== BACKGROUND SERVICES ====================
class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    console.log('🔄 Initializing background services...');
    
    // Check for new alerts every 5 minutes
    cron.schedule('*/5 * * * *', () => {
      this.checkForNewAlerts();
    });
    
    // Clean up old alerts every hour
    cron.schedule('0 * * * *', () => {
      this.cleanupOldAlerts();
    });

    // Send time-based tips at scheduled hours (00, 06, 12, 18)
     cron.schedule('0 0,6,12,18 * * *', () => {
     this.sendScheduledTimeTips();
    });
  // Test scripture reminders at 15:50 South African Time (13:50 UTC)
    cron.schedule('01 14 * * *', () => {
      this.sendDailyScriptureReminders();
    });

    // Check for unread daily scriptures and send reminders 4 times a day
    // 8 AM, 12 PM, 4 PM, 8 PM (UTC times: 6:00, 10:00, 14:00, 18:00)
    cron.schedule('0 6,10,14,18 * * *', () => {
      this.sendDailyScriptureReminders();
    });

    
    console.log('✅ Background services initialized');
  }

  async checkForNewAlerts() {
    try {
      console.log('🔍 Checking for new alerts...');
      const now = new Date().toISOString();

      // Deactivate expired safety alerts
      await supabase
        .from('safety_alerts')
        .update({ is_active: false })
        .eq('is_active', true)
        .lt('end_time', now);

      // Deactivate expired location warnings
      await supabase
        .from('location_warnings')
        .update({ is_active: false })
        .eq('is_active', true)
        .lt('end_time', now);

    } catch (error) {
      console.error('Error in checkForNewAlerts:', error);
    }
  }

  async cleanupOldAlerts() {
    try {
      console.log('🧹 Cleaning up old alerts...');
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      
      await supabase
        .from('safety_alerts')
        .delete()
        .eq('is_active', false)
        .lt('created_at', thirtyDaysAgo);

      await supabase
        .from('crime_alerts')
        .delete()
        .eq('status', 'resolved')
        .lt('created_at', thirtyDaysAgo);

      await supabase
        .from('location_warnings')
        .delete()
        .eq('is_active', false)
        .lt('created_at', thirtyDaysAgo);

    } catch (error) {
      console.error('Error in cleanupOldAlerts:', error);
    }
  }

  async sendScheduledTimeTips() {
    try {
      console.log('⏰ Sending scheduled time tips...');
      const currentHour = new Date().getHours();
      
      const { data: tips, error } = await supabase
        .from('time_tips')
        .select('*')
        .eq('is_active', true)
        .lte('hour_start', currentHour)
        .gte('hour_end', currentHour)
        .limit(1);

      if (error || !tips || tips.length === 0) return;

      const tip = tips[0];
      await this.sendTimeTipNotification(tip);
      
    } catch (error) {
      console.error('Error in sendScheduledTimeTips:', error);
    }
  }

  async sendTimeTipNotification(tip) {
    try {
      const { data: notifications, error } = await supabase
        .from('push_tokens')
        .select('token')
        .not('token', 'is', null);

      if (error) return;

      const messages = [];
      
      for (const notification of notifications || []) {
        if (!Expo.isExpoPushToken(notification.token)) continue;
        
        messages.push({
          to: notification.token,
          sound: 'default',
          title: tip.awareness,
          body: tip.tip,
          data: { type: 'time_tip', tipId: tip.id }
        });
      }
      
      if (messages.length === 0) return;
      
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          console.error('Error sending notification chunk:', error);
        }
      }
      
      console.log(`✅ Sent time tip: ${tip.awareness}`);
      
    } catch (error) {
      console.error('Error in sendTimeTipNotification:', error);
    }
  }

  async sendDailyScriptureReminders() {
    try {
      console.log('📖 Checking for unread daily scriptures...');
      
      // Get all users with active push tokens
      const { data: tokens, error: tokenError } = await supabase
        .from('bible_push_tokens')
        .select('token, user_id')
        .eq('is_active', true);

      if (tokenError) {
        console.error('❌ Error fetching tokens:', tokenError);
        return;
      }

      if (!tokens || tokens.length === 0) {
        console.log('⚠️  No users with active push tokens');
        return;
      }

      console.log(`✅ Found ${tokens.length} user(s) with active tokens`);

      const messages = [];
      const today = new Date().toISOString().split('T')[0];

      for (const tokenData of tokens) {
        // Check reminder settings
        const { data: settings } = await supabase
          .from('bible_reminder_settings')
          .select('reminder_enabled')
          .eq('user_id', tokenData.user_id)
          .single();

        // Skip if reminders are disabled
        if (settings && !settings.reminder_enabled) {
          console.log(`⏭️  Skipping user ${tokenData.user_id} - reminders disabled`);
          continue;
        }

        // Check if user has read today's scripture
        const { data: progress } = await supabase
          .from('bible_reading_progress')
          .select('id')
          .eq('user_id', tokenData.user_id)
          .eq('date', today)
          .single();

        // If not read yet, send reminder
        if (!progress && Expo.isExpoPushToken(tokenData.token)) {
          console.log(`📤 Queuing reminder for user: ${tokenData.user_id}`);
          messages.push({
            to: tokenData.token,
            sound: 'default',
            title: '📖 Daily Scripture Reminder',
            body: "Don't forget to read today's scripture! Start your day with God's word.",
            data: { 
              type: 'scripture_reminder',
              date: today
            }
          });
        }
      }

      if (messages.length === 0) {
        console.log('✅ All users have completed today\'s reading!');
        return;
      }

      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          console.error('Error sending scripture reminder chunk:', error);
        }
      }

      console.log(`✅ Sent ${messages.length} scripture reminders`);

    } catch (error) {
      console.error('Error in sendDailyScriptureReminders:', error);
    }
  }
}

// Initialize background services
const backgroundService = new BackgroundService();

// ==================== API ROUTES ====================

// Health check
app.get('/health', async (req, res) => {
  try {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'AyaAI Safety Backend'
    });
  } catch (error) {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'AyaAI Safety Backend'
    });
  }
});

// Save push token
app.post('/save-push-token', async (req, res) => {
  try {
    const { token, platform, userId } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Push token is required'
      });
    }

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('push_tokens')
      .upsert({
        token: token,
        platform: platform || 'unknown',
        user_id: userId || 'anonymous',
        updated_at: now
      }, {
        onConflict: 'token'
      });

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      message: 'Push token saved successfully'
    });
  } catch (error) {
    console.error('Error saving push token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save push token'
    });
  }
});

// Get active safety alerts
app.get('/safety-alerts', async (req, res) => {
  try {
    const { data: alerts, error } = await supabase
      .from('safety_alerts')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: alerts || []
    });
  } catch (error) {
    console.error('Error fetching safety alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching safety alerts'
    });
  }
});

// Create safety alert
app.post('/safety-alerts', async (req, res) => {
  try {
    const alertData = {
      ...req.body,
      created_at: new Date().toISOString()
    };

    const { data: alert, error } = await supabase
      .from('safety_alerts')
      .insert([alertData])
      .select()
      .single();

    if (error) throw error;

    await sendSafetyAlertNotifications(alert);

    res.status(201).json({
      success: true,
      data: alert
    });
  } catch (error) {
    console.error('Error creating safety alert:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating safety alert'
    });
  }
});

// Get crime alerts
app.get('/crime-alerts', async (req, res) => {
  try {
    const { data: crimes, error } = await supabase
      .from('crime_alerts')
      .select('*')
      .eq('status', 'active')
      .order('severity', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: crimes || []
    });
  } catch (error) {
    console.error('Error fetching crime alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crime alerts'
    });
  }
});

// Create crime alert
app.post('/crime-alerts', async (req, res) => {
  try {
    const crimeData = {
      ...req.body,
      created_at: new Date().toISOString()
    };

    const { data: crime, error } = await supabase
      .from('crime_alerts')
      .insert([crimeData])
      .select()
      .single();

    if (error) throw error;

    if (crime.severity === 'high' || crime.severity === 'critical') {
      await sendCrimeNotifications(crime);
    }

    res.status(201).json({
      success: true,
      data: crime
    });
  } catch (error) {
    console.error('Error creating crime alert:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating crime alert'
    });
  }
});

// Get location warnings
app.get('/location-warnings', async (req, res) => {
  try {
    const { data: warnings, error } = await supabase
      .from('location_warnings')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: warnings || []
    });
  } catch (error) {
    console.error('Error fetching location warnings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching location warnings'
    });
  }
});

// Create location warning
app.post('/location-warnings', async (req, res) => {
  try {
    const warningData = {
      ...req.body,
      created_at: new Date().toISOString()
    };

    const { data: warning, error } = await supabase
      .from('location_warnings')
      .insert([warningData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: warning
    });
  } catch (error) {
    console.error('Error creating location warning:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating location warning'
    });
  }
});

// Get time tips
app.get('/time-tips', async (req, res) => {
  try {
    const { data: tips, error } = await supabase
      .from('time_tips')
      .select('*')
      .eq('is_active', true)
      .order('hour_start', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: tips || []
    });
  } catch (error) {
    console.error('Error fetching time tips:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching time tips'
    });
  }
});

// Create time tip
app.post('/time-tips', async (req, res) => {
  try {
    const tipData = {
      ...req.body,
      created_at: new Date().toISOString()
    };

    const { data: tip, error } = await supabase
      .from('time_tips')
      .insert([tipData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: tip
    });
  } catch (error) {
    console.error('Error creating time tip:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating time tip'
    });
  }
});

// Trigger time tip manually
app.post('/trigger-time-tip', async (req, res) => {
  try {
    await backgroundService.sendScheduledTimeTips();
    res.status(200).json({
      success: true,
      message: 'Time tip notification triggered'
    });
  } catch (error) {
    console.error('Error triggering time tip:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering time tip'
    });
  }
});

// ==================== BIBLE READING TRACKER API ====================

// Save reading progress
app.post('/bible/progress', async (req, res) => {
  try {
    const { userId, date, scriptureReference } = req.body;

    if (!userId || !date || !scriptureReference) {
      return res.status(400).json({
        success: false,
        message: 'userId, date, and scriptureReference are required'
      });
    }

    const { data, error } = await supabase
      .from('bible_reading_progress')
      .upsert({
        user_id: userId,
        date: date,
        scripture_reference: scriptureReference,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,date'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error saving reading progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save reading progress'
    });
  }
});

// Get reading progress
app.get('/bible/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('bible_reading_progress')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching reading progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reading progress'
    });
  }
});

// Check if user read today
app.get('/bible/check-today/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('bible_reading_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    res.status(200).json({
      success: true,
      hasRead: !!data,
      data: data
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      hasRead: false,
      data: null
    });
  }
});

// Get reading streak
app.get('/bible/streak/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .rpc('get_reading_streak', { p_user_id: userId });

    if (error) throw error;

    res.status(200).json({
      success: true,
      streak: data || 0
    });
  } catch (error) {
    console.error('Error fetching reading streak:', error);
    res.status(200).json({
      success: true,
      streak: 0
    });
  }
});

// Save push token for Bible reminders
app.post('/bible/save-push-token', async (req, res) => {
  try {
    const { userId, token, platform } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        message: 'userId and token are required'
      });
    }

    const { data, error } = await supabase
      .from('bible_push_tokens')
      .upsert({
        user_id: userId,
        token: token,
        platform: platform || 'unknown',
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'token'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Push token saved successfully',
      data: data
    });
  } catch (error) {
    console.error('Error saving push token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save push token'
    });
  }
});

// Update reminder settings
app.post('/bible/reminder-settings', async (req, res) => {
  try {
    const { userId, reminderEnabled, reminderTime, timezone } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const { data, error } = await supabase
      .from('bible_reminder_settings')
      .upsert({
        user_id: userId,
        reminder_enabled: reminderEnabled !== undefined ? reminderEnabled : true,
        reminder_time: reminderTime || '08:00:00',
        timezone: timezone || 'UTC',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error updating reminder settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reminder settings'
    });
  }
});

// Get reminder settings
app.get('/bible/reminder-settings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('bible_reminder_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    res.status(200).json({
      success: true,
      data: data || {
        reminder_enabled: true,
        reminder_time: '08:00:00',
        timezone: 'UTC'
      }
    });
  } catch (error) {
    console.error('Error fetching reminder settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reminder settings'
    });
  }
});

// Trigger daily scripture reminders manually (for testing)
app.post('/bible/trigger-reminders', async (req, res) => {
  try {
    await backgroundService.sendDailyScriptureReminders();
    res.status(200).json({
      success: true,
      message: 'Daily scripture reminders triggered'
    });
  } catch (error) {
    console.error('Error triggering scripture reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering scripture reminders'
    });
  }
});

// ==================== NOTIFICATION FUNCTIONS ====================

async function sendSafetyAlertNotifications(alert) {
  try {
    const { data: notifications, error } = await supabase
      .from('push_tokens')
      .select('token')
      .not('token', 'is', null);

    if (error) return;

    const messages = [];
    
    for (const notification of notifications || []) {
      if (!Expo.isExpoPushToken(notification.token)) continue;
      
      messages.push({
        to: notification.token,
        sound: 'default',
        title: alert.title || 'Safety Alert',
        body: alert.message,
        data: { type: 'safety_alert', alertId: alert.id }
      });
    }
    
    if (messages.length === 0) return;
    
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error('Error sending notification chunk:', error);
      }
    }
    
  } catch (error) {
    console.error('Error in sendSafetyAlertNotifications:', error);
  }
}

async function sendCrimeNotifications(crime) {
  try {
    const { data: notifications, error } = await supabase
      .from('push_tokens')
      .select('token')
      .not('token', 'is', null);

    if (error) return;

    const messages = [];
    
    for (const notification of notifications || []) {
      if (!Expo.isExpoPushToken(notification.token)) continue;
      
      messages.push({
        to: notification.token,
        sound: 'default',
        title: 'Crime Alert',
        body: `${crime.type} reported in ${crime.area}`,
        data: { type: 'crime_alert', crimeId: crime.id }
      });
    }
    
    if (messages.length === 0) return;
    
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error('Error sending crime notification chunk:', error);
      }
    }
    
  } catch (error) {
    console.error('Error in sendCrimeNotifications:', error);
  }
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
});