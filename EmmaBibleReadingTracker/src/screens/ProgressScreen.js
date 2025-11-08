import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../theme';
import { storageUtils } from '../utils/storage';

const { width } = Dimensions.get('window');

export default function ProgressScreen({ navigation }) {
  const [statistics, setStatistics] = useState({
    totalDays: 0,
    totalReadings: 0,
    averagePerDay: 0,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    const stats = await storageUtils.getStatistics();
    setStatistics(stats);
    
    // Calculate progress percentage (assuming 365 days goal)
    const progressPercentage = Math.min((stats.totalDays / 365) * 100, 100);
    setProgress(progressPercentage);
  };

  const StatCard = ({ icon, title, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar Card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="trending-up" size={24} color={colors.primary} />
            <Text style={styles.title}>Reading Progress</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>{progress.toFixed(1)}% Complete</Text>
              <Text style={styles.progressGoal}>Goal: 100%</Text>
            </View>
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationBox}>
            <Ionicons name="star" size={20} color={colors.warning} />
            <Text style={styles.motivationText}>
              {progress < 25
                ? "Great start! Keep building your reading habit."
                : progress < 50
                ? "You're making excellent progress!"
                : progress < 75
                ? "Amazing dedication! You're more than halfway there!"
                : "Incredible! You're almost at your goal!"}
            </Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <StatCard
          icon="calendar"
          title="Days with Readings"
          value={statistics.totalDays}
          color={colors.primary}
        />
        
        <StatCard
          icon="book"
          title="Total Readings"
          value={statistics.totalReadings}
          color={colors.success}
        />
        
        <StatCard
          icon="analytics"
          title="Average per Day"
          value={statistics.averagePerDay}
          color={colors.secondary}
        />

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Calendar')}>
            <View style={styles.actionContent}>
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionButtonTitle}>View Calendar</Text>
                <Text style={styles.actionButtonSubtitle}>See your reading history</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Log', { screen: 'LogReading' })}>
            <View style={styles.actionContent}>
              <Ionicons name="add-circle-outline" size={24} color={colors.success} />
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionButtonTitle}>Log New Reading</Text>
                <Text style={styles.actionButtonSubtitle}>Add today's scripture</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
          </TouchableOpacity>
        </View>

        {/* Milestone Card */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <Ionicons name="trophy" size={24} color={colors.warning} />
            <Text style={styles.milestoneTitle}>Next Milestone</Text>
          </View>
          <Text style={styles.milestoneText}>
            {statistics.totalDays < 7
              ? `${7 - statistics.totalDays} more days to reach your first week!`
              : statistics.totalDays < 30
              ? `${30 - statistics.totalDays} more days to reach one month!`
              : statistics.totalDays < 90
              ? `${90 - statistics.totalDays} more days to reach 90 days!`
              : statistics.totalDays < 365
              ? `${365 - statistics.totalDays} more days to complete the year!`
              : "Congratulations! You've completed a full year!"}
          </Text>
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
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
  progressGoal: {
    ...typography.body,
    color: colors.text.secondary,
  },
  motivationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
  },
  motivationText: {
    ...typography.small,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...shadows.medium,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    ...typography.h1,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  statTitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  actionsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  actionsTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  actionButtonTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
  actionButtonSubtitle: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  milestoneCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.warning,
    ...shadows.medium,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  milestoneTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  milestoneText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
});
