// WeekGoalsModal.js
// Week goals — set once per week, persisted by year+weekNum.

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  bg: '#0F1117', surface: '#1A1D27', surfaceHigh: '#22263A',
  accent: '#6C63FF', gold: '#F5C842',
  text: '#F0EFF8', textMuted: '#7B7A99', textDim: '#4A4968',
  green: '#3ECF8E', border: '#2A2D40',
};

export default function WeekGoalsModal({ visible, weekNum, year, onClose }) {
  const storageKey = `week_goals_${year}_${weekNum}`;
  const [goals, setGoals] = useState([]);
  const [newText, setNewText] = useState('');

  useEffect(() => { if (visible) load(); }, [visible]);

  async function load() {
    const raw = await AsyncStorage.getItem(storageKey);
    if (raw) setGoals(JSON.parse(raw));
    else setGoals([]);
  }

  async function save(updated) {
    await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    setGoals(updated);
  }

  function addGoal() {
    if (!newText.trim()) return;
    save([...goals, { id: Date.now().toString(), text: newText.trim(), done: false }]);
    setNewText('');
  }

  function toggleGoal(id) {
    save(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  }

  function deleteGoal(id) {
    Alert.alert('Delete goal?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => save(goals.filter(g => g.id !== id)) },
    ]);
  }

  const done = goals.filter(g => g.done).length;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* header */}
          <View style={s.header}>
            <View>
              <Text style={s.headerLabel}>WEEK {weekNum} GOALS</Text>
              <Text style={s.headerSub}>{done}/{goals.length} achieved</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Text style={s.closeText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* goals */}
          {goals.length === 0 && (
            <Text style={s.empty}>No goals for this week yet.</Text>
          )}
          {goals.map(g => (
            <TouchableOpacity
              key={g.id}
              style={[s.goalRow, g.done && s.goalRowDone]}
              onPress={() => toggleGoal(g.id)}
              onLongPress={() => deleteGoal(g.id)}
              activeOpacity={0.8}
            >
              <View style={[s.checkbox, g.done && s.checkboxDone]}>
                {g.done && <Text style={s.check}>✓</Text>}
              </View>
              <Text style={[s.goalText, g.done && s.goalTextDone]}>{g.text}</Text>
            </TouchableOpacity>
          ))}

          {/* add */}
          <View style={s.addRow}>
            <TextInput
              style={s.addInput}
              value={newText}
              onChangeText={setNewText}
              placeholder="Add a week goal…"
              placeholderTextColor={COLORS.textDim}
              onSubmitEditing={addGoal}
              returnKeyType="done"
            />
            <TouchableOpacity style={s.addBtn} onPress={addGoal}>
              <Text style={s.addBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 24, paddingTop: 32 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  headerLabel: { fontSize: 20, fontWeight: '900', color: COLORS.gold, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  closeBtn: { backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  closeText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  empty: { color: COLORS.textDim, fontStyle: 'italic', marginBottom: 20 },

  goalRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  goalRowDone: { opacity: 0.5 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2,
    borderColor: COLORS.gold, alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  check: { color: COLORS.bg, fontWeight: '900', fontSize: 13 },
  goalText: { flex: 1, color: COLORS.text, fontSize: 15 },
  goalTextDone: { textDecorationLine: 'line-through', color: COLORS.textMuted },

  addRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  addInput: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    color: COLORS.text, fontSize: 15, borderWidth: 1, borderColor: COLORS.border,
  },
  addBtn: {
    width: 50, backgroundColor: COLORS.gold, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: COLORS.bg, fontSize: 26, fontWeight: '700', lineHeight: 30 },
});
