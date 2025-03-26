import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { ThemedText } from './common/ThemedText';
import { ThemedView } from './common/ThemedView';
import { COLORS, SPACING } from '@/theme';
import type { Team } from '@/types';

interface FoulManagerProps {
  homeTeam: Team;
  awayTeam: Team;
  onFoul: (teamId: string) => void;
  onResetFouls: () => void;
  isBonus: boolean;
}

export function FoulManager({
  homeTeam,
  awayTeam,
  onFoul,
  onResetFouls,
  isBonus,
}: FoulManagerProps) {
  const renderTeamFouls = (team: Team) => (
    <View style={styles.teamFouls}>
      <ThemedText type="subtitle">{team.name}</ThemedText>
      <View style={styles.foulRow}>
        {Array.from({ length: team.foulsInQuarter }).map((_, index) => (
          <IconButton
            key={index}
            icon="close-circle"
            size={24}
            iconColor={COLORS.error}
            onPress={() => onFoul(team.id)}
          />
        ))}
        {Array.from({ length: 5 - team.foulsInQuarter }).map((_, index) => (
          <IconButton
            key={index}
            icon="circle-outline"
            size={24}
            iconColor={COLORS.disabled}
            onPress={() => onFoul(team.id)}
          />
        ))}
      </View>
      {isBonus && team.foulsInQuarter >= 5 && (
        <ThemedText style={styles.bonusText}>BONUS</ThemedText>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Team Fouls</ThemedText>
        <Button
          mode="outlined"
          onPress={onResetFouls}
          style={styles.resetButton}>
          Reset Fouls
        </Button>
      </View>
      <View style={styles.content}>
        {renderTeamFouls(homeTeam)}
        {renderTeamFouls(awayTeam)}
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
  teamFouls: {
    alignItems: 'center',
  },
  foulRow: {
    flexDirection: 'row',
    marginTop: SPACING.small,
  },
  resetButton: {
    minWidth: 100,
  },
  bonusText: {
    color: COLORS.warning,
    fontWeight: 'bold',
    marginTop: SPACING.small,
  },
});
