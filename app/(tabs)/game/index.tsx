import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { COLORS, SPACING } from '@/theme';

export default function GameScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Basketball Stats Tracker
        </ThemedText>
        
        <View style={styles.buttonContainer}>
          <Link href="./setup" asChild>
            <Button
              mode="contained"
              style={styles.button}
              buttonColor={COLORS.primary}>
              New Game
            </Button>
          </Link>
          
          <Link href="./history" asChild>
            <Button
              mode="outlined"
              style={styles.button}>
              Game History
            </Button>
          </Link>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: SPACING.xlarge,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: SPACING.medium,
  },
  button: {
    width: '100%',
  },
});
