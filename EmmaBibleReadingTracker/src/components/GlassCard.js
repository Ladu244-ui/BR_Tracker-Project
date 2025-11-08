import React from 'react';
import { View, StyleSheet } from 'react-native';
import { glass, shadows } from '../theme';

export default function GlassCard({ children, style, heavy = false }) {
  return (
    <View style={[
      styles.container,
      heavy ? glass.heavy : glass.card,
      shadows.medium,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
