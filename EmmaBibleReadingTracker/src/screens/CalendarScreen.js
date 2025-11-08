import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows, glass } from '../theme';
import { storageUtils } from '../utils/storage';

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [dayReadings, setDayReadings] = useState([]);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const progress = await storageUtils.getProgress();
    
    // Format dates for calendar
    const marked = {};
    Object.keys(progress).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: colors.primary,
        selected: false,
        selectedColor: colors.primary,
      };
    });
    
    setMarkedDates(marked);
  };

  const handleDayPress = async (day) => {
    const date = day.dateString;
    setSelectedDate(date);
    
    const progress = await storageUtils.getProgress();
    const readings = progress[date] || [];
    setDayReadings(readings);
    
    // Update marked dates to show selection
    const newMarked = { ...markedDates };
    Object.keys(newMarked).forEach((key) => {
      newMarked[key].selected = key === date;
    });
    if (!newMarked[date]) {
      newMarked[date] = {
        selected: true,
        selectedColor: colors.secondary,
      };
    }
    setMarkedDates(newMarked);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Calendar Card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={styles.title}>Reading Calendar</Text>
          </View>

          <Calendar
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              calendarBackground: 'transparent',
              backgroundColor: 'transparent',
              todayTextColor: colors.primary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#ffffff',
              arrowColor: colors.primary,
              monthTextColor: colors.text.primary,
              textMonthFontWeight: 'bold',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
              dayTextColor: colors.text.primary,
              textDisabledColor: colors.text.light,
            }}
            style={styles.calendar}
          />

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Reading completed</Text>
            </View>
          </View>
        </View>

        {/* Selected Day Readings */}
        {selectedDate && (
          <View style={styles.card}>
            <View style={styles.dayHeader}>
              <Ionicons name="book" size={20} color={colors.primary} />
              <Text style={styles.dayTitle}>
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>

            {dayReadings.length > 0 ? (
              <View style={styles.readingsList}>
                {dayReadings.map((reading, index) => (
                  <View key={index} style={styles.readingItem}>
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                    <Text style={styles.readingText}>{reading.book}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={32} color={colors.text.light} />
                <Text style={styles.emptyText}>No readings for this day</Text>
              </View>
            )}
          </View>
        )}

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>This Month</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Object.keys(markedDates).filter((date) => 
                  date.startsWith(new Date().toISOString().slice(0, 7))
                ).length}
              </Text>
              <Text style={styles.statLabel}>Days Read</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Object.keys(markedDates).length}
              </Text>
              <Text style={styles.statLabel}>Total Days</Text>
            </View>
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
  },
  card: {
    ...glass.heavy,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  calendar: {
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  legend: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  legendText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dayTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  readingsList: {
    marginTop: spacing.sm,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  readingText: {
    ...typography.body,
    color: colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  statsCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    ...shadows.medium,
  },
  statsTitle: {
    ...typography.h3,
    color: '#fff',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h1,
    color: '#fff',
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
