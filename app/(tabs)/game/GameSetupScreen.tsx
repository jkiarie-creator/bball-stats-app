import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, Chip, IconButton, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, SHADOWS } from '../../../src/theme';
import { Header, Button } from '../../../src/components/common';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Team, Player, GameSettings } from '../../../src/types';

interface GameSetupScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

// Explicitly declare the gameSettings type to ensure quarters is always defined
type GameSettingsWithQuarters = GameSettings & { quarters: number };

const GameSetupScreen: React.FC<GameSetupScreenProps> = ({ navigation }) => {
  const [homeTeam, setHomeTeam] = useState<Team>({
    name: '',
    color: COLORS.homeTeam,
    players: [],
  });

  const [awayTeam, setAwayTeam] = useState<Team>({
    name: '',
    color: COLORS.awayTeam,
    players: [],
  });

  const [gameSettings, setGameSettings] = useState<GameSettingsWithQuarters>({
    quarters: 4,
    minutesPerQuarter: 12,
    shotClock: 24,
  });

  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home');
  const [newPlayer, setNewPlayer] = useState<Player>({ id: '', name: '', number: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddPlayer = () => {
    if (!newPlayer.name || !newPlayer.number) return;

    const player = {
      ...newPlayer,
      id: Date.now().toString(),
    };

    if (selectedTeam === 'home') {
      setHomeTeam({
        ...homeTeam,
        players: [...homeTeam.players, player],
      });
    } else {
      setAwayTeam({
        ...awayTeam,
        players: [...awayTeam.players, player],
      });
    }

    setNewPlayer({ id: '', name: '', number: '' });
    setShowAddPlayer(false);
  };

  const handleRemovePlayer = (teamType: 'home' | 'away', playerId: string) => {
    if (teamType === 'home') {
      setHomeTeam({
        ...homeTeam,
        players: homeTeam.players.filter(p => p.id !== playerId),
      });
    } else {
      setAwayTeam({
        ...awayTeam,
        players: awayTeam.players.filter(p => p.id !== playerId),
      });
    }
  };

  const handleStartGame = () => {
    if (!homeTeam.name || !awayTeam.name) {
      setErrorMessage('Both teams must have a name.');
      return;
    }

    if (homeTeam.players.length < 5 || awayTeam.players.length < 5) {
      setErrorMessage('Both teams must have at least 5 players.');
      return;
    }

    setErrorMessage(null);
    navigation.navigate('LiveGame', {
      homeTeam,
      awayTeam,
      gameSettings,
    });
  };

  const renderTeamSection = (team: Team, teamType: 'home' | 'away') => (
    <View style={styles.teamSection}>
      <Text style={styles.sectionTitle}>
        {teamType === 'home' ? 'Home Team' : 'Away Team'}
      </Text>
      <TextInput
        label="Team Name"
        value={team.name}
        onChangeText={(text) =>
          teamType === 'home'
            ? setHomeTeam({ ...team, name: text })
            : setAwayTeam({ ...team, name: text })
        }
        mode="outlined"
        style={styles.input}
      />
      <View style={styles.playersContainer}>
        <View style={styles.playersHeader}>
          <Text style={styles.playersTitle}>Players</Text>
          <IconButton
            icon="plus"
            mode="contained"
            containerColor={team.color}
            iconColor={COLORS.surface}
            size={20}
            onPress={() => {
              setSelectedTeam(teamType);
              setShowAddPlayer(true);
            }}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.playerChips}>
            {team.players.map((player) => (
              <Chip
                key={player.id}
                style={[styles.playerChip, { backgroundColor: team.color }]}
                textStyle={{ color: COLORS.surface }}
                onClose={() => handleRemovePlayer(teamType, player.id)}
              >
                {player.number} - {player.name}
              </Chip>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Game Setup" />
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <ScrollView style={styles.content}>
        {renderTeamSection(homeTeam, 'home')}
        {renderTeamSection(awayTeam, 'away')}

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Game Settings</Text>
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Quarters</Text>
              <View style={styles.settingControl}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() =>
                    setGameSettings({
                      ...gameSettings,
                      quarters: Math.max(1, gameSettings.quarters! - 1),
                    })
                  }
                />
                <Text style={styles.settingValue}>{gameSettings.quarters!}</Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() =>
                    setGameSettings({
                      ...gameSettings,
                      quarters: Math.min(8, gameSettings.quarters! + 1),
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Minutes/Quarter</Text>
              <View style={styles.settingControl}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() =>
                    setGameSettings({
                      ...gameSettings,
                      minutesPerQuarter: Math.max(1, gameSettings.minutesPerQuarter - 1),
                    })
                  }
                />
                <Text style={styles.settingValue}>{gameSettings.minutesPerQuarter}</Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() =>
                    setGameSettings({
                      ...gameSettings,
                      minutesPerQuarter: Math.min(20, gameSettings.minutesPerQuarter + 1),
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Shot Clock</Text>
              <View style={styles.settingControl}>
                <IconButton
                  icon="minus"
                  size={20}
                  onPress={() =>
                    setGameSettings({
                      ...gameSettings,
                      shotClock: Math.max(12, gameSettings.shotClock - 1),
                    })
                  }
                />
                <Text style={styles.settingValue}>{gameSettings.shotClock}</Text>
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={() =>
                    setGameSettings({
                      ...gameSettings,
                      shotClock: Math.min(35, gameSettings.shotClock + 1),
                    })
                  }
                />
              </View>
            </View>
          </View>
        </View>

        <Button
          title="Start Game"
          onPress={handleStartGame}
          style={styles.startButton}
          gradient
        />
      </ScrollView>

      <Portal>
        <Dialog visible={showAddPlayer} onDismiss={() => setShowAddPlayer(false)}>
          <Dialog.Title>Add Player</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Player Name"
              value={newPlayer.name}
              onChangeText={(text) => setNewPlayer({ ...newPlayer, name: text })}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Jersey Number"
              value={newPlayer.number}
              onChangeText={(text) => setNewPlayer({ ...newPlayer, number: text })}
              mode="outlined"
              keyboardType="number-pad"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              title="Cancel"
              onPress={() => setShowAddPlayer(false)}
              variant="outline"
            />
            <Button
              title="Add"
              onPress={handleAddPlayer}
              disabled={!newPlayer.name || !newPlayer.number}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  teamSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  playersContainer: {
    marginBottom: SPACING.sm,
  },
  playersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  playersTitle: {
    fontSize: 16,
    color: COLORS.text,
  },
  playerChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  playerChip: {
    marginRight: SPACING.xs,
  },
  settingsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  settingsGrid: {
    gap: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    minWidth: 30,
    textAlign: 'center',
  },
  startButton: {
    marginBottom: SPACING.xl,
  },
  dialogInput: {
    marginBottom: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GameSetupScreen; 