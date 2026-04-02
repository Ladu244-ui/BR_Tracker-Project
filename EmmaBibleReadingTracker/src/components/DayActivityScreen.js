// DayActivityScreen.js
// Per-day activity log: matches the WEEK_38.docx table format exactly.
// Columns: TIME | ACTIVITY | AC.Start Time | AC.End Time | Status | Comment
// Also: day notes (bullet points), total accomplished, percentage, evaluation.

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Alert, Modal, KeyboardAvoidingView,
  Platform, Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  bg: '#0F1117', surface: '#1A1D27', surfaceHigh: '#22263A',
  accent: '#6C63FF', accentSoft: '#1C1B32',
  text: '#F0EFF8', textMuted: '#7B7A99', textDim: '#4A4968',
  green: '#3ECF8E', red: '#FF6B6B', gold: '#F5C842',
  border: '#2A2D40', yellow: '#F5C842',
};

const STATUS_OPTIONS = ['Done', 'In Progress', 'Not Done', 'Skipped', '—'];

const STATUS_COLORS = {
  'Done': COLORS.green,
  'In Progress': COLORS.gold,
  'Not Done': COLORS.red,
  'Skipped': COLORS.textDim,
  '—': COLORS.textDim,
};

const EMPTY_ACTIVITY = () => ({
  id: Date.now().toString() + Math.random(),
  time: '',
  activity: '',
  acStartTime: '',
  acEndTime: '',
  status: '—',
  comment: '',
});

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DayActivityScreen({ dayIndex, date, weekNum, onBack }) {
  const dateKey = date.toISOString().split('T')[0];
  const dayName = DAY_NAMES[dayIndex];

  const [activities, setActivities] = useState([EMPTY_ACTIVITY()]);
  const [dayNotes, setDayNotes] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [statusPickerOpen, setStatusPickerOpen] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const raw = await AsyncStorage.getItem(`day_activities_${dateKey}`);
    if (raw) {
      const data = JSON.parse(raw);
      setActivities(data.length > 0 ? data : [EMPTY_ACTIVITY()]);
    }
    const notes = await AsyncStorage.getItem(`day_notes_${dateKey}`);
    if (notes) setDayNotes(notes);
    const eval_ = await AsyncStorage.getItem(`day_eval_${dateKey}`);
    if (eval_) setEvaluation(eval_);
  }

  async function saveActivities(updated) {
    await AsyncStorage.setItem(`day_activities_${dateKey}`, JSON.stringify(updated));
    setActivities(updated);
  }

  async function saveNotes(text) {
    setDayNotes(text);
    await AsyncStorage.setItem(`day_notes_${dateKey}`, text);
  }

  async function saveEvaluation(text) {
    setEvaluation(text);
    await AsyncStorage.setItem(`day_eval_${dateKey}`, text);
  }

  function addRow() {
    saveActivities([...activities, EMPTY_ACTIVITY()]);
  }

  function deleteRow(id) {
    if (activities.length === 1) {
      // just clear it instead
      saveActivities([EMPTY_ACTIVITY()]);
      return;
    }
    Alert.alert('Delete row?', '', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => saveActivities(activities.filter(a => a.id !== id)) },
    ]);
  }

  function openEdit(a) {
    setEditingData({ ...a });
    setEditingId(a.id);
  }

  function saveEdit() {
    if (!editingData) return;
    saveActivities(activities.map(a => a.id === editingId ? editingData : a));
    setEditingId(null);
    setEditingData(null);
  }

  // stats
  const real = activities.filter(a => a.activity.trim());
  const done = real.filter(a => a.status === 'Done').length;
  const pct = real.length > 0 ? Math.round((done / real.length) * 100) : 0;

  const isToday = date.toDateString() === new Date().toDateString();
  const isPast = date < new Date(new Date().toDateString());

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

        {/* ── header ── */}
        <View style={s.header}>
          <TouchableOpacity onPress={onBack} style={s.backBtn}>
            <Text style={s.backArrow}>‹</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.headerLabel}>
              {isToday ? 'TODAY · ' : ''}WEEK {weekNum}
            </Text>
            <Text style={s.headerTitle}>{dayName}</Text>
            <Text style={s.headerDate}>
              {date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
        </View>

        {/* ── day notes ── */}
        <Text style={s.sectionLabel}>FOCUS / NOTES</Text>
        <TextInput
          style={s.notesInput}
          value={dayNotes}
          onChangeText={saveNotes}
          multiline
          placeholder="What's on today? Key intentions…"
          placeholderTextColor={COLORS.textDim}
          textAlignVertical="top"
        />

        {/* ── activity table ── */}
        <Text style={[s.sectionLabel, { marginTop: 24 }]}>ACTIVITY LOG</Text>

        {/* table header */}
        <View style={s.tableHeader}>
          <Text style={[s.th, { flex: 2 }]}>TIME</Text>
          <Text style={[s.th, { flex: 3 }]}>ACTIVITY</Text>
          <Text style={[s.th, { flex: 2 }]}>STATUS</Text>
          <Text style={[s.th, { flex: 1 }]}></Text>
        </View>

        {/* rows */}
        {activities.map((a, i) => (
          <TouchableOpacity
            key={a.id}
            style={[s.tableRow, i % 2 === 0 && s.tableRowAlt]}
            onPress={() => openEdit(a)}
            activeOpacity={0.75}
          >
            <Text style={[s.td, { flex: 2 }]} numberOfLines={1}>
              {a.time || <Text style={s.tdEmpty}>—</Text>}
            </Text>
            <Text style={[s.td, { flex: 3 }]} numberOfLines={1}>
              {a.activity || <Text style={s.tdEmpty}>Tap to fill</Text>}
            </Text>
            <View style={{ flex: 2, justifyContent: 'center' }}>
              <View style={[s.statusBadge, { backgroundColor: `${STATUS_COLORS[a.status]}22` }]}>
                <Text style={[s.statusText, { color: STATUS_COLORS[a.status] }]} numberOfLines={1}>
                  {a.status}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[s.deleteBtn, { flex: 1 }]} onPress={() => deleteRow(a.id)}>
              <Text style={s.deleteBtnText}>×</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* add row */}
        <TouchableOpacity style={s.addRowBtn} onPress={addRow} activeOpacity={0.8}>
          <Text style={s.addRowBtnText}>+ Add Row</Text>
        </TouchableOpacity>

        {/* ── summary ── */}
        <View style={s.summaryCard}>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Total activities accomplished</Text>
            <Text style={s.summaryValue}>{done} / {real.length}</Text>
          </View>
          <View style={s.progressBar}>
            <View style={[s.progressFill, {
              width: `${pct}%`,
              backgroundColor: pct === 100 ? COLORS.green : pct > 50 ? COLORS.gold : COLORS.accent,
            }]} />
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Percentage</Text>
            <Text style={[s.summaryValue, s.summaryPct]}>{pct}%</Text>
          </View>
        </View>

        {/* ── evaluation ── */}
        <Text style={[s.sectionLabel, { marginTop: 24 }]}>DAY EVALUATION</Text>
        <TextInput
          style={[s.notesInput, { minHeight: 100 }]}
          value={evaluation}
          onChangeText={saveEvaluation}
          multiline
          placeholder="How did the day go? Reflections, what to improve…"
          placeholderTextColor={COLORS.textDim}
          textAlignVertical="top"
        />

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* ── edit modal ── */}
      <Modal
        visible={!!editingId}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={saveEdit}
      >
        <KeyboardAvoidingView style={s.modalRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={s.modalScroll} keyboardShouldPersistTaps="handled">
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Edit Activity</Text>
              <TouchableOpacity style={s.modalSaveBtn} onPress={saveEdit}>
                <Text style={s.modalSaveTxt}>Save</Text>
              </TouchableOpacity>
            </View>

            {editingData && (
              <>
                <Field
                  label="PLANNED TIME"
                  value={editingData.time}
                  onChangeText={v => setEditingData({ ...editingData, time: v })}
                  placeholder="e.g. 08h00–10h00"
                />
                <Field
                  label="ACTIVITY"
                  value={editingData.activity}
                  onChangeText={v => setEditingData({ ...editingData, activity: v })}
                  placeholder="What were you doing?"
                />
                <Field
                  label="ACTUAL START TIME"
                  value={editingData.acStartTime}
                  onChangeText={v => setEditingData({ ...editingData, acStartTime: v })}
                  placeholder="e.g. 08h15"
                />
                <Field
                  label="ACTUAL END TIME"
                  value={editingData.acEndTime}
                  onChangeText={v => setEditingData({ ...editingData, acEndTime: v })}
                  placeholder="e.g. 10h30"
                />

                {/* status picker */}
                <Text style={s.fieldLabel}>STATUS</Text>
                <View style={s.statusGrid}>
                  {STATUS_OPTIONS.map(opt => (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        s.statusOption,
                        editingData.status === opt && { backgroundColor: `${STATUS_COLORS[opt]}33`, borderColor: STATUS_COLORS[opt] },
                      ]}
                      onPress={() => setEditingData({ ...editingData, status: opt })}
                    >
                      <Text style={[s.statusOptionText, editingData.status === opt && { color: STATUS_COLORS[opt] }]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Field
                  label="COMMENT"
                  value={editingData.comment}
                  onChangeText={v => setEditingData({ ...editingData, comment: v })}
                  placeholder="Any additional notes…"
                  multiline
                />
              </>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ── small reusable field ────────────────────────────────────────────────────

function Field({ label, value, onChangeText, placeholder, multiline }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        style={[s.fieldInput, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textDim}
        multiline={multiline}
      />
    </View>
  );
}

// ── styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingTop: 52 },

  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 12 },
  backBtn: { paddingTop: 2 },
  backArrow: { fontSize: 32, color: COLORS.accent, lineHeight: 38 },
  headerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 3, color: COLORS.accent },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: -0.5, lineHeight: 32 },
  headerDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 3, color: COLORS.textDim, marginBottom: 10 },

  notesInput: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 14,
    color: COLORS.text, fontSize: 14, minHeight: 72, lineHeight: 22,
    borderWidth: 1, borderColor: COLORS.border,
  },

  // table
  tableHeader: {
    flexDirection: 'row', backgroundColor: COLORS.surfaceHigh,
    borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 2,
  },
  th: { fontSize: 9, fontWeight: '700', color: COLORS.textDim, letterSpacing: 1.5 },

  tableRow: {
    flexDirection: 'row', backgroundColor: COLORS.surface, alignItems: 'center',
    paddingVertical: 11, paddingHorizontal: 12, borderRadius: 10, marginBottom: 2,
  },
  tableRowAlt: { backgroundColor: '#161824' },
  td: { fontSize: 13, color: COLORS.text },
  tdEmpty: { color: COLORS.textDim, fontStyle: 'italic' },

  statusBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '700' },

  deleteBtn: { alignItems: 'flex-end', justifyContent: 'center' },
  deleteBtnText: { color: COLORS.textDim, fontSize: 20, lineHeight: 22 },

  addRowBtn: {
    borderWidth: 1, borderColor: COLORS.accent, borderStyle: 'dashed',
    borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 8, marginBottom: 4,
  },
  addRowBtnText: { color: COLORS.accent, fontWeight: '600', fontSize: 14 },

  summaryCard: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, marginTop: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: COLORS.textMuted },
  summaryValue: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  summaryPct: { fontSize: 28, fontWeight: '900', color: COLORS.accent },
  progressBar: { height: 6, backgroundColor: COLORS.surfaceHigh, borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: 6, borderRadius: 4 },

  // modal
  modalRoot: { flex: 1, backgroundColor: COLORS.bg },
  modalScroll: { padding: 24, paddingTop: 32 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  modalSaveBtn: { backgroundColor: COLORS.accent, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 9 },
  modalSaveTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },

  fieldLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2, color: COLORS.textDim, marginBottom: 8 },
  fieldInput: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    color: COLORS.text, fontSize: 15, borderWidth: 1, borderColor: COLORS.border,
  },

  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statusOption: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  statusOptionText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
});
