import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, glass } from '../theme';

export default function DebugScreen() {
  const [storageData, setStorageData] = useState(null);

  const loadAllData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      
      const data = items.map(([key, value]) => {
        let parsedValue;
        try {
          parsedValue = value ? JSON.parse(value) : null;
        } catch (e) {
          // If JSON parsing fails, store the raw value
          parsedValue = value;
        }
        return {
          key,
          value: parsedValue,
        };
      });
      
      setStorageData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load storage data');
      console.error(error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data?',
      'This will delete all your reading logs and progress. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setStorageData([]);
              Alert.alert('Success', 'All data cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const deleteItem = (key) => {
    Alert.alert(
      'Delete Item?',
      `Delete ${key}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(key);
              loadAllData();
              Alert.alert('Success', 'Item deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="bug" size={24} color={colors.primary} />
            <Text style={styles.title}>AsyncStorage Debug</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.loadButton}
              onPress={loadAllData}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.buttonText}>Load Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAllData}>
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.buttonText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {storageData && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Storage Items ({storageData.length})
            </Text>

            {storageData.length === 0 ? (
              <Text style={styles.emptyText}>No data found</Text>
            ) : (
              storageData.map((item, index) => (
                <View key={index} style={styles.dataItem}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.keyText}>{item.key}</Text>
                    <TouchableOpacity
                      onPress={() => deleteItem(item.key)}
                      style={styles.deleteButton}>
                      <Ionicons name="close-circle" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal style={styles.valueScroll}>
                    <Text style={styles.valueText}>
                      {JSON.stringify(item.value, null, 2)}
                    </Text>
                  </ScrollView>
                </View>
              ))
            )}
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
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  loadButton: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 8,
  },
  buttonText: {
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
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  dataItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  keyText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
    flex: 1,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  valueScroll: {
    maxHeight: 200,
  },
  valueText: {
    ...typography.small,
    color: colors.text.secondary,
    fontFamily: 'monospace',
  },
});
