import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows, glass } from '../theme';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://bible-api.com/${searchQuery}`);
      const data = await response.json();
      
      if (data.error) {
        Alert.alert('Not Found', 'Could not find the requested verse');
        setSearchResults(null);
      } else {
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching:', error);
      Alert.alert('Error', 'Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Card */}
        <View style={[styles.card, glass.heavy]}>
          <View style={styles.header}>
            <Ionicons name="search" size={24} color={colors.primary} />
            <Text style={styles.title}>Search the Bible</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g., John 3:16 or Psalms 23"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="search" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Search Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Search Examples:</Text>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>John 3:16</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>Matthew 5:1-12</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>Psalms 23</Text>
            </View>
          </View>
        </View>

        {/* Results Card */}
        {searchResults && (
          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <Ionicons name="book" size={20} color={colors.primary} />
              <Text style={styles.resultsTitle}>{searchResults.reference}</Text>
            </View>
            <Text style={styles.resultsText}>{searchResults.text}</Text>
            
            {searchResults.translation_name && (
              <Text style={styles.translationText}>
                Translation: {searchResults.translation_name}
              </Text>
            )}
          </View>
        )}

        {/* Quick Access Verses */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Popular Verses</Text>
          {[
            { ref: 'John 3:16', title: 'For God so loved the world...' },
            { ref: 'Psalms 23:1', title: 'The Lord is my shepherd...' },
            { ref: 'Philippians 4:13', title: 'I can do all things...' },
            { ref: 'Jeremiah 29:11', title: 'Plans to prosper you...' },
          ].map((verse, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickVerseItem}
              onPress={() => {
                setSearchQuery(verse.ref);
                handleSearch();
              }}>
              <View style={styles.quickVerseContent}>
                <Text style={styles.quickVerseRef}>{verse.ref}</Text>
                <Text style={styles.quickVerseTitle}>{verse.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    ...typography.body,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: colors.text.primary,
  },
  searchButton: {
    backgroundColor: colors.primary,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: spacing.sm,
    ...shadows.small,
  },
  tipsContainer: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
  },
  tipsTitle: {
    ...typography.small,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginRight: spacing.sm,
  },
  tipText: {
    ...typography.small,
    color: colors.text.secondary,
  },
  resultsCard: {
    ...glass.heavy,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultsTitle: {
    ...typography.h3,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  resultsText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  translationText: {
    ...typography.small,
    color: colors.text.light,
    fontStyle: 'italic',
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  quickVerseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quickVerseContent: {
    flex: 1,
  },
  quickVerseRef: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  quickVerseTitle: {
    ...typography.small,
    color: colors.text.secondary,
  },
});
