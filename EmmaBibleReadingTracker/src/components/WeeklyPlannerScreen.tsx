// WeeklyPlannerScreen.tsx
// Main entry point — shows the week overview and routes to daily views

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MonthGoalsScreen from './MonthGoalsScreen';
import WeekGoalsModal from './WeekGoalsModal';
import DayActivityScreen from './DayActivityScreen';

// ─── helpers ────────────────────────────────────────────────────────────────

/** ISO week number (Mon = week start) */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Returns Mon–Sun Date objects for the week containing `date` */
function getWeekDates(date: Date): Date[] {
  const day = date.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const COLORS = {
  bg: '#0F1117',
  surface: '#1A1D27',
  surfaceHigh: '#22263A',
  accent: '#6C63FF',
  accentSoft: '#3D3875',
  gold: '#F5C842',
  text: '#F0EFF8',
  textMuted: '#7B7A99',
  textDim: '#4A4968',
  green: '#3ECF8E',
  red: '#FF6B6B',
  border: '#2A2D40',
};

// ─── component ──────────────────────────────────────────────────────────────

export default function WeeklyPlannerScreen() {
  const today = new Date();
  const weekNum = getISOWeek(today);
  const weekDates = getWeekDates(today);
  const todayIndex = (today.getDay() === 0 ? 6 : today.getDay() - 1); // 0=Mon

  const [screen, setScreen] = useState<'home' | 'monthGoals' | 'day'>('home');
  const [selectedDay, setSelectedDay] = useState<number>(todayIndex);
  const [weekGoalsOpen, setWeekGoalsOpen] = useState(false);
  const [dayStats, setDayStats] = useState<Record<number, { total: number; done: number }>>({});
  const [monthGoalCount, setMonthGoalCount] = useState(0);
  const [weekGoalCount, setWeekGoalCount] = useState(0);

  // Load summary stats for all days
  useEffect(() => {
    loadAllStats();
  }, [screen, weekGoalsOpen]);

  async function loadAllStats() {
    const stats: Record<number, { total: number; done: number }> = {};
    for (let i = 0; i < 7; i++) {
      const dateKey = weekDates[i].toISOString().split('T')[0];
      const raw = await AsyncStorage.getItem(`day_activities_${dateKey}`);
      if (raw) {
        const activities = JSON.parse(raw);
        stats[i] = {
          total: activities.length,
          done: activities.filter((a: any) => a.status === 'Done').length,
        };
      } else {
        stats[i] = { total: 0, done: 0 };
      }
    }
    setDayStats(stats);

    // Month goals count
    const mg = await AsyncStorage.getItem(`month_goals_${today.getFullYear()}_${today.getMonth()}`);
    setMonthGoalCount(mg ? JSON.parse(mg).length : 0);

    // Week goals count
    const wg = await AsyncStorage.getItem(`week_goals_${today.getFullYear()}_${weekNum}`);
    setWeekGoalCount(wg ? JSON.parse(wg).length : 0);
  }

  // ── sub-screens ────────────────────────────────────────────────────────────
  if (screen === 'monthGoals') {
    return <MonthGoalsScreen onBack={() => setScreen('home')} />;
  }
  if (screen === 'day') {
    return (
      <DayActivityScreen
        dayIndex={selectedDay}
        date={weekDates[selectedDay]}
        weekNum={weekNum}
        onBack={() => setScreen('home')}
      />
    );
  }

  // ── home ───────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.headerWeek}>WEEK {weekNum}</Text>
            <Text style={s.headerYear}>{today.getFullYear()}</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerDate}>
              {today.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })}
            </Text>
          </View>
        </View>

        {/* ── goals strip ── */}
        <View style={s.goalStrip}>
          <TouchableOpacity style={s.goalCard} onPress={() => setScreen('monthGoals')} activeOpacity={0.8}>
            <Text style={s.goalCardLabel}>MONTH GOALS</Text>
            <Text style={s.goalCardNum}>{monthGoalCount}</Text>
            <Text style={s.goalCardSub}>
              {today.toLocaleDateString('en-ZA', { month: 'long' }).toUpperCase()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.goalCard, s.goalCardAccent]} onPress={() => setWeekGoalsOpen(true)} activeOpacity={0.8}>
            <Text style={[s.goalCardLabel, { color: COLORS.gold }]}>WEEK GOALS</Text>
            <Text style={[s.goalCardNum, { color: COLORS.gold }]}>{weekGoalCount}</Text>
            <Text style={[s.goalCardSub, { color: '#A89C50' }]}>WK {weekNum}</Text>
          </TouchableOpacity>
        </View>

        {/* ── section label ── */}
        <Text style={s.sectionLabel}>DAILY ACTIVITIES</Text>

        {/* ── day cards ── */}
        {DAY_NAMES.map((name, i) => {
          const date = weekDates[i];
          const isToday = i === todayIndex;
          const stats = dayStats[i] || { total: 0, done: 0 };
          const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
          const isPast = date < new Date(today.toDateString());
          const isFuture = date > new Date(today.toDateString());

          return (
            <TouchableOpacity
              key={i}
              style={[s.dayCard, isToday && s.dayCardToday, isFuture && s.dayCardFuture]}
              onPress={() => { setSelectedDay(i); setScreen('day'); }}
              activeOpacity={0.75}
            >
              {/* left badge */}
              <View style={[s.dayBadge, isToday && s.dayBadgeToday]}>
                <Text style={[s.dayBadgeShort, isToday && { color: COLORS.bg }]}>{DAY_SHORT[i]}</Text>
                <Text style={[s.dayBadgeNum, isToday && { color: COLORS.bg }]}>{date.getDate()}</Text>
              </View>

              {/* middle */}
              <View style={s.dayMid}>
                <Text style={[s.dayName, isToday && { color: COLORS.accent }]}>
                  {name}{isToday ? '  ◉ TODAY' : ''}
                </Text>
                {stats.total > 0 ? (
                  <>
                    <View style={s.progressBar}>
                      <View style={[s.progressFill, { width: `${pct}%` as any, backgroundColor: pct === 100 ? COLORS.green : COLORS.accent }]} />
                    </View>
                    <Text style={s.dayStatText}>{stats.done}/{stats.total} tasks · {pct}%</Text>
                  </>
                ) : (
                  <Text style={s.dayEmpty}>{isFuture ? 'Tap to plan ahead' : 'No activities logged'}</Text>
                )}
              </View>

              {/* chevron */}
              <Text style={[s.chevron, isToday && { color: COLORS.accent }]}>›</Text>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* week goals modal */}
      <WeekGoalsModal
        visible={weekGoalsOpen}
        weekNum={weekNum}
        year={today.getFullYear()}
        onClose={() => setWeekGoalsOpen(false)}
      />
    </View>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingTop: 56 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 },
  headerWeek: { fontSize: 13, fontWeight: '700', letterSpacing: 3, color: COLORS.accent },
  headerYear: { fontSize: 34, fontWeight: '900', color: COLORS.text, letterSpacing: -1 },
  headerRight: { alignItems: 'flex-end' },
  headerDate: { fontSize: 13, color: COLORS.textMuted, letterSpacing: 1 },

  goalStrip: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  goalCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  goalCardAccent: { borderColor: COLORS.accentSoft, backgroundColor: '#1B1A2E' },
  goalCardLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: COLORS.textMuted, marginBottom: 6 },
  goalCardNum: { fontSize: 36, fontWeight: '900', color: COLORS.text },
  goalCardSub: { fontSize: 10, color: COLORS.textDim, marginTop: 2 },

  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 3, color: COLORS.textDim, marginBottom: 14 },

  dayCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  dayCardToday: { borderColor: COLORS.accent, backgroundColor: '#1C1B32' },
  dayCardFuture: { opacity: 0.6 },

  dayBadge: {
    width: 48, height: 56, borderRadius: 12, backgroundColor: COLORS.surfaceHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  dayBadgeToday: { backgroundColor: COLORS.accent },
  dayBadgeShort: { fontSize: 10, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1 },
  dayBadgeNum: { fontSize: 22, fontWeight: '900', color: COLORS.text },

  dayMid: { flex: 1 },
  dayName: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  progressBar: { height: 4, backgroundColor: COLORS.surfaceHigh, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: 4, borderRadius: 4 },
  dayStatText: { fontSize: 11, color: COLORS.textMuted },
  dayEmpty: { fontSize: 12, color: COLORS.textDim, fontStyle: 'italic' },
  chevron: { fontSize: 26, color: COLORS.textDim, marginRight: 2 },
});
