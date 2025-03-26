import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { ThemedText } from '@/components/common/ThemedText';
import { SPACING } from '@/theme';
import { db } from '../services/firebase';
import type { Team, Player } from '@/types';

interface TeamSetupProps {
  team: Team;
  onTeamChange: (team: Team) => void;
  label: string;
  createEmptyPlayer: () => Player;
}

export function TeamSetup({ team, onTeamChange, label, createEmptyPlayer }: TeamSetupProps) {
  const addPlayer = () => {
    onTeamChange({
      ...team,
      players: [...team.players, createEmptyPlayer()],
    });
  };

  const updatePlayer = (index: number, playerData: Partial<Player>) => {
    const newPlayers = [...team.players];
    newPlayers[index] = { ...newPlayers[index], ...playerData };
    onTeamChange({
      ...team,
      players: newPlayers,
    });
  };

  const removePlayer = (index: number) => {
    onTeamChange({
      ...team,
      players: team.players.filter((_, i) => i !== index),
    });
  };

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">{label}</ThemedText>
      <TextInput
        mode="outlined"
        label="Team Name"
        value={team.name}
        onChangeText={(name) => onTeamChange({ ...team, name })}
        style={styles.input}
      />

      <ScrollView style={styles.playersList}>
        {team.players.map((player, index) => (
          <View key={player.id} style={styles.playerRow}>
            <TextInput
              mode="outlined"
              label="Player Name"
              value={player.name}
              onChangeText={(name) => updatePlayer(index, { name })}
              style={styles.playerInput}
            />
            <TextInput
              mode="outlined"
              label="#"
              value={player.number}
              onChangeText={(number) => updatePlayer(index, { number })}
              keyboardType="numeric"
              style={styles.numberInput}
            />
            <Button
              mode="text"
              onPress={() => removePlayer(index)}
              icon="close">
              Remove
            </Button>
          </View>
        ))}
      </ScrollView>

      <Button
        mode="outlined"
        onPress={addPlayer}
        icon="plus"
        style={styles.addButton}>
        Add Player
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.large,
  },
  input: {
    marginTop: SPACING.small,
  },
  playersList: {
    maxHeight: 200,
    marginTop: SPACING.medium,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.small,
  },
  playerInput: {
    flex: 1,
    marginRight: SPACING.small,
  },
  numberInput: {
    width: 60,
    marginRight: SPACING.small,
  },
  addButton: {
    marginTop: SPACING.medium,
  },
});
