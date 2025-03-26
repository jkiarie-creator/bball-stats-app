import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, IconButton, Portal, Dialog } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SPACING, SHADOWS } from '../../../src/theme';
import { Header, Button } from '../../../src/components/common';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootState, AppDispatch } from '../../../src/store';
import {
  updateGameClock,
  updateShotClock,
  toggleGameClock,
  pauseGame,
  resumeGame,
  updateTeamScore,
  updatePlayerStats,
  updateGameStats,
} from '../../../src/store/slices/gameSlice';
import {
  sendGameStarted,
  sendGameEnded,
  sendQuarterEnd,
  sendStatMilestone,
} from '../../../src/services/notifications';
import type { Team, Player, GameSettings, PlayerStats } from '../../../src/types';

// Extend the Game interface to include the properties needed in this component
interface ExtendedGame {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  status: 'upcoming' | 'live' | 'completed';
  quarter: number;
  timeRemaining: number;
  gameSettings: GameSettings;
  isRunning?: boolean;
  isPaused?: boolean;
  shotClock: number;
}

interface RouteParams {
  homeTeam: Team;
  awayTeam: Team;
  gameSettings: GameSettings;
}

interface LiveGameScreenProps {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ LiveGame: RouteParams }, 'LiveGame'>;
}

const LiveGameScreen: React.FC<LiveGameScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const currentGame = useSelector((state: RootState) => state.game.currentGame) as ExtendedGame | null;
  const settings = useSelector((state: RootState) => state.settings);
  const notifications = settings?.sound?.enabled; // Updated to use a property from settings that exists

  const [selectedPlayer, setSelectedPlayer] = useState<{
    team: 'home' | 'away';
    player: Player | null;
  }>({ team: 'home', player: null });

  const [showStatDialog, setShowStatDialog] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (currentGame?.isRunning && !gameStarted && notifications) {
      setGameStarted(true);
      if (currentGame.id) {
        sendGameStarted(currentGame.id);
      }
    }
  }, [currentGame?.isRunning, gameStarted, notifications]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentGame?.isRunning && !currentGame?.isPaused) {
      interval = setInterval(() => {
        dispatch(updateGameClock(currentGame.timeRemaining - 1));
        dispatch(updateShotClock(currentGame.shotClock - 1));

        if (currentGame.timeRemaining <= 0) {
          dispatch(pauseGame());
          if (notifications && currentGame.id) {
            if (currentGame.quarter < 4) {
              sendQuarterEnd(currentGame.id, currentGame.quarter);
            }
          }
        }

        if (currentGame.shotClock <= 0) {
          dispatch(updateShotClock(currentGame.gameSettings.shotClock));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [currentGame?.isRunning, currentGame?.isPaused, currentGame?.timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkStatMilestones = (
    player: Player,
    statType: keyof PlayerStats,
    newValue: number
  ) => {
    if (!notifications || !currentGame?.id) return;

    // Define milestone thresholds
    const milestones: Record<string, number[]> = {
      points: [10, 20, 30, 40, 50],
      rebounds: [5, 10, 15, 20],
      assists: [5, 10, 15],
      steals: [3, 5, 7],
      blocks: [3, 5, 7],
    };

    const statTypeStr = String(statType);
    
    if (milestones[statTypeStr] && milestones[statTypeStr].length > 0) {
      const playerStats = player.stats || { 
        points: 0, 
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0 
      };
      const currentValue = playerStats[statType] || 0;
      const newTotal = currentValue + newValue;

      for (const milestone of milestones[statTypeStr]) {
        if (currentValue < milestone && newTotal >= milestone) {
          sendStatMilestone(
            currentGame.id,
            player.name,
            `has reached ${milestone} ${statTypeStr}!`
          );
          break;
        }
      }

      // Check for triple-double
      const stats = { ...playerStats, [statType]: newTotal };
      const doubleDigits = Object.entries(stats)
        .filter(([key, val]) => 
          typeof val === 'number' && 
          val >= 10 && 
          ['points', 'rebounds', 'assists', 'steals', 'blocks'].includes(key)
        ).length;
      
      if (doubleDigits >= 3) {
        sendStatMilestone(
          currentGame.id,
          player.name,
          'has achieved a triple-double!'
        );
      }
    }
  };

  const handleStatUpdate = (statType: keyof PlayerStats, value: number) => {
    if (!selectedPlayer.player || !currentGame?.id) return;

    checkStatMilestones(selectedPlayer.player, statType, value);

    dispatch(
      updatePlayerStats({
        team: selectedPlayer.team,
        playerId: selectedPlayer.player.id,
        stats: { [statType]: value } as Partial<PlayerStats>,
      })
    );

    if (statType === 'points') {
      dispatch(
        updateTeamScore({
          team: selectedPlayer.team,
          points: value,
        })
      );
    }

    dispatch(
      updateGameStats({
        gameId: currentGame.id,
        updates: {
          [selectedPlayer.team === 'home' ? 'homeTeam' : 'awayTeam']:
            currentGame[selectedPlayer.team === 'home' ? 'homeTeam' : 'awayTeam'],
        },
      })
    );
  };

  const handleEndGame = async () => {
    if (!currentGame?.id || !user) return;

    await dispatch(
      updateGameStats({
        gameId: currentGame.id,
        updates: {
          status: 'completed',
          homeTeam: currentGame.homeTeam,
          awayTeam: currentGame.awayTeam,
        },
      })
    );

    if (notifications) {
      await sendGameEnded(
        currentGame.id,
        currentGame.homeTeam.name,
        currentGame.awayTeam.name,
        currentGame.homeTeam.score || 0,
        currentGame.awayTeam.score || 0
      );
    }

    navigation.goBack();
  };

  const renderScoreboard = () => (
    <View style={styles.scoreboard}>
      <View style={styles.teamScore}>
        <Text style={styles.teamName}>{currentGame?.homeTeam.name}</Text>
        <Text style={[styles.score, { color: currentGame?.homeTeam.color }]}>
          {currentGame?.homeTeam.score}
        </Text>
      </View>

      <View style={styles.gameInfo}>
        <Text style={styles.quarterText}>Q{currentGame?.quarter}</Text>
        <Text style={styles.timeText}>
          {formatTime(currentGame?.timeRemaining || 0)}
        </Text>
        <Text style={styles.shotClockText}>{currentGame?.shotClock}</Text>
      </View>

      <View style={styles.teamScore}>
        <Text style={styles.teamName}>{currentGame?.awayTeam.name}</Text>
        <Text style={[styles.score, { color: currentGame?.awayTeam.color }]}>
          {currentGame?.awayTeam.score}
        </Text>
      </View>
    </View>
  );

  const renderControls = () => (
    <View style={styles.controls}>
      <IconButton
        icon={currentGame?.isRunning ? 'pause' : 'play'}
        mode="contained"
        size={32}
        onPress={() => dispatch(toggleGameClock())}
      />
      <IconButton
        icon="refresh"
        mode="contained"
        size={32}
        onPress={() =>
          dispatch(
            updateShotClock(currentGame?.gameSettings.shotClock || 24)
          )
        }
      />
    </View>
  );

  const renderTeamStats = (team: Team, teamType: 'home' | 'away') => (
    <View style={[styles.teamStats, { backgroundColor: team.color + '10' }]}>
      <Text style={[styles.teamStatsTitle, { color: team.color }]}>
        {team.name}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {team.players.map((player: Player) => (
          <TouchableOpacity
            key={player.id}
            style={[
              styles.playerCard,
              player.isOnCourt && { borderColor: team.color },
            ]}
            onPress={() => {
              setSelectedPlayer({ team: teamType, player });
              setShowStatDialog(true);
            }}
          >
            <Text style={styles.playerNumber}>#{player.number}</Text>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerStats}>
              PTS: {player.stats?.points || 0} REB: {player.stats?.rebounds || 0}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (!currentGame) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Live Game" />
        <View style={styles.content}>
          <Text>Loading game...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Live Game"
        leftIcon="close"
        rightIcon="check"
        onLeftPress={() => navigation.goBack()}
        onRightPress={handleEndGame}
      />

      {renderScoreboard()}
      {renderControls()}

      <ScrollView style={styles.content}>
        {renderTeamStats(currentGame.homeTeam, 'home')}
        {renderTeamStats(currentGame.awayTeam, 'away')}
      </ScrollView>

      <Portal>
        <Dialog visible={showStatDialog} onDismiss={() => setShowStatDialog(false)}>
          <Dialog.Title>
            {selectedPlayer.player?.name} #{selectedPlayer.player?.number}
          </Dialog.Title>
          <Dialog.Content>
            <View style={styles.statButtons}>
              <Button
                title="+2 PTS"
                onPress={() => handleStatUpdate('points', 2)}
                style={styles.statButton}
              />
              <Button
                title="+3 PTS"
                onPress={() => handleStatUpdate('points', 3)}
                style={styles.statButton}
              />
              <Button
                title="AST"
                onPress={() => handleStatUpdate('assists', 1)}
                style={styles.statButton}
              />
              <Button
                title="REB"
                onPress={() => handleStatUpdate('rebounds', 1)}
                style={styles.statButton}
              />
              <Button
                title="STL"
                onPress={() => handleStatUpdate('steals', 1)}
                style={styles.statButton}
              />
              <Button
                title="BLK"
                onPress={() => handleStatUpdate('blocks', 1)}
                style={styles.statButton}
              />
              <Button
                title="TO"
                onPress={() => handleStatUpdate('turnovers', 1)}
                style={styles.statButton}
              />
              <Button
                title="FOUL"
                onPress={() => handleStatUpdate('fouls', 1)}
                style={styles.statButton}
              />
            </View>
          </Dialog.Content>
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
  scoreboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: 16,
    ...SHADOWS.medium,
  },
  teamScore: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  gameInfo: {
    alignItems: 'center',
  },
  quarterText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  shotClockText: {
    fontSize: 20,
    color: COLORS.text,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginVertical: SPACING.md,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  teamStats: {
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.md,
  },
  teamStatsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  playerCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginRight: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.light,
  },
  playerNumber: {
    fontSize: 16,
    color: COLORS.subtext,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: SPACING.xs,
  },
  playerStats: {
    fontSize: 12,
    color: COLORS.subtext,
  },
  statButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  statButton: {
    minWidth: 80,
  },
});

export default LiveGameScreen; 