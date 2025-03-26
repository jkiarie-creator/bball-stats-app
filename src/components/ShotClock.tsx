import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { ThemedView } from './common/ThemedView';
import { ThemedText } from './common/ThemedText';
import { COLORS, SPACING } from '@/theme';

interface ShotClockProps {
  time: number;
  isEnabled: boolean;
  isRunning: boolean;
  onReset: () => void;
}

export const ShotClock: React.FC<ShotClockProps> = ({
  time,
  isEnabled,
  isRunning,
  onReset,
}) => {
  if (!isEnabled) return null;

  const isWarning = time <= 5;
  const textColor = isWarning ? COLORS.error : undefined;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.timeContainer}>
        <ThemedText type="title" style={[styles.timeText, { color: textColor }]}>
          {time.toFixed(1)}
        </ThemedText>
      </View>

      <View style={styles.controlsContainer}>
        <Button
          mode="contained"
          onPress={onReset}
          style={styles.button}
          buttonColor={COLORS.primary}
          disabled={!isRunning}>
          Reset Shot Clock
        </Button>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.medium,
    borderRadius: SPACING.small,
    margin: SPACING.small,
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SPACING.small,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    minWidth: 120,
  },
});