import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSound } from './useSound';
import {
  updateGameClock,
  updateShotClock,
  endGame,
  advanceQuarter,
} from '@/store/slices/gameSlice';
import type { RootState, AppDispatch } from '@/store';

export function useGameClock() {
  const dispatch = useDispatch<AppDispatch>();
  const currentGame = useSelector((state: RootState) => state.game.currentGame);
  const { playBuzzer, playWarning } = useSound();
  const lastTickRef = useRef<number>(Date.now());
  const lastWarningRef = useRef<boolean>(false);

  const startClock = useCallback(() => {
    if (!currentGame) return;
    lastTickRef.current = Date.now();
  }, [currentGame]);

  const stopClock = useCallback(() => {
    if (!currentGame) return;
    lastTickRef.current = Date.now();
  }, [currentGame]);

  useEffect(() => {
    if (!currentGame || !currentGame.isRunning) {
      lastTickRef.current = Date.now();
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = Math.floor((now - lastTickRef.current) / 1000);
      
      if (deltaSeconds > 0) {
        const newTimeRemaining = Math.max(0, currentGame.timeRemaining - deltaSeconds);
        const newShotClockTime = currentGame.settings.enableShotClock
          ? Math.max(0, (currentGame.shotClockTime || 0) - deltaSeconds)
          : null;

        // Play warning sound at 24 seconds remaining in quarter
        if (newTimeRemaining <= 24 && !lastWarningRef.current) {
          playWarning();
          lastWarningRef.current = true;
        }

        // Reset warning flag when time goes above 24 seconds
        if (newTimeRemaining > 24) {
          lastWarningRef.current = false;
        }

        // Play buzzer when shot clock expires
        if (
          currentGame.settings.enableShotClock &&
          currentGame.shotClockTime &&
          currentGame.shotClockTime > 0 &&
          newShotClockTime === 0
        ) {
          playBuzzer();
        }

        // Play buzzer when quarter ends
        if (currentGame.timeRemaining > 0 && newTimeRemaining === 0) {
          playBuzzer();
          
          // Handle quarter transition
          if (currentGame.currentQuarter === 4) {
            // Check if game should end or go to overtime
            if (currentGame.homeTeam.score !== currentGame.awayTeam.score) {
              dispatch(endGame(currentGame.id));
            } else {
              dispatch(advanceQuarter());
            }
          } else {
            // Advance to next quarter
            dispatch(advanceQuarter());
          }
        }

        // Update game clock
        dispatch(updateGameClock(newTimeRemaining));

        // Update shot clock if enabled
        if (currentGame.settings.enableShotClock && newShotClockTime !== null) {
          dispatch(updateShotClock(newShotClockTime));
        }

        lastTickRef.current = now;
      }
    }, 100); // Update every 100ms for smooth countdown

    return () => clearInterval(interval);
  }, [
    currentGame,
    dispatch,
    playBuzzer,
    playWarning,
  ]);

  return {
    startClock,
    stopClock,
    gameClock: currentGame?.timeRemaining || 0,
    isRunning: currentGame?.isRunning || false,
    isComplete: currentGame?.completed || false,
  };
}