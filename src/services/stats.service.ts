import { Game, Player } from './game.service';

export type StatType = 
  | 'points' 
  | 'rebounds' 
  | 'assists' 
  | 'steals' 
  | 'blocks' 
  | 'fouls'
  | 'freeThrowsMade'
  | 'freeThrowsAttempted'
  | 'fieldGoalsMade'
  | 'fieldGoalsAttempted'
  | 'threePointersMade'
  | 'threePointersAttempted'
  | 'turnovers'
  | 'offensiveRebounds'
  | 'defensiveRebounds'
  | 'shootingPercentage'
  | 'threePointPercentage'
  | 'freeThrowPercentage';

export interface StatUpdate {
  playerId: string;
  teamType: 'homeTeam' | 'awayTeam';
  statType: StatType;
  value: number;
  timestamp: number;
}

export interface PlayerStats extends Record<StatType, number> {
  efficiency: number;
  shootingPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
}

export const statsService = {
  initializePlayerStats(): PlayerStats {
    return {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      fouls: 0,
      freeThrowsMade: 0,
      freeThrowsAttempted: 0,
      fieldGoalsMade: 0,
      fieldGoalsAttempted: 0,
      threePointersMade: 0,
      threePointersAttempted: 0,
      turnovers: 0,
      offensiveRebounds: 0,
      defensiveRebounds: 0,
      efficiency: 0,
      shootingPercentage: 0,
      threePointPercentage: 0,
      freeThrowPercentage: 0,
    };
  },

  updateStats(game: Game, update: StatUpdate): Partial<Game> {
    const team = game[update.teamType];
    const player = team.players.find(p => p.id === update.playerId);

    if (!player) {
      throw new Error('Player not found');
    }

    const updatedPlayers = team.players.map(p => {
      if (p.id === update.playerId) {
        const updatedStats = {
          ...p.stats,
          [update.statType]: (p.stats[update.statType as keyof typeof p.stats] || 0) + update.value
        };

        // Update derived stats
        if (update.statType === 'rebounds') {
          updatedStats.rebounds = Math.max(0, updatedStats.rebounds);
        }
        if (['fieldGoalsMade', 'fieldGoalsAttempted', 'threePointersMade', 'threePointersAttempted', 'freeThrowsMade', 'freeThrowsAttempted'].includes(update.statType)) {
          updatedStats.shootingPercentage = updatedStats.fieldGoalsAttempted > 0 
            ? (updatedStats.fieldGoalsMade / updatedStats.fieldGoalsAttempted) * 100 
            : 0;
          updatedStats.threePointPercentage = updatedStats.threePointersAttempted > 0 
            ? (updatedStats.threePointersMade / updatedStats.threePointersAttempted) * 100 
            : 0;
          updatedStats.freeThrowPercentage = updatedStats.freeThrowsAttempted > 0 
            ? (updatedStats.freeThrowsMade / updatedStats.freeThrowsAttempted) * 100 
            : 0;
        }

        // Calculate efficiency rating
        updatedStats.efficiency = this.calculateEfficiency(updatedStats);

        return { ...p, stats: updatedStats };
      }
      return p;
    });

    // Update team score if points were added/subtracted
    let score = team.score;
    if (update.statType === 'points') {
      score = Math.max(0, score + update.value);
    }

    return {
      [update.teamType]: {
        ...team,
        players: updatedPlayers,
        score,
      },
    };
  },

  calculateEfficiency(stats: PlayerStats): number {
    return (
      (stats.points + stats.rebounds + stats.assists + stats.steals + stats.blocks) -
      ((stats.fieldGoalsAttempted - stats.fieldGoalsMade) +
        (stats.freeThrowsAttempted - stats.freeThrowsMade) +
        stats.turnovers)
    );
  },

  getTeamStats(game: Game, teamType: 'homeTeam' | 'awayTeam'): PlayerStats {
    const team = game[teamType];
    return team.players.reduce((acc, player) => {
      Object.keys(player.stats).forEach(key => {
        const statKey = key as keyof PlayerStats;
        acc[statKey] = (acc[statKey] || 0) + (player.stats[statKey] || 0);
      });
      return acc;
    }, this.initializePlayerStats());
  },

  getPlayerStats(game: Game, teamType: 'homeTeam' | 'awayTeam', playerId: string): PlayerStats | null {
    const player = game[teamType].players.find(p => p.id === playerId);
    return player ? player.stats : null;
  },

  getLeadingScorer(game: Game): { player: Player; teamType: 'homeTeam' | 'awayTeam' } | null {
    let maxPoints = -1;
    let leadingScorer: Player | null = null;
    let scorerTeam: 'homeTeam' | 'awayTeam' | null = null;

    ['homeTeam', 'awayTeam'].forEach((teamType) => {
      const team = game[teamType as 'homeTeam' | 'awayTeam'];
      team.players.forEach(player => {
        if (player.stats.points > maxPoints) {
          maxPoints = player.stats.points;
          leadingScorer = player;
          scorerTeam = teamType as 'homeTeam' | 'awayTeam';
        }
      });
    });

    return leadingScorer && scorerTeam 
      ? { player: leadingScorer, teamType: scorerTeam }
      : null;
  },

  formatStat(value: number, statType: StatType): string {
    if (['shootingPercentage', 'threePointPercentage', 'freeThrowPercentage'].includes(statType)) {
      return `${value.toFixed(1)}%`;
    }
    return value.toString();
  },

  getStatDisplay(stat: StatType): string {
    const displayMap: Record<StatType, string> = {
      points: 'PTS',
      rebounds: 'REB',
      assists: 'AST',
      steals: 'STL',
      blocks: 'BLK',
      fouls: 'PF',
      freeThrowsMade: 'FTM',
      freeThrowsAttempted: 'FTA',
      fieldGoalsMade: 'FGM',
      fieldGoalsAttempted: 'FGA',
      threePointersMade: '3PM',
      threePointersAttempted: '3PA',
      turnovers: 'TO',
      offensiveRebounds: 'OREB',
      defensiveRebounds: 'DREB',
      shootingPercentage: 'FG%',
      threePointPercentage: '3P%',
      freeThrowPercentage: 'FT%',
    };
    return displayMap[stat] || stat;
  },
}; 