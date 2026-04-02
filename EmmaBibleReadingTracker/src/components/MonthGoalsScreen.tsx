// MonthGoalsScreen.tsx
// Monthly goals — entered once. Persisted by year+month key.

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  bg: '#0F1117', surface: '#1A1D27', surfaceHigh: '#22263A',
  accent: '#6C63FF', accentSoft: '#3D3875',
  text: '#F0EFF8', textMuted: '#7B7A99', textDim: '#4A4968',
  green: '#3ECF8E', red: '#FF6B6B', gold: '#F5C842',
  border: '#2A2D40',
};

interface Goal { id: string; text: string; done: boolean }

export default function MonthGoalsScreen({ onBack }: { onBack: () => void }) {
  const today = new Date();
  const storageKey = `month_goals_${today.getFullYear()}_${today.getMonth()}`;
  const monthName = today.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });

  const [goals, setGoals] = useState<Goal[]>([]);
  const [newText, setNewText] = useState('');
  const [notes, setNotes] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const raw = await AsyncStorage.getItem(storageKey);
    if (raw) setGoals(JSON.parse(raw));
    const n = await AsyncStorage.getItem(`month_notes_${today.getFullYear()}_${today.getMonth()}`);
    if (n) setNotes(n);
  }

  async function save(updated: Goal[]) {
    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    setGoals(updated);
  }

  async function saveNotes(text: string) {
    setNotes(text);
    await AsyncStorage.setItem(`month_notes_${today.getFullYear()}_${today.getMonth()}`, text);
  }

  function addGoal() {
    if (!newText.trim()) return;
    const updated = [...goals, { id: Date.now().toString(), text: newText.trim(), done: false }];
    save(updated);
    setNewText('');
  }

  function toggleGoal(id: string) {
    save(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  }

  function deleteGoal(id: string) {
    Alert.alert('Delete goal?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => save(goals.filter(g => g.id !== id)) },
    ]);
  }

  const done = goals.filter(g => g.done).length;
  const pct = goals.length > 0 ? Math.round((done / goals.length) * 100) : 0;

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* header */}
        <View style={s.header}>
          <TouchableOpacity onPress={onBack} style={s.backBtn}>
            <Text style={s.backArrow}>‹</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerLabel}>MONTHLY GOALS</Text>
            <Text style={s.headerTitle}>{monthName}</Text>
          </View>
        </View>

        {/* progress */}
        {goals.length > 0 && (
          <View style={s.progressCard}>
            <View style={s.progressTop}>
              <Text style={s.progressLabel}>Overall Progress</Text>
              <Text style={s.progressPct}>{pct}%</Text>
            </View>
            <View style={s.progressBar}>
              <View style={[s.progressFill, {
                width: `${pct}%` as any,
                backgroundColor: pct === 100 ? COLORS.green : COLORS.accent,
              }]} />
            </View>
            <Text style={s.progressSub}>{done} of {goals.length} goals achieved</Text>
          </View>
        )}

        {/* goals list */}
        <Text style={s.sectionLabel}>GOALS</Text>
        {goals.length === 0 && (
          <Text style={s.emptyText}>No goals yet. Add your first one below.</Text>
        )}
        {goals.map((g, i) => (
          <TouchableOpacity
            key={g.id}
            style={[s.goalRow, g.done && s.goalRowDone]}
            onPress={() => toggleGoal(g.id)}
            onLongPress={() => deleteGoal(g.id)}
            activeOpacity={0.8}
          >
            <View style={[s.checkbox, g.done && s.checkboxDone]}>
              {g.done && <Text style={s.checkmark}>✓</Text>}
            </View>
            <Text style={[s.goalText, g.done && s.goalTextDone]}>{g.text}</Text>
          </TouchableOpacity>
        ))}

        {/* add input */}
        <View style={s.addRow}>
          <TextInput
            ref={inputRef}
            style={s.addInput}
            value={newText}
            onChangeText={setNewText}
            placeholder="Add a goal…"
            placeholderTextColor={COLORS.textDim}
            onSubmitEditing={addGoal}
            returnKeyType="done"
          />
          <TouchableOpacity style={s.addBtn} onPress={addGoal} activeOpacity={0.8}>
            <Text style={s.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* notes / considerations */}
        <Text style={[s.sectionLabel, { marginTop: 28 }]}>THINGS TO CONSIDER</Text>
        <TextInput
          style={s.notesInput}
          value={notes}
          onChangeText={saveNotes}
          multiline
          placeholder="Notes, reminders, intentions for this month…"
          placeholderTextColor={COLORS.textDim}
          textAlignVertical="top"
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingTop: 52 },

  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 12 },
  backBtn: { paddingTop: 2, paddingRight: 4 },
  backArrow: { fontSize: 32, color: COLORS.accent, lineHeight: 36 },
  headerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 3, color: COLORS.accent },
  headerTitle: { fontSize: 26, fontWeight: '900', color: COLORS.text, letterSpacing: -0.5 },

  progressCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 28,
  },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  progressPct: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  progressBar: { height: 6, backgroundColor: COLORS.surfaceHigh, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 6, borderRadius: 4 },
  progressSub: { fontSize: 12, color: COLORS.textDim },

  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 3, color: COLORS.textDim, marginBottom: 12 },
  emptyText: { color: COLORS.textDim, fontStyle: 'italic', marginBottom: 16 },

  goalRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  goalRowDone: { opacity: 0.55, backgroundColor: COLORS.surfaceHigh },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2,
    borderColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  checkmark: { color: COLORS.bg, fontSize: 13, fontWeight: '900' },
  goalText: { flex: 1, color: COLORS.text, fontSize: 15 },
  goalTextDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },

  addRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  addInput: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    color: COLORS.text, fontSize: 15, borderWidth: 1, borderColor: COLORS.border,
  },
  addBtn: {
    width: 50, backgroundColor: COLORS.accent, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 26, fontWeight: '300', lineHeight: 30 },

  notesInput: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 16,
    color: COLORS.text, fontSize: 14, minHeight: 120, lineHeight: 22,
    borderWidth: 1, borderColor: COLORS.border,
  },
});
