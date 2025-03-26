import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@components/common/ThemedText';
import { ThemedView } from '@components/common/ThemedView';
import { COLORS, SPACING } from '@theme/index';
import { startNewGame } from '@store/slices/gameSlice';
import { uuidv4 } from '@utils/index';
import type { AppDispatch, Team, GameSettings, RootState } from '@types/index';
import TeamSetupComponent from '@components/game/TeamSetup';
import RNPickerSelect from 'react-native-picker-select';

export default function GameSetupScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.game);
  const { user } = useSelector((state: RootState) => state.auth);

  const [homeTeam, setHomeTeam] = useState<Team>({
    id: uuidv4(),
    name: '',
    players: [],
    timeoutsRemaining: 5,
    foulsInQuarter: 0,
    score: 0,
  });

  const [awayTeam, setAwayTeam] = useState<Team>({
    id: uuidv4(),
    name: '',
    players: [],
    timeoutsRemaining: 5,
    foulsInQuarter: 0,
    score: 0,
  });

  const [settings, setSettings] = useState<GameSettings>({
    quarterLength: 12,
    enableShotClock: true,
    shotClockDuration: 24,
    bonusEnabled: true,
  });

  const [selectedPosition, setSelectedPosition] = useState('');

  const positions = [
    { label: 'Point Guard', value: 'PG' },
    { label: 'Shooting Guard', value: 'SG' },
    { label: 'Small Forward', value: 'SF' },
    { label: 'Power Forward', value: 'PF' },
    { label: 'Center', value: 'C' },
  ];

  const handleStartGame = async () => {
    if (!homeTeam.name || !awayTeam.name || !user?.id) {
      return;
    }

    try {
      const gameData = {
        homeTeam,
        awayTeam,
        settings,
        currentQuarter: 1,
        timeRemaining: settings.quarterLength * 60,
        shotClockTime: settings.enableShotClock ? settings.shotClockDuration : undefined,
        isRunning: false,
        isPaused: false,
        userId: user.id,
        isTimeout: false,
        date: new Date().toISOString(),
        completed: false,
        playerPosition: selectedPosition,
      };

      await dispatch(startNewGame(gameData)).unwrap();
      router.push('/(tabs)/game/live' as any);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Game Setup</ThemedText>
        </View>

        <View style={styles.form}>
          <TeamSetupComponent
            team={homeTeam}
            onTeamChange={setHomeTeam}
            title="Home Team"
          />

          <View style={styles.divider} />

          <TeamSetupComponent
            team={awayTeam}
            onTeamChange={setAwayTeam}
            title="Away Team"
          />

          <View style={styles.divider} />

          <View style={styles.settings}>
            <ThemedText type="subtitle">Game Settings</ThemedText>

            <TextInput
              mode="outlined"
              label="Quarter Length (minutes)"
              value={settings.quarterLength.toString()}
              onChangeText={(value) => setSettings({
                ...settings,
                quarterLength: parseInt(value) || 12,
              })}
              keyboardType="numeric"
              style={styles.input}
            />

            <Button
              mode="outlined"
              onPress={() => setSettings({
                ...settings,
                enableShotClock: !settings.enableShotClock,
              })}
              style={styles.button}>
              Shot Clock: {settings.enableShotClock ? 'Enabled' : 'Disabled'}
            </Button>

            {settings.enableShotClock && (
              <TextInput
                mode="outlined"
                label="Shot Clock Duration (seconds)"
                value={settings.shotClockDuration.toString()}
                onChangeText={(value) => setSettings({
                  ...settings,
                  shotClockDuration: parseInt(value) || 24,
                })}
                keyboardType="numeric"
                style={styles.input}
              />
            )}
          </View>

          <RNPickerSelect
            onValueChange={(value) => setSelectedPosition(value)}
            items={positions}
            placeholder={{ label: 'Select a position', value: null }}
            style={{
              inputAndroid: styles.input,
              inputIOS: styles.input,
            }}
          />

          <Button
            mode="contained"
            onPress={handleStartGame}
            loading={loading}
            disabled={loading || !homeTeam.name || !awayTeam.name || !user?.id}
            style={[styles.button, styles.startButton]}>
            Start Game
          </Button>
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
  },
  header: {
    alignItems: 'center',
    marginVertical: SPACING.large,
  },
  form: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderDark,
    marginVertical: SPACING.large,
  },
  settings: {
    marginBottom: SPACING.large,
  },
  input: {
    marginBottom: SPACING.medium,
  },
  button: {
    marginBottom: SPACING.medium,
  },
  startButton: {
    marginTop: SPACING.large,
  },
});
