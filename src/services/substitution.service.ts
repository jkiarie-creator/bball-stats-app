import { Game, Player } from './game.service';

const MAX_ACTIVE_PLAYERS = 5;

export interface SubstitutionError {
  message: string;
  type: 'MAX_PLAYERS' | 'PLAYER_NOT_FOUND' | 'ALREADY_ACTIVE' | 'ALREADY_BENCHED';
}

export const substitutionService = {
  validateSubstitution(
    game: Game,
    teamType: 'homeTeam' | 'awayTeam',
    incomingPlayerId: string,
    outgoingPlayerId: string
  ): SubstitutionError | null {
    const team = game[teamType];
    
    // Check if players exist
    const incomingPlayer = team.players.find(p => p.id === incomingPlayerId);
    const outgoingPlayer = team.players.find(p => p.id === outgoingPlayerId);
    
    if (!incomingPlayer || !outgoingPlayer) {
      return {
        message: 'Player not found',
        type: 'PLAYER_NOT_FOUND'
      };
    }

    // Check if incoming player is already active
    if (team.activePlayers.includes(incomingPlayerId)) {
      return {
        message: 'Player is already on the court',
        type: 'ALREADY_ACTIVE'
      };
    }

    // Check if outgoing player is already benched
    if (!team.activePlayers.includes(outgoingPlayerId)) {
      return {
        message: 'Player is already on the bench',
        type: 'ALREADY_BENCHED'
      };
    }

    return null;
  },

  makeSubstitution(
    game: Game,
    teamType: 'homeTeam' | 'awayTeam',
    incomingPlayerId: string,
    outgoingPlayerId: string
  ): Partial<Game> {
    const error = this.validateSubstitution(game, teamType, incomingPlayerId, outgoingPlayerId);
    if (error) {
      throw new Error(error.message);
    }

    const now = Date.now();
    const team = game[teamType];
    
    // Update active players list
    const newActivePlayers = [...team.activePlayers];
    const outgoingIndex = newActivePlayers.indexOf(outgoingPlayerId);
    newActivePlayers.splice(outgoingIndex, 1);
    newActivePlayers.push(incomingPlayerId);

    // Update player stats
    const updatedPlayers = team.players.map(player => {
      if (player.id === incomingPlayerId) {
        return {
          ...player,
          isActive: true,
          lastSubstitution: now,
        };
      }
      if (player.id === outgoingPlayerId) {
        const timeInGame = player.timeInGame || 0;
        const lastSubTime = player.lastSubstitution || game.lastSubstitutionTime || now;
        return {
          ...player,
          isActive: false,
          timeInGame: timeInGame + (now - lastSubTime) / 1000,
          lastSubstitution: now,
        };
      }
      return player;
    });

    return {
      [teamType]: {
        ...team,
        players: updatedPlayers,
        activePlayers: newActivePlayers,
      },
      lastSubstitutionTime: now,
    };
  },

  initializeTeamLineup(team: Game['homeTeam'] | Game['awayTeam']): string[] {
    // Sort players by position to create a sensible starting lineup
    const sortedPlayers = [...team.players].sort((a, b) => {
      const positionOrder = {
        'PG': 1, 'SG': 2, 'SF': 3, 'PF': 4, 'C': 5,
        undefined: 6 // For players without a position
      };
      const posA = positionOrder[a.position as keyof typeof positionOrder];
      const posB = positionOrder[b.position as keyof typeof positionOrder];
      return posA - posB;
    });

    // Take the first 5 players
    const starters = sortedPlayers.slice(0, MAX_ACTIVE_PLAYERS);
    return starters.map(player => player.id);
  },

  getActivePlayersWithStats(game: Game, teamType: 'homeTeam' | 'awayTeam'): Player[] {
    const team = game[teamType];
    return team.players.filter(player => team.activePlayers.includes(player.id));
  },

  getBenchedPlayersWithStats(game: Game, teamType: 'homeTeam' | 'awayTeam'): Player[] {
    const team = game[teamType];
    return team.players.filter(player => !team.activePlayers.includes(player.id));
  },

  getPlayerTimeInGame(player: Player, game: Game): number {
    if (!player.lastSubstitution) {
      return 0;
    }

    const now = Date.now();
    const baseTime = player.timeInGame || 0;
    
    if (player.isActive) {
      return baseTime + (now - player.lastSubstitution) / 1000;
    }
    
    return baseTime;
  },

  formatPlayTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },
}; 