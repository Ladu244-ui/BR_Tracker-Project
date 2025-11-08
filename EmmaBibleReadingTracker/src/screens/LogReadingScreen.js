import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../theme';
import { storageUtils, formatTimeAgo } from '../utils/storage';

export default function LogReadingScreen() {
  const [reading, setReading] = useState('');
  const [recentReadings, setRecentReadings] = useState([]);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    loadRecentReadings();
  }, []);

  const loadRecentReadings = async () => {
    const recent = await storageUtils.getRecentReadings();
    setRecentReadings(recent);
  };

  const handleLogReading = async () => {
    if (!reading.trim()) {
      Alert.alert('Error', 'Please enter a scripture reference');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const readingData = {
      book: reading.trim(),
      date: today,
    };

    const success = await storageUtils.saveProgress(today, readingData);
    const recentSuccess = await storageUtils.saveRecentReading(readingData);

    if (success && recentSuccess) {
      Alert.alert('Success', `Logged: ${reading} for today!`);
      setReading('');
      loadRecentReadings();
    } else {
      Alert.alert('Error', 'Failed to log reading. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Log Reading Card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="create" size={24} color={colors.primary} />
            <Text style={styles.title}>Log Your Reading</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Scripture Range</Text>
              <TouchableOpacity
                style={styles.hintButton}
                onPress={() => setShowHint(!showHint)}>
                <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {showHint && (
              <View style={styles.hintBox}>
                <Text style={styles.hintTitle}>Examples:</Text>
                <View style={styles.hintItem}>
                  <Text style={styles.hintBullet}>•</Text>
                  <Text style={styles.hintText}>John 3:16</Text>
                </View>
                <View style={styles.hintItem}>
                  <Text style={styles.hintBullet}>•</Text>
                  <Text style={styles.hintText}>Matthew 5:1-12</Text>
                </View>
                <View style={styles.hintItem}>
                  <Text style={styles.hintBullet}>•</Text>
                  <Text style={styles.hintText}>Psalms 23</Text>
                </View>
              </View>
            )}

            <TextInput
              style={styles.input}
              placeholder="e.g., John 3:16-21"
              value={reading}
              onChangeText={setReading}
              onSubmitEditing={handleLogReading}
              returnKeyType="done"
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="book-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Track your journey through scripture, one passage at a time.
            </Text>
          </View>

          {/* Log Button */}
          <TouchableOpacity style={styles.logButton} onPress={handleLogReading}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.logButtonText}>Log Reading</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Readings */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Readings</Text>
          {recentReadings.length > 0 ? (
            recentReadings.map((item, index) => (
              <View key={index} style={styles.readingItem}>
                <View style={[styles.dot, { backgroundColor: index % 2 === 0 ? colors.primary : colors.secondary }]} />
                <View style={styles.readingContent}>
                  <Text style={styles.readingText}>{item.book}</Text>
                  <Text style={styles.timeText}>{formatTimeAgo(item.timestamp)}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color={colors.text.light} />
              <Text style={styles.emptyText}>No readings logged yet</Text>
              <Text style={styles.emptySubtext}>Start tracking your Bible reading journey!</Text>
            </View>
          )}
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
    backgroundColor: colors.white,
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
  inputContainer: {
    marginBottom: spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
  hintButton: {
    padding: spacing.xs,
  },
  hintBox: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  hintTitle: {
    ...typography.small,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  hintBullet: {
    ...typography.body,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  hintText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    ...typography.body,
    backgroundColor: colors.background,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  infoText: {
    ...typography.small,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  logButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 8,
    ...shadows.small,
  },
  logButtonText: {
    color: '#fff',
    ...typography.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  readingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readingText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  timeText: {
    ...typography.small,
    color: colors.text.light,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  emptySubtext: {
    ...typography.small,
    color: colors.text.light,
    marginTop: spacing.xs,
  },
});
