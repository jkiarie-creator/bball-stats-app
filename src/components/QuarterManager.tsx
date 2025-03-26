import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ThemedView } from './common/ThemedView';
import { ThemedText } from './common/ThemedText';
import { COLORS, SPACING } from '@/theme';

interface QuarterManagerProps {
  currentQuarter: number;
  timeRemaining: number;
  isRunning: boolean;
  onToggle: () => void;
}

export const QuarterManager: React.FC<QuarterManagerProps> = ({
  currentQuarter,
  timeRemaining,
  isRunning,
  onToggle,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQuarterText = (quarter: number): string => {
    if (quarter <= 4) return `Quarter ${quarter}`;
    const otNumber = quarter - 4;
    return `OT ${otNumber}`;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.timeContainer}>
        <ThemedText type="title" style={styles.quarterText}>
          {getQuarterText(currentQuarter)}
        </ThemedText>
        <ThemedText type="title" style={styles.timeText}>
          {formatTime(timeRemaining)}
        </ThemedText>
      </View>

      <View style={styles.controlsContainer}>
        <Button
          mode="contained"
          onPress={onToggle}
          style={styles.button}
          buttonColor={isRunning ? COLORS.error : COLORS.success}>
          {isRunning ? 'Stop Clock' : 'Start Clock'}
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
    marginBottom: SPACING.medium,
  },
  quarterText: {
    marginBottom: SPACING.small,
  },
  timeText: {
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