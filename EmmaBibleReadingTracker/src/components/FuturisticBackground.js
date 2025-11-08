import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export default function FuturisticBackground({ children }) {
  return (
    <ImageBackground
      source={require('../../assets/images/starry-background.jpg')}
      style={styles.container}
      resizeMode="cover">
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
