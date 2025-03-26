import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { ThemedText } from './common/ThemedText';
import { ThemedView } from './common/ThemedView';
import { COLORS, SPACING } from '@/theme';
import type { Team } from '@/types';

interface TimeoutManagerProps {
  homeTeam: Team;
  awayTeam: Team;
  onTimeout: (teamId: string) => void;
  onResumeGame: () => void;
  isTimeoutActive: boolean;
}

export function TimeoutManager({
  homeTeam,
  awayTeam,
  onTimeout,
  onResumeGame,
  isTimeoutActive,
}: TimeoutManagerProps) {
  const renderTeamTimeouts = (team: Team) => (
    <View style={styles.teamTimeouts}>
      <ThemedText type="subtitle">{team.name}</ThemedText>
      <View style={styles.timeoutRow}>
        {Array.from({ length: team.timeoutsRemaining }).map((_, index) => (
          <IconButton
            key={index}
            icon="clock-outline"
            size={24}
            iconColor={COLORS.primary}
            onPress={() => onTimeout(team.id)}
            disabled={isTimeoutActive}
          />
        ))}
        {Array.from({ length: 5 - team.timeoutsRemaining }).map((_, index) => (
          <IconButton
            key={index}
            icon="clock-remove-outline"
            size={24}
            iconColor={COLORS.disabled}
            disabled={true}
          />
        ))}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Timeouts</ThemedText>
        {isTimeoutActive && (
          <Button
            mode="contained"
            onPress={onResumeGame}
            style={styles.resumeButton}
            buttonColor={COLORS.success}>
            Resume Game
          </Button>
        )}
      </View>
      <View style={styles.content}>
        {renderTeamTimeouts(homeTeam)}
        {renderTeamTimeouts(awayTeam)}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.medium,
    borderRadius: 8,
    marginBottom: SPACING.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  teamTimeouts: {
    alignItems: 'center',
  },
  timeoutRow: {
    flexDirection: 'row',
    marginTop: SPACING.small,
  },
  resumeButton: {
    minWidth: 120,
  },
});
