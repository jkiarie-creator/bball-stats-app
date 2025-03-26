import { Timestamp } from 'firebase/firestore';
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';

export interface PlayerStats {
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
}

export interface Player {
  id: string;
  name: string;
  number: string;
  stats?: PlayerStats;
  isOnCourt?: boolean;
}

export interface Team {
  name: string;
  color: string;
  players: Player[];
  score?: number;
  fouls?: number;
  timeouts?: number;
}

export interface GameSettings {
  minutesPerQuarter: number;
  shotClock: number;
  quarters?: number;
  quarterLength?: number;
  enableShotClock?: boolean;
  shotClockDuration?: number;
  bonusEnabled?: boolean;
}

export type GameStatus = 'upcoming' | 'live' | 'completed';

export interface GameEvent {
  id: string;
  type: string;
  playerId: string;
  teamId: string;
  timestamp: number;
  quarter: number;
  timeRemaining: number;
  value: number;
  description: string;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  status: GameStatus;
  currentQuarter: number;
  timeRemaining: number;
  gameSettings: GameSettings;
  events: GameEvent[];
}

export interface AuthState {
  user: {
    id: string;
    email: string;
    displayName?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface GameState {
  currentGame: Game | null;
  gameHistory: Game[];
  loading: boolean;
  error: string | null;
}

export interface SettingsState {
  theme: 'light' | 'dark';
  sound: {
    enabled: boolean;
    volume: number;
  };
  vibration: {
    enabled: boolean;
    intensity: number;
  };
  autoSave: boolean;
}

export interface RootState {
  auth: AuthState;
  game: GameState;
  settings: SettingsState;
}

export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction> & Dispatch<AnyAction>;

export interface GameData {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string; 
  status: GameStatus;
  quarter: number;
  timeRemaining: number;
  gameSettings: GameSettings;
  isRunning?: boolean;
  isPaused?: boolean;
  shotClock?: number;
  shotClockTime?: number;
  completed?: boolean;
  events?: GameEvent[];
}