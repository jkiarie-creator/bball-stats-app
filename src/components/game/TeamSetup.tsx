import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { ThemedText } from '@components/common/ThemedText';
import { SPACING } from '@theme/index';
import { uuidv4 } from '@utils/index';
import type { Team, Player } from '@/types';
import RNPickerSelect from 'react-native-picker-select';

interface TeamSetupProps {
  team: Team;
  onTeamChange: (team: Team) => void;
  title: string;
}

const createEmptyPlayer = (): Player => ({
  id: uuidv4(),
  name: '',
  number: '',
  position: '',
  isActive: true,
  stats: {
    points: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    fouls: 0,
  },
});

const TeamSetup: React.FC<TeamSetupProps> = ({ team, onTeamChange, title }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const addPlayer = () => {
    if (!team.name) {
      setErrorMessage('Team name cannot be empty.');
      return;
    }
    onTeamChange({
      ...team,
      players: [...team.players, createEmptyPlayer()],
    });
    setSuccessMessage('Player added successfully!');
    setErrorMessage(null);
  };

  const updatePlayer = (index: number, updates: Partial<Player>) => {
    const newPlayers = [...team.players];
    newPlayers[index] = { ...newPlayers[index], ...updates };
    onTeamChange({ ...team, players: newPlayers });
  };

  const removePlayer = (index: number) => {
    onTeamChange({
      ...team,
      players: team.players.filter((_, i) => i !== index),
    });
    setSuccessMessage('Player removed successfully!');
    setErrorMessage(null);
  };

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">{title}</ThemedText>

      {errorMessage && <ThemedText style={{ color: 'red' }}>{errorMessage}</ThemedText>}
      {successMessage && <ThemedText style={{ color: 'green' }}>{successMessage}</ThemedText>}

      <TextInput
        mode="outlined"
        label="Team Name"
        value={team.name}
        onChangeText={(value) => onTeamChange({ ...team, name: value })}
        style={styles.input}
      />

      {team.players.map((player, index) => (
        <View key={player.id} style={styles.playerRow}>
          <TextInput
            mode="outlined"
            label="Player Name"
            value={player.name}
            onChangeText={(value) => updatePlayer(index, { name: value })}
            style={[styles.input, styles.playerInput]}
          />

          <TextInput
            mode="outlined"
            label="#"
            value={player.number}
            onChangeText={(value) => updatePlayer(index, { number: value })}
            keyboardType="numeric"
            style={[styles.input, styles.numberInput]}
          />

          <RNPickerSelect
            onValueChange={(value) => updatePlayer(index, { position: value })}
            items={[
              { label: 'Point Guard', value: 'PG' },
              { label: 'Shooting Guard', value: 'SG' },
              { label: 'Small Forward', value: 'SF' },
              { label: 'Power Forward', value: 'PF' },
              { label: 'Center', value: 'C' },
            ]}
          />

          <Button
            mode="outlined"
            onPress={() => removePlayer(index)}
            style={styles.removeButton}>
            X
          </Button>
        </View>
      ))}

      <Button
        mode="outlined"
        onPress={addPlayer}
        style={styles.addButton}>
        Add Player
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.large,
  },
  input: {
    marginBottom: SPACING.medium,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  playerInput: {
    flex: 1,
  },
  numberInput: {
    width: 60,
  },
  removeButton: {
    marginBottom: SPACING.medium,
  },
  addButton: {
    marginTop: SPACING.small,
  },
});

export default TeamSetup;
