import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { COLORS, SPACING } from '@/theme';
import { useGameClock } from '@/hooks/useGameClock';
import { useShotClock } from '@/hooks/useShotClock';
import { useStats } from '@/hooks/useStats';
import { useSound } from '@/hooks/useSound';
import { useGameSync } from '@/hooks/useGameSync';
import { useAutoSave } from '@/hooks/useAutoSave';
import { QuarterManager } from '@/components/QuarterManager';
import { StatsTracker } from '@/components/StatsTracker';
import { ShotClock } from '@/components/ShotClock';
import { PlayerQuarterStats } from '@/components/PlayerQuarterStats';
import { QuarterSummary } from '@/components/QuarterSummary';
import { Substitutions } from '@/components/Substitutions';
import { TimeoutManager } from '@/components/TimeoutManager';
import { FoulManager } from '@/components/FoulManager';
import { VolumeControl } from '@/components/VolumeControl';
import type { RootState, AppDispatch } from '@/types';
import {
  updateGameClock,
  updateShotClock,
  toggleGameClock,
  pauseGame,
  resumeGame,
  updateTeamScore,
  updatePlayerStats,
  endGame,
  callTimeout,
  resumeFromTimeout,
  addTeamFoul,
  resetQuarterFouls,
} from '@/store/slices/gameSlice';

export default function LiveGameScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentGame } = useSelector((state: RootState) => state.game);
  const { gameClock, startClock, stopClock } = useGameClock();
  const { shotClock, resetShotClock, startShotClock, stopShotClock } = useShotClock();
  const { updateStats } = useStats();
  const { playBuzzer, playWarning } = useSound();

  // Initialize game sync and auto-save
  useGameSync();
  useAutoSave();

  useEffect(() => {
    if (!currentGame) {
      router.replace('./');
      return;
    }

    // Redirect to history if game is completed
    if (currentGame.completed) {
      router.replace('./history');
    }
  }, [currentGame, router]);

  if (!currentGame) {
    return null;
  }

  const handleGameClockTick = (time: number) => {
    dispatch(updateGameClock(time));
    if (time <= 0) {
      stopClock();
      playBuzzer();
    } else if (time <= 10) {
      playWarning();
    }
  };

  const handleShotClockTick = (time: number) => {
    dispatch(updateShotClock(time));
    if (time <= 0) {
      stopShotClock();
      playBuzzer();
    } else if (time <= 5) {
      playWarning();
    }
  };

  const handleToggleGameClock = () => {
    if (currentGame.isTimeout) return;
    
    dispatch(toggleGameClock());
    if (currentGame.isRunning) {
      stopClock();
      stopShotClock();
    } else {
      startClock();
      if (currentGame.settings.enableShotClock) {
        startShotClock();
      }
    }
  };

  const handleResetShotClock = () => {
    resetShotClock();
  };

  const handleTimeout = (teamId: string) => {
    dispatch(callTimeout(teamId));
    stopClock();
    stopShotClock();
    playBuzzer();
  };

  const handleResumeFromTimeout = () => {
    dispatch(resumeFromTimeout());
  };

  const handleTeamFoul = (teamId: string) => {
    dispatch(addTeamFoul(teamId));
    playWarning();
  };

  const handleResetFouls = () => {
    dispatch(resetQuarterFouls());
  };

  const handleEndGame = async () => {
    await dispatch(endGame(currentGame.id));
    router.replace('./history');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title">
              {currentGame.homeTeam.name} vs {currentGame.awayTeam.name}
            </ThemedText>
            <ThemedText type="subtitle">
              {currentGame.currentQuarter > 4 
                ? `Overtime ${currentGame.currentQuarter - 4}`
                : `Quarter ${currentGame.currentQuarter}`}
            </ThemedText>
          </View>

          <View style={styles.clockSection}>
            <QuarterManager
              currentQuarter={currentGame.currentQuarter}
              timeRemaining={currentGame.timeRemaining}
              isRunning={currentGame.isRunning}
              onToggle={handleToggleGameClock}
            />
            <ShotClock
              time={currentGame.shotClockTime || 0}
              isEnabled={currentGame.settings.enableShotClock}
              isRunning={currentGame.isRunning}
              onReset={handleResetShotClock}
            />
          </View>

          <View style={styles.timeoutSection}>
            <TimeoutManager
              homeTeam={currentGame.homeTeam}
              awayTeam={currentGame.awayTeam}
              onTimeout={handleTimeout}
              onResumeGame={handleResumeFromTimeout}
              isTimeoutActive={currentGame.isTimeout}
            />
          </View>

          <View style={styles.foulSection}>
            <FoulManager
              homeTeam={currentGame.homeTeam}
              awayTeam={currentGame.awayTeam}
              onFoul={handleTeamFoul}
              onResetFouls={handleResetFouls}
              isBonus={currentGame.settings.bonusEnabled}
            />
          </View>

          <View style={styles.scoreSection}>
            <StatsTracker
              homeTeam={currentGame.homeTeam}
              awayTeam={currentGame.awayTeam}
              onUpdateStats={updateStats}
            />
          </View>

          <View style={styles.playersSection}>
            <PlayerQuarterStats
              homeTeam={currentGame.homeTeam}
              awayTeam={currentGame.awayTeam}
              currentQuarter={currentGame.currentQuarter}
            />
          </View>

          <View style={styles.substitutionSection}>
            <Substitutions
              homeTeam={currentGame.homeTeam}
              awayTeam={currentGame.awayTeam}
            />
          </View>

          <View style={styles.summarySection}>
            <QuarterSummary
              homeTeam={currentGame.homeTeam}
              awayTeam={currentGame.awayTeam}
              currentQuarter={currentGame.currentQuarter}
            />
          </View>

          <View style={styles.controls}>
            <VolumeControl />
            <Button
              mode="contained"
              onPress={handleEndGame}
              style={styles.endButton}
              buttonColor={COLORS.error}>
              End Game
            </Button>
          </View>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.large,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  clockSection: {
    marginBottom: SPACING.large,
  },
  timeoutSection: {
    marginBottom: SPACING.large,
  },
  foulSection: {
    marginBottom: SPACING.large,
  },
  scoreSection: {
    marginBottom: SPACING.large,
  },
  playersSection: {
    marginBottom: SPACING.large,
  },
  substitutionSection: {
    marginBottom: SPACING.large,
  },
  summarySection: {
    marginBottom: SPACING.large,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.large,
  },
  endButton: {
    minWidth: 120,
  },
});
