import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../theme';
import { getTodaysScripture } from '../data/scriptures';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [todaysScripture, setTodaysScripture] = useState(null);

  useEffect(() => {
    const scripture = getTodaysScripture();
    setTodaysScripture(scripture);
  }, []);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary, colors.accent]}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Today's Scripture Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="book-outline" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Today's Scripture</Text>
          </View>
          
          {todaysScripture ? (
            <View style={styles.scriptureContent}>
              <Text style={styles.dateText}>
                {todaysScripture.month} {todaysScripture.day}
              </Text>
              <View style={styles.versesContainer}>
                {todaysScripture.verses.map((verse, index) => (
                  <View key={index} style={styles.verseItem}>
                    <View style={styles.verseBullet} />
                    <Text style={styles.verseText}>{verse}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.noScriptureText}>
              No scripture found for today.
            </Text>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ReadingPlan')}>
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.actionGradient}>
              <Ionicons name="calendar-outline" size={32} color="#fff" />
              <Text style={styles.actionText}>Monthly Plan</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Search', { screen: 'Search' })}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.actionGradient}>
              <Ionicons name="search-outline" size={32} color="#fff" />
              <Text style={styles.actionText}>Search Bible</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Log', { screen: 'LogReading' })}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.actionGradient}>
              <Ionicons name="create-outline" size={32} color="#fff" />
              <Text style={styles.actionText}>Log Reading</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Progress', { screen: 'ProgressView' })}>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.actionGradient}>
              <Ionicons name="stats-chart-outline" size={32} color="#fff" />
              <Text style={styles.actionText}>Progress</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Inspirational Message */}
        <View style={styles.inspirationCard}>
          <Ionicons name="heart" size={20} color={colors.error} />
          <Text style={styles.inspirationText}>
            "Your word is a lamp to my feet and a light to my path." - Psalm 119:105
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.glass,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  scriptureContent: {
    marginTop: spacing.sm,
  },
  dateText: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  versesContainer: {
    marginTop: spacing.sm,
  },
  verseItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  verseBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  verseText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  noScriptureText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  actionCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.small,
  },
  actionGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  actionText: {
    ...typography.body,
    color: '#fff',
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  inspirationCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.small,
  },
  inspirationText: {
    ...typography.small,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginLeft: spacing.sm,
    flex: 1,
  },
});
