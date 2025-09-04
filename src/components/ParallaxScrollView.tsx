import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import { ThemedView } from './ThemedView';

interface ParallaxScrollViewProps {
  children: React.ReactNode;
  headerBackgroundColor: {
    light: string;
    dark: string;
  };
  headerImage?: React.ReactNode;
}

export default function ParallaxScrollView({
  children,
  headerBackgroundColor,
  headerImage,
}: ParallaxScrollViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? headerBackgroundColor.dark : headerBackgroundColor.light;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, { backgroundColor }]}>
        {headerImage}
      </View>
      <ThemedView style={styles.content}>
        {children}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
}); 