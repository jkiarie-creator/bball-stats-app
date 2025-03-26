import { useState, useEffect, useCallback } from 'react';
import { Game } from '../services/game.service';
import { shotClockService } from '../services/shotClock.service';

const UPDATE_INTERVAL = 100; // Update every 100ms for smooth countdown

export const useShotClock = (game: Game, onUpdate: (update: Partial<Game>) => void) => {
  const [lastTick, setLastTick] = useState<number>(Date.now());

  const updateClock = useCallback(() => {
    if (!game.shotClock.isRunning) {
      return;
    }

    const now = Date.now();
    const elapsed = now - lastTick;
    
    const update = shotClockService.updateShotClockTime(game, elapsed);
    
    if (Object.keys(update).length > 0) {
      onUpdate(update);
      
      // If shot clock reached zero, handle violation
      if (update.shotClock?.timeRemaining === 0) {
        const violationUpdate = shotClockService.handleShotClockViolation(game);
        onUpdate(violationUpdate);
      }
    }
    
    setLastTick(now);
  }, [game, lastTick, onUpdate]);

  useEffect(() => {
    const intervalId = setInterval(updateClock, UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [updateClock]);

  const startClock = useCallback(() => {
    const update = shotClockService.startShotClock(game);
    onUpdate(update);
    setLastTick(Date.now());
  }, [game, onUpdate]);

  const stopClock = useCallback(() => {
    const update = shotClockService.stopShotClock(game);
    onUpdate(update);
  }, [game, onUpdate]);

  const resetClock = useCallback((duration?: number) => {
    const update = shotClockService.resetShotClock(game, duration);
    onUpdate(update);
    setLastTick(Date.now());
  }, [game, onUpdate]);

  const handleOffensiveRebound = useCallback(() => {
    const update = shotClockService.handleOffensiveRebound(game);
    onUpdate(update);
    setLastTick(Date.now());
  }, [game, onUpdate]);

  const handleDefensiveRebound = useCallback(() => {
    const update = shotClockService.handleDefensiveRebound(game);
    onUpdate(update);
    setLastTick(Date.now());
  }, [game, onUpdate]);

  const handleShotAttempt = useCallback((made: boolean) => {
    const update = shotClockService.handleShotAttempt(game, made);
    onUpdate(update);
    setLastTick(Date.now());
  }, [game, onUpdate]);

  const handleTurnover = useCallback(() => {
    const update = shotClockService.handleTurnover(game);
    onUpdate(update);
    setLastTick(Date.now());
  }, [game, onUpdate]);

  const handleFoul = useCallback(() => {
    const update = shotClockService.handleFoul(game);
    onUpdate(update);
    setLastTick(Date.now());
  }, [game, onUpdate]);

  return {
    startClock,
    stopClock,
    resetClock,
    handleOffensiveRebound,
    handleDefensiveRebound,
    handleShotAttempt,
    handleTurnover,
    handleFoul,
    isRunning: game.shotClock.isRunning,
    timeRemaining: game.shotClock.timeRemaining,
  };
}; 