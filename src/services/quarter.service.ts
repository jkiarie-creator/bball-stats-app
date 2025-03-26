import { Game, Player, QuarterStats } from './game.service';

export interface QuarterConfig {
  duration: number; // Duration in seconds
  overtimeDuration: number; // Duration in seconds for overtime periods
  shotClockDuration: number; // Shot clock duration in seconds
}

export const defaultQuarterConfig: QuarterConfig = {
  duration: 600, // 10 minutes
  overtimeDuration: 300, // 5 minutes
  shotClockDuration: 24,
};

export const quarterService = {
  isQuarterComplete(game: Game): boolean {
    return game.timeRemaining <= 0;
  },

  isGameComplete(game: Game): boolean {
    return game.quarter > 4 && game.homeTeam.score !== game.awayTeam.score;
  },

  isOvertime(game: Game): boolean {
    return game.quarter > 4;
  },

  getQuarterDuration(game: Game): number {
    return this.isOvertime(game) 
      ? defaultQuarterConfig.overtimeDuration 
      : defaultQuarterConfig.duration;
  },

  startNewQuarter(game: Game): Partial<Game> {
    const isOvertime = this.isOvertime(game);
    const newQuarter = game.quarter + 1;
    const duration = this.getQuarterDuration(game);

    // Save current quarter stats before starting new quarter
    const currentStats = this.calculateQuarterStats(game, game.quarter);
    const updatedQuarterStats = [...game.quarterStats];
    updatedQuarterStats[game.quarter - 1] = currentStats;

    // Add empty stats for new quarter
    updatedQuarterStats.push(this.createEmptyStats());

    return {
      quarter: newQuarter,
      timeRemaining: duration,
      shotClock: {
        timeRemaining: defaultQuarterConfig.shotClockDuration,
        isRunning: false,
        lastReset: Date.now(),
      },
      status: newQuarter > 4 ? 'overtime' : game.status,
      quarterStats: updatedQuarterStats,
    };
  },

  startOvertime(game: Game): Partial<Game> {
    if (game.homeTeam.score !== game.awayTeam.score) {
      return {
        status: 'completed',
      };
    }

    return this.startNewQuarter(game);
  },

  formatQuarterDisplay(quarter: number): string {
    if (quarter <= 4) {
      return `Q${quarter}`;
    }
    return `OT${quarter - 4}`;
  },

  getQuarterStatus(game: Game): string {
    if (game.status === 'completed') {
      return 'Final';
    }
    if (game.status === 'overtime') {
      return `Overtime ${game.quarter - 4}`;
    }
    return `Quarter ${game.quarter}`;
  },

  calculateQuarterStats(game: Game, quarter: number): QuarterStats {
    const calculateTeamStats = (players: Player[]) => {
      return players.reduce((acc, player) => ({
        score: acc.score + player.stats.points,
        fieldGoalsMade: acc.fieldGoalsMade + player.stats.fieldGoalsMade,
        fieldGoalsAttempted: acc.fieldGoalsAttempted + player.stats.fieldGoalsAttempted,
        threePointersMade: acc.threePointersMade + player.stats.threePointersMade,
        threePointersAttempted: acc.threePointersAttempted + player.stats.threePointersAttempted,
        freeThrowsMade: acc.freeThrowsMade + player.stats.freeThrowsMade,
        freeThrowsAttempted: acc.freeThrowsAttempted + player.stats.freeThrowsAttempted,
        rebounds: acc.rebounds + player.stats.rebounds,
        turnovers: acc.turnovers + player.stats.turnovers,
      }), {
        score: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        turnovers: 0,
      });
    };

    return {
      homeTeam: calculateTeamStats(game.homeTeam.players),
      awayTeam: calculateTeamStats(game.awayTeam.players),
    };
  },

  formatQuarterSummary(stats: QuarterStats): string {
    const formatTeamStats = (team: QuarterStats['homeTeam']) => {
      const fgPercentage = team.fieldGoalsAttempted > 0 
        ? ((team.fieldGoalsMade / team.fieldGoalsAttempted) * 100).toFixed(1)
        : '0.0';
      const threePointPercentage = team.threePointersAttempted > 0
        ? ((team.threePointersMade / team.threePointersAttempted) * 100).toFixed(1)
        : '0.0';
      const ftPercentage = team.freeThrowsAttempted > 0
        ? ((team.freeThrowsMade / team.freeThrowsAttempted) * 100).toFixed(1)
        : '0.0';

      return `
Score: ${team.score}
FG: ${team.fieldGoalsMade}/${team.fieldGoalsAttempted} (${fgPercentage}%)
3PT: ${team.threePointersMade}/${team.threePointersAttempted} (${threePointPercentage}%)
FT: ${team.freeThrowsMade}/${team.freeThrowsAttempted} (${ftPercentage}%)
REB: ${team.rebounds}
TO: ${team.turnovers}`;
    };

    return `Home Team:${formatTeamStats(stats.homeTeam)}
Away Team:${formatTeamStats(stats.awayTeam)}`;
  },

  getQuarterStats(game: Game, quarter: number): QuarterStats | null {
    if (quarter < 1 || quarter > game.quarterStats.length) return null;
    return game.quarterStats[quarter - 1];
  },

  calculateQuarterTotals(game: Game): QuarterStats {
    return game.quarterStats.reduce((totals, quarterStats) => ({
      homeTeam: {
        score: totals.homeTeam.score + quarterStats.homeTeam.score,
        fieldGoalsMade: totals.homeTeam.fieldGoalsMade + quarterStats.homeTeam.fieldGoalsMade,
        fieldGoalsAttempted: totals.homeTeam.fieldGoalsAttempted + quarterStats.homeTeam.fieldGoalsAttempted,
        threePointersMade: totals.homeTeam.threePointersMade + quarterStats.homeTeam.threePointersMade,
        threePointersAttempted: totals.homeTeam.threePointersAttempted + quarterStats.homeTeam.threePointersAttempted,
        freeThrowsMade: totals.homeTeam.freeThrowsMade + quarterStats.homeTeam.freeThrowsMade,
        freeThrowsAttempted: totals.homeTeam.freeThrowsAttempted + quarterStats.homeTeam.freeThrowsAttempted,
        rebounds: totals.homeTeam.rebounds + quarterStats.homeTeam.rebounds,
        turnovers: totals.homeTeam.turnovers + quarterStats.homeTeam.turnovers,
      },
      awayTeam: {
        score: totals.awayTeam.score + quarterStats.awayTeam.score,
        fieldGoalsMade: totals.awayTeam.fieldGoalsMade + quarterStats.awayTeam.fieldGoalsMade,
        fieldGoalsAttempted: totals.awayTeam.fieldGoalsAttempted + quarterStats.awayTeam.fieldGoalsAttempted,
        threePointersMade: totals.awayTeam.threePointersMade + quarterStats.awayTeam.threePointersMade,
        threePointersAttempted: totals.awayTeam.threePointersAttempted + quarterStats.awayTeam.threePointersAttempted,
        freeThrowsMade: totals.awayTeam.freeThrowsMade + quarterStats.awayTeam.freeThrowsMade,
        freeThrowsAttempted: totals.awayTeam.freeThrowsAttempted + quarterStats.awayTeam.freeThrowsAttempted,
        rebounds: totals.awayTeam.rebounds + quarterStats.awayTeam.rebounds,
        turnovers: totals.awayTeam.turnovers + quarterStats.awayTeam.turnovers,
      },
    }), this.createEmptyStats());
  },

  createEmptyStats(): QuarterStats {
    return {
      homeTeam: {
        score: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        turnovers: 0,
      },
      awayTeam: {
        score: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        turnovers: 0,
      },
    };
  },
}; 