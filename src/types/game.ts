export interface Player {
  name: string;
  stats: {
    points: number;
    assists: number;
    rebounds: number;
    steals: number;
    blocks: number;
    fouls: number;
    quarterStats: {
      [key: number]: {
        points: number;
        assists: number;
        rebounds: number;
        steals: number;
        blocks: number;
        fouls: number;
      };
    };
  };
}

export interface Team {
  id?: string;
  name: string;
  score: number;
  players: Player[];
  timeouts: number;
  fouls: number;
}

export interface GameSettings {
  quarterLength: number;
  shotClockLength: number;
  enableShotClock: boolean;
}

export interface GameData {
  id?: string;
  homeTeam: Team;
  awayTeam: Team;
  settings: GameSettings;
  startTime: string;
  endTime?: string;
  currentQuarter: number;
  timeRemaining: number;
  shotClockTime: number | null;
  isRunning: boolean;
  isPaused: boolean;
  userId?: string;
}

export interface GameState {
  currentGame: GameData | null;
  gameHistory: GameData[];
  loading: boolean;
  error: string | null;
}
