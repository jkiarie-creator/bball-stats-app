import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../../src/theme';
import { Header, Button } from '../../../src/components/common';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { GameStackParamList } from '../../../src/navigation/AppNavigator';
import type { Team, Player, GameSettings } from '../../../src/types';

type Props = {
  navigation: NativeStackNavigationProp<GameStackParamList, 'NewGame'>;
};

const NewGameScreen: React.FC<Props> = ({ navigation }) => {
  const [homeTeam, setHomeTeam] = useState<Team>({
    name: '',
    color: COLORS.primary,
    players: [],
    score: 0,
    fouls: 0,
    timeouts: 4,
  });

  const [awayTeam, setAwayTeam] = useState<Team>({
    name: '',
    color: COLORS.secondary,
    players: [],
    score: 0,
    fouls: 0,
    timeouts: 4,
  });

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    minutesPerQuarter: 12,
    shotClock: 24,
  });

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    number: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addPlayer = (team: 'home' | 'away') => {
    if (!newPlayer.name || !newPlayer.number) return;

    const player: Player = {
      id: Date.now().toString(),
      name: newPlayer.name,
      number: newPlayer.number,
      stats: {
        points: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
      },
      isOnCourt: false,
    };

    if (team === 'home') {
      setHomeTeam((prev: Team) => ({
        ...prev,
        players: [...prev.players, player],
      }));
    } else {
      setAwayTeam((prev: Team) => ({
        ...prev,
        players: [...prev.players, player],
      }));
    }

    setNewPlayer({ name: '', number: '' });
  };

  const startGame = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <Header title="New Game" />
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Home Team
          </Text>
          <TextInput
            label="Team Name"
            value={homeTeam.name}
            onChangeText={(name: string) => setHomeTeam((prev: Team) => ({ ...prev, name }))}
            style={styles.input}
          />
          <View style={styles.playerInput}>
            <TextInput
              label="Player Name"
              value={newPlayer.name}
              onChangeText={(name: string) => setNewPlayer(prev => ({ ...prev, name }))}
              style={[styles.input, { flex: 2 }]}
            />
            <TextInput
              label="Number"
              value={newPlayer.number}
              onChangeText={(number: string) => setNewPlayer(prev => ({ ...prev, number }))}
              style={[styles.input, { flex: 1, marginLeft: SPACING.sm }]}
              keyboardType="number-pad"
            />
            <IconButton
              icon="plus"
              mode="contained"
              onPress={() => addPlayer('home')}
              style={styles.addButton}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {homeTeam.players.map((player: Player) => (
              <View key={player.id} style={styles.playerCard}>
                <Text style={styles.playerNumber}>#{player.number}</Text>
                <Text style={styles.playerName}>{player.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Away Team
          </Text>
          <TextInput
            label="Team Name"
            value={awayTeam.name}
            onChangeText={(name: string) => setAwayTeam((prev: Team) => ({ ...prev, name }))}
            style={styles.input}
          />
          <View style={styles.playerInput}>
            <TextInput
              label="Player Name"
              value={newPlayer.name}
              onChangeText={(name: string) => setNewPlayer(prev => ({ ...prev, name }))}
              style={[styles.input, { flex: 2 }]}
            />
            <TextInput
              label="Number"
              value={newPlayer.number}
              onChangeText={(number: string) => setNewPlayer(prev => ({ ...prev, number }))}
              style={[styles.input, { flex: 1, marginLeft: SPACING.sm }]}
              keyboardType="number-pad"
            />
            <IconButton
              icon="plus"
              mode="contained"
              onPress={() => addPlayer('away')}
              style={styles.addButton}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {awayTeam.players.map((player: Player) => (
              <View key={player.id} style={styles.playerCard}>
                <Text style={styles.playerNumber}>#{player.number}</Text>
                <Text style={styles.playerName}>{player.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Game Settings
          </Text>
          <View style={styles.settingsRow}>
            <TextInput
              label="Minutes per Quarter"
              value={gameSettings.minutesPerQuarter.toString()}
              onChangeText={(value: string) => 
                setGameSettings((prev: GameSettings) => ({
                  ...prev,
                  minutesPerQuarter: parseInt(value) || 0,
                }))
              }
              style={[styles.input, { flex: 1 }]}
              keyboardType="number-pad"
            />
            <TextInput
              label="Shot Clock"
              value={gameSettings.shotClock.toString()}
              onChangeText={(value: string) => 
                setGameSettings((prev: GameSettings) => ({
                  ...prev,
                  shotClock: parseInt(value) || 0,
                }))
              }
              style={[styles.input, { flex: 1, marginLeft: SPACING.sm }]}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Button
          title="Start Game"
          onPress={startGame}
          style={styles.startButton}
        />
      </ScrollView>
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
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  input: {
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  playerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  addButton: {
    marginLeft: SPACING.sm,
  },
  playerCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    minWidth: 100,
  },
  playerNumber: {
    fontSize: 16,
    color: COLORS.subtext,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButton: {
    marginVertical: SPACING.lg,
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

export default NewGameScreen; 