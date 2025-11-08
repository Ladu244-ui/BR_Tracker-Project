import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows, glass } from '../theme';
import { monthNames, getMonthScriptures } from '../data/scriptures';

export default function ReadingPlanScreen() {
  const [selectedMonth, setSelectedMonth] = useState(monthNames[new Date().getMonth()]);
  const [schedule, setSchedule] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleViewSchedule = () => {
    const monthSchedule = getMonthScriptures(selectedMonth);
    setSchedule(monthSchedule);
    setShowSchedule(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Month Selector Card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={styles.title}>Select Month</Text>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
              dropdownIconColor={colors.primary}
              itemStyle={styles.pickerItem}>
              {monthNames.map((month) => (
                <Picker.Item key={month} label={month} value={month} color={colors.text.primary} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleViewSchedule}>
            <Ionicons name="eye-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>View Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Schedule Display */}
        {showSchedule && schedule && (
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleTitle}>{selectedMonth} Reading Plan</Text>
            
            {Object.entries(schedule).map(([day, verses]) => (
              <View key={day} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayNumber}>{day}</Text>
                  </View>
                  <View style={styles.versesContainer}>
                    {verses.map((verse, index) => (
                      <View key={index} style={styles.verseRow}>
                        <View style={styles.dot} />
                        <Text style={styles.verseText}>{verse}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {showSchedule && !schedule && (
          <View style={styles.card}>
            <Text style={styles.noDataText}>
              No schedule found for {selectedMonth}
            </Text>
          </View>
        )}
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: colors.text.primary,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  pickerItem: {
    backgroundColor: colors.background,
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 8,
    ...shadows.small,
  },
  buttonText: {
    color: '#fff',
    ...typography.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  scheduleCard: {
    ...glass.heavy,
    borderRadius: 16,
    padding: spacing.lg,
    ...shadows.medium,
  },
  scheduleTitle: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  dayCard: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dayBadge: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dayNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  versesContainer: {
    flex: 1,
  },
  verseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  verseText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  noDataText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
