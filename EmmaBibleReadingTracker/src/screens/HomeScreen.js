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
import { colors, spacing, typography, shadows, glass } from '../theme';
import { getTodaysScripture } from '../data/scriptures';

const { width } = Dimensions.get('window');

// Divine Office Hours Configuration
const DIVINE_OFFICE_HOURS = [
  {
    name: 'Office of Readings',
    subtitle: 'Matins',
    icon: '🌙',
    startHour: 0,
    endHour: 5,
    time: 'Night or very early morning',
    theme: 'Long readings from Scripture and Church Fathers',
  },
  {
    name: 'Lauds',
    subtitle: 'Morning Prayer',
    icon: '🌅',
    startHour: 5,
    endHour: 8,
    time: '5:00–8:00 AM',
    theme: 'Praise for the new day',
    isHinge: true,
  },
  {
    name: 'Terce',
    subtitle: 'Mid-morning Prayer',
    icon: '☀️',
    startHour: 8,
    endHour: 11,
    time: 'Around 9:00 AM',
    theme: 'Daytime Prayer',
  },
  {
    name: 'Sext',
    subtitle: 'Midday Prayer',
    icon: '☀️',
    startHour: 11,
    endHour: 14,
    time: 'Around 12:00 PM',
    theme: 'Daytime Prayer',
  },
  {
    name: 'None',
    subtitle: 'Mid-afternoon Prayer',
    icon: '🌤️',
    startHour: 14,
    endHour: 17,
    time: 'Around 3:00 PM',
    theme: 'Daytime Prayer',
  },
  {
    name: 'Vespers',
    subtitle: 'Evening Prayer',
    icon: '🌇',
    startHour: 17,
    endHour: 20,
    time: '5:00–7:00 PM',
    theme: 'Sunset prayer - one of the two most important hours',
    isHinge: true,
  },
  {
    name: 'Compline',
    subtitle: 'Night Prayer',
    icon: '🌙',
    startHour: 20,
    endHour: 24,
    time: 'Before going to bed (8:00–10:00 PM)',
    theme: 'Prayer before sleep',
  },
];

function getCurrentDivineOffice() {
  const now = new Date();
  const currentHour = now.getHours();
  
  for (const office of DIVINE_OFFICE_HOURS) {
    if (currentHour >= office.startHour && currentHour < office.endHour) {
      return office;
    }
  }
  
  // Default to Office of Readings if no match (shouldn't happen)
  return DIVINE_OFFICE_HOURS[0];
}

export default function HomeScreen({ navigation }) {
  const [todaysScripture, setTodaysScripture] = useState(null);
  const [currentOffice, setCurrentOffice] = useState(getCurrentDivineOffice());

  useEffect(() => {
    const scripture = getTodaysScripture();
    setTodaysScripture(scripture);
    
    // Update Divine Office every minute
    const interval = setInterval(() => {
      setCurrentOffice(getCurrentDivineOffice());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Today's Scripture Card */}
        <View style={[styles.card, glass.heavy]}>
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

        {/* Divine Office Prayer Card */}
        <View style={[styles.card, styles.divineOfficeCard, glass.heavy]}>
          <View style={styles.cardHeader}>
            <Text style={styles.officeIcon}>{currentOffice.icon}</Text>
            <Text style={styles.cardTitle}>Divine Office</Text>
            {currentOffice.isHinge && (
              <View style={styles.hingeBadge}>
                <Text style={styles.hingeText}>⭐ Hinge Hour</Text>
              </View>
            )}
          </View>
          
          <View style={styles.officeContent}>
            <Text style={styles.officeName}>{currentOffice.name}</Text>
            <Text style={styles.officeSubtitle}>({currentOffice.subtitle})</Text>
            <View style={styles.officeDetails}>
              <View style={styles.officeTimeContainer}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <Text style={styles.officeTime}>{currentOffice.time}</Text>
              </View>
              <Text style={styles.officeTheme}>{currentOffice.theme}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ReadingPlan')}>
            <View style={[styles.actionGradient, glass.card]}>
              <Ionicons name="calendar-outline" size={32} color={colors.primary} />
              <Text style={styles.actionText}>Monthly Plan</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Search', { screen: 'Search' })}>
            <View style={[styles.actionGradient, glass.card]}>
              <Ionicons name="search-outline" size={32} color={colors.secondary} />
              <Text style={styles.actionText}>Search Bible</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Log', { screen: 'LogReading' })}>
            <View style={[styles.actionGradient, glass.card]}>
              <Ionicons name="create-outline" size={32} color={colors.success} />
              <Text style={styles.actionText}>Log Reading</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Progress', { screen: 'ProgressView' })}>
            <View style={[styles.actionGradient, glass.card]}>
              <Ionicons name="stats-chart-outline" size={32} color={colors.warning} />
              <Text style={styles.actionText}>Progress</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Inspirational Message */}
        <View style={[styles.inspirationCard, glass.card]}>
          <Ionicons name="heart" size={20} color={colors.error} />
          <Text style={styles.inspirationText}>
            "Your word is a lamp to my feet and a light to my path." - Psalm 119:105
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
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
    overflow: 'hidden',
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
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
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
  },
  actionGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  actionText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  inspirationCard: {
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inspirationText: {
    ...typography.small,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginLeft: spacing.sm,
    flex: 1,
  },
  
  // Divine Office Styles
  divineOfficeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  officeIcon: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  hingeBadge: {
    backgroundColor: colors.warning + '33',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  hingeText: {
    fontSize: 10,
    color: colors.warning,
    fontWeight: '700',
  },
  officeContent: {
    marginTop: spacing.sm,
  },
  officeName: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: 4,
  },
  officeSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  officeDetails: {
    marginTop: spacing.sm,
  },
  officeTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  officeTime: {
    ...typography.body,
    color: colors.text.primary,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  officeTheme: {
    ...typography.small,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
