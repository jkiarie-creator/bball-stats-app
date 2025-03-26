import { Game } from './game.service';

const SHOT_CLOCK_DURATION = 24; // Standard NBA shot clock duration in seconds
const SHOT_CLOCK_RESET_14 = 14; // Duration for offensive rebound reset

export interface ShotClockState {
  timeRemaining: number;
  isRunning: boolean;
  lastReset: number;
}

export const shotClockService = {
  initializeShotClock(): ShotClockState {
    return {
      timeRemaining: SHOT_CLOCK_DURATION,
      isRunning: false,
      lastReset: Date.now(),
    };
  },

  startShotClock(game: Game): Partial<Game> {
    if (game.status !== 'in_progress') {
      throw new Error('Cannot start shot clock when game is not in progress');
    }

    return {
      shotClock: {
        ...game.shotClock,
        isRunning: true,
        lastReset: Date.now(),
      },
    };
  },

  stopShotClock(game: Game): Partial<Game> {
    return {
      shotClock: {
        ...game.shotClock,
        isRunning: false,
      },
    };
  },

  resetShotClock(game: Game, duration: number = SHOT_CLOCK_DURATION): Partial<Game> {
    if (duration !== SHOT_CLOCK_DURATION && duration !== SHOT_CLOCK_RESET_14) {
      throw new Error('Invalid shot clock duration');
    }

    return {
      shotClock: {
        timeRemaining: duration,
        isRunning: game.shotClock.isRunning,
        lastReset: Date.now(),
      },
    };
  },

  updateShotClockTime(game: Game, elapsedMs: number): Partial<Game> {
    if (!game.shotClock.isRunning) {
      return {};
    }

    const newTimeRemaining = Math.max(0, game.shotClock.timeRemaining - (elapsedMs / 1000));
    
    return {
      shotClock: {
        ...game.shotClock,
        timeRemaining: Number(newTimeRemaining.toFixed(1)),
        isRunning: newTimeRemaining > 0,
      },
    };
  },

  handleShotClockViolation(game: Game): Partial<Game> {
    return {
      shotClock: {
        timeRemaining: SHOT_CLOCK_DURATION,
        isRunning: false,
        lastReset: Date.now(),
      },
    };
  },

  handleOffensiveRebound(game: Game): Partial<Game> {
    return this.resetShotClock(game, SHOT_CLOCK_RESET_14);
  },

  handleDefensiveRebound(game: Game): Partial<Game> {
    return this.resetShotClock(game, SHOT_CLOCK_DURATION);
  },

  handleShotAttempt(game: Game, made: boolean): Partial<Game> {
    return {
      shotClock: {
        timeRemaining: SHOT_CLOCK_DURATION,
        isRunning: false,
        lastReset: Date.now(),
      },
    };
  },

  handleTurnover(game: Game): Partial<Game> {
    return this.resetShotClock(game, SHOT_CLOCK_DURATION);
  },

  handleFoul(game: Game): Partial<Game> {
    return this.resetShotClock(game, SHOT_CLOCK_DURATION);
  },
}; 