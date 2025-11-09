import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import bibleAPI from '../services/bibleAPI';
import { colors, glass, shadows, spacing, typography } from '../theme';

export default function SettingsScreen() {
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [streak, setStreak] = useState(0);
  const [hasReadToday, setHasReadToday] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    loadStreak();
    checkTodayStatus();
  }, []);

  const loadSettings = async () => {
    const result = await bibleAPI.getReminderSettings();
    if (result.success && result.data) {
      setReminderEnabled(result.data.reminder_enabled);
      
      // Parse reminder time
      if (result.data.reminder_time) {
        const [hours, minutes] = result.data.reminder_time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0);
        setReminderTime(date);
      }
    }
    setLoading(false);
  };

  const loadStreak = async () => {
    const result = await bibleAPI.getReadingStreak();
    if (result.success) {
      setStreak(result.streak || 0);
    }
  };

  const checkTodayStatus = async () => {
    const result = await bibleAPI.checkTodayReading();
    if (result.success) {
      setHasReadToday(result.hasRead);
    }
  };

  const handleToggleReminder = async (value) => {
    setReminderEnabled(value);
    await saveSettings(value, reminderTime);
  };

  const handleTimePress = () => {
    const currentHour = reminderTime.getHours();
    const currentMinute = reminderTime.getMinutes();
    
    Alert.prompt(
      'Set Reminder Time',
      'Enter time in HH:MM format (24-hour)',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async (time) => {
            if (time) {
              const [hours, minutes] = time.split(':').map(Number);
              if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                const newTime = new Date();
                newTime.setHours(hours, minutes, 0);
                setReminderTime(newTime);
                await saveSettings(reminderEnabled, newTime);
              } else {
                Alert.alert('Invalid Time', 'Please enter a valid time in HH:MM format');
              }
            }
          }
        }
      ],
      'plain-text',
      `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`
    );
  };

  const saveSettings = async (enabled, time) => {
    const timeString = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:00`;
    
    const result = await bibleAPI.updateReminderSettings({
      reminderEnabled: enabled,
      reminderTime: timeString,
      timezone: 'UTC', // You can get device timezone if needed
    });

    if (result.success) {
      Alert.alert('Success', 'Reminder settings updated!');
    } else {
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={48} color={colors.primary} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={32} color={colors.primary} />
              <Text style={styles.statNumber}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Ionicons 
                name={hasReadToday ? "checkmark-circle" : "ellipse-outline"} 
                size={32} 
                color={hasReadToday ? colors.primary : colors.text.light} 
              />
              <Text style={[styles.statNumber, !hasReadToday && styles.statInactive]}>
                {hasReadToday ? '✓' : '○'}
              </Text>
              <Text style={styles.statLabel}>Today's Reading</Text>
            </View>
          </View>
        </View>

        {/* Reminder Settings Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reminder Settings</Text>

          {/* Enable Reminders */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Daily Reminders</Text>
                <Text style={styles.settingDescription}>
                  Get notified if you haven't read today's scripture
                </Text>
              </View>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={handleToggleReminder}
              trackColor={{ false: '#333', true: colors.primary }}
              thumbColor={reminderEnabled ? '#fff' : '#999'}
            />
          </View>

          {/* Reminder Time */}
          {reminderEnabled && (
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={handleTimePress}>
              <View style={styles.settingLeft}>
                <Ionicons name="time" size={24} color={colors.primary} />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Reminder Time</Text>
                  <Text style={styles.settingDescription}>
                    {formatTime(reminderTime)}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
            </TouchableOpacity>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.infoBox}>
            <Ionicons name="bulb-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Reminders are sent daily at your chosen time, but only if you haven't completed today's reading yet.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  card: {
    ...glass.heavy,
    ...shadows.lg,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  statInactive: {
    color: colors.text.light,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  settingDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  timePickerContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  doneButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  doneButtonText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  testButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
});
