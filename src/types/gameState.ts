import { Game, GameSettings } from './game';

export interface GameState {
  currentGame: Game | null;
  gameHistory: Game[];
  loading: boolean;
  error: string | null;
}

export interface GameData extends Omit<Game, 'settings'> {
  settings: Partial<GameSettings>;
}
