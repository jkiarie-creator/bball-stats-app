import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doc, collection, addDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { GameState, GameData } from '@/types';

interface AsyncError {
  message: string;
  code?: string;
}

export const startNewGame = createAsyncThunk(
  'game/startNewGame',
  async (gameData: Omit<GameData, 'id'>, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, 'games'), gameData);
      return { ...gameData, id: docRef.id } as GameData;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to start new game';
      return rejectWithValue({
        message: errorMessage,
        code: error.code,
      } as AsyncError);
    }
  }
);

export const updateGameStats = createAsyncThunk(
  'game/updateGameStats',
  async (gameData: GameData, { rejectWithValue }) => {
    try {
      const { id, ...data } = gameData;
      if (!id) throw new Error('Game ID is required');
      
      await updateDoc(doc(db, 'games', id), data);
      return gameData;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update game stats';
      return rejectWithValue({
        message: errorMessage,
        code: error.code,
      } as AsyncError);
    }
  }
);

export const fetchGameHistory = createAsyncThunk(
  'game/fetchGameHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const q = query(collection(db, 'games'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const games: GameData[] = [];
      
      querySnapshot.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() } as GameData);
      });
      
      return games;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch game history';
      return rejectWithValue({
        message: errorMessage,
        code: error.code,
      } as AsyncError);
    }
  }
);

const initialState: GameState = {
  currentGame: null,
  gameHistory: [],
  loading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGameClock: (state, action: PayloadAction<number>) => {
      if (state.currentGame) {
        state.currentGame.timeRemaining = action.payload;
      }
    },
    updateShotClock: (state, action: PayloadAction<number | null>) => {
      if (state.currentGame) {
        state.currentGame.shotClockTime = action.payload;
      }
    },
    toggleGameClock: (state) => {
      if (state.currentGame) {
        state.currentGame.isRunning = !state.currentGame.isRunning;
      }
    },
    pauseGame: (state) => {
      if (state.currentGame) {
        state.currentGame.isPaused = true;
        state.currentGame.isRunning = false;
      }
    },
    resumeGame: (state) => {
      if (state.currentGame) {
        state.currentGame.isPaused = false;
        state.currentGame.isRunning = true;
      }
    },
    updateTeamScore: (state, action: PayloadAction<{ team: 'home' | 'away'; points: number }>) => {
      if (state.currentGame) {
        const { team, points } = action.payload;
        if (team === 'home') {
          state.currentGame.homeTeam.score += points;
        } else {
          state.currentGame.awayTeam.score += points;
        }
      }
    },
    updatePlayerStats: (state, action: PayloadAction<{
      team: 'home' | 'away';
      playerId: string;
      stats: Partial<Player['stats']>;
    }>) => {
      if (state.currentGame) {
        const { team, playerId, stats } = action.payload;
        const player = team === 'home' 
          ? state.currentGame.homeTeam.players.find(p => p.name === playerId)
          : state.currentGame.awayTeam.players.find(p => p.name === playerId);
        
        if (player) {
          Object.assign(player.stats, stats);
        }
      }
    },
    addTeamFoul: (state, action: PayloadAction<'home' | 'away'>) => {
      if (state.currentGame) {
        const team = action.payload;
        if (team === 'home') {
          state.currentGame.homeTeam.fouls += 1;
        } else {
          state.currentGame.awayTeam.fouls += 1;
        }
      }
    },
    resetQuarterFouls: (state) => {
      if (state.currentGame) {
        state.currentGame.homeTeam.fouls = 0;
        state.currentGame.awayTeam.fouls = 0;
      }
    },
    advanceQuarter: (state) => {
      if (state.currentGame) {
        state.currentGame.currentQuarter += 1;
        state.currentGame.timeRemaining = state.currentGame.settings.quarterLength * 60;
        state.currentGame.shotClockTime = state.currentGame.settings.enableShotClock 
          ? state.currentGame.settings.shotClockLength 
          : null;
        
        // Reset fouls for new quarter
        state.currentGame.homeTeam.fouls = 0;
        state.currentGame.awayTeam.fouls = 0;
      }
    },
    callTimeout: (state, action: PayloadAction<'home' | 'away'>) => {
      if (state.currentGame) {
        const team = action.payload;
        if (team === 'home' && state.currentGame.homeTeam.timeouts > 0) {
          state.currentGame.homeTeam.timeouts -= 1;
        } else if (team === 'away' && state.currentGame.awayTeam.timeouts > 0) {
          state.currentGame.awayTeam.timeouts -= 1;
        }
        
        state.currentGame.isPaused = true;
        state.currentGame.isRunning = false;
      }
    },
    resumeFromTimeout: (state) => {
      if (state.currentGame) {
        state.currentGame.isPaused = false;
        state.currentGame.isRunning = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startNewGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startNewGame.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGame = action.payload;
      })
      .addCase(startNewGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to start new game';
      })
      .addCase(updateGameStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGameStats.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGame = action.payload;
      })
      .addCase(updateGameStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update game stats';
      })
      .addCase(fetchGameHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.gameHistory = action.payload;
      })
      .addCase(fetchGameHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch game history';
      });
  },
});

export const {
  updateGameClock,
  updateShotClock,
  toggleGameClock,
  pauseGame,
  resumeGame,
  updateTeamScore,
  updatePlayerStats,
  addTeamFoul,
  resetQuarterFouls,
  advanceQuarter,
  callTimeout,
  resumeFromTimeout,
} = gameSlice.actions;

export default gameSlice.reducer;