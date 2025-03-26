import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { syncManager } from './sync.service';
import { cacheService } from './cache.service';
import NetInfo from '@react-native-community/netinfo';

export interface PlayerQuarterStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fouls: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  turnovers: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  efficiency: number;
  timePlayedSeconds: number;
}

export interface Player {
  id: string;
  name: string;
  number: string;
  position?: string;
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    fouls: number;
    fieldGoalsMade: number;
    fieldGoalsAttempted: number;
    threePointersMade: number;
    threePointersAttempted: number;
    freeThrowsMade: number;
    freeThrowsAttempted: number;
    turnovers: number;
    offensiveRebounds: number;
    defensiveRebounds: number;
    efficiency: number;
    timePlayedSeconds: number;
  };
  quarterStats: PlayerQuarterStats[];
  isActive?: boolean;
  timeInGame?: number; // Time in game in seconds
  lastSubstitution?: number; // Timestamp of last substitution
}

export interface QuarterStats {
  homeTeam: {
    score: number;
    fieldGoalsMade: number;
    fieldGoalsAttempted: number;
    threePointersMade: number;
    threePointersAttempted: number;
    freeThrowsMade: number;
    freeThrowsAttempted: number;
    rebounds: number;
    turnovers: number;
  };
  awayTeam: {
    score: number;
    fieldGoalsMade: number;
    fieldGoalsAttempted: number;
    threePointersMade: number;
    threePointersAttempted: number;
    freeThrowsMade: number;
    freeThrowsAttempted: number;
    rebounds: number;
    turnovers: number;
  };
}

export interface Game {
  id?: string;
  date: Date | Timestamp;
  homeTeam: {
    name: string;
    score: number;
    players: Player[];
    activePlayers: string[]; // Array of active player IDs
  };
  awayTeam: {
    name: string;
    score: number;
    players: Player[];
    activePlayers: string[]; // Array of active player IDs
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'overtime';
  quarter: number;
  timeRemaining: number;
  shotClock: {
    timeRemaining: number;
    isRunning: boolean;
    lastReset: number;
  };
  quarterStats: QuarterStats[];  // Array of stats for each quarter
  userId: string;
  version?: number;
  lastModified?: Timestamp;
  lastSubstitutionTime?: number; // Timestamp of last substitution
}

const gamesCollection = collection(db, 'games');

export const createGame = async (gameData: Omit<Game, 'id'>): Promise<string> => {
  try {
    const netInfo = await NetInfo.fetch();
    
    const emptyQuarterStats: QuarterStats = {
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
    
    if (!netInfo.isConnected) {
      // Generate a temporary ID for offline use
      const tempId = 'temp_' + Date.now();
      const tempGame: Game = {
        ...gameData,
        id: tempId,
        date: Timestamp.fromDate(gameData.date as Date),
        version: 1,
        lastModified: Timestamp.now(),
        quarter: 1,
        timeRemaining: 600, // 10 minutes in seconds
        shotClock: {
          timeRemaining: 24,
          isRunning: false,
          lastReset: Date.now(),
        },
        status: 'scheduled',
        quarterStats: [emptyQuarterStats],
      };
      
      // Cache the game locally
      await cacheService.cacheGame(tempGame);
      
      // Save for sync
      await syncManager.savePendingChange({
        id: tempId,
        type: 'create',
        collection: 'games',
        data: tempGame,
        timestamp: Date.now(),
      });
      
      return tempId;
    }

    const newGame: Game = {
      ...gameData,
      date: Timestamp.fromDate(gameData.date as Date),
      version: 1,
      lastModified: Timestamp.now(),
      quarter: 1,
      timeRemaining: 600, // 10 minutes in seconds
      shotClock: {
        timeRemaining: 24,
        isRunning: false,
        lastReset: Date.now(),
      },
      status: 'scheduled',
      quarterStats: [emptyQuarterStats],
    };

    const docRef = await addDoc(gamesCollection, newGame);
    newGame.id = docRef.id;

    // Cache the new game
    await cacheService.cacheGame(newGame);

    return docRef.id;
  } catch (error: any) {
    throw new Error('Error creating game: ' + error.message);
  }
};

export const updateGame = async (gameId: string, gameData: Partial<Game>): Promise<void> => {
  try {
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected) {
      // Get existing game from cache
      const existingGame = await cacheService.getCachedGame(gameId);
      if (!existingGame) {
        throw new Error('Game not found in cache');
      }

      // Update cached game
      const updatedGame = {
        ...existingGame,
        ...gameData,
        date: gameData.date ? Timestamp.fromDate(gameData.date as Date) : existingGame.date,
        version: (existingGame.version || 0) + 1,
        lastModified: Timestamp.now(),
      };
      await cacheService.cacheGame(updatedGame);

      // Save for sync
      await syncManager.savePendingChange({
        id: gameId,
        type: 'update',
        collection: 'games',
        data: updatedGame,
        timestamp: Date.now(),
      });
      return;
    }

    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);
    if (!gameSnap.exists()) {
      throw new Error('Game not found');
    }

    const currentVersion = gameSnap.data().version || 0;
    const updateData = {
      ...gameData,
      date: gameData.date ? Timestamp.fromDate(gameData.date as Date) : undefined,
      version: currentVersion + 1,
      lastModified: Timestamp.now(),
    };

    await updateDoc(gameRef, updateData);

    // Update cache
    const existingGame = await getGame(gameId);
    await cacheService.cacheGame(existingGame);
  } catch (error: any) {
    throw new Error('Error updating game: ' + error.message);
  }
};

export const deleteGame = async (gameId: string): Promise<void> => {
  try {
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected) {
      // Remove from cache
      await cacheService.removeCachedGame(gameId);

      // Save for sync
      await syncManager.savePendingChange({
        id: gameId,
        type: 'delete',
        collection: 'games',
        timestamp: Date.now(),
      });
      return;
    }

    const gameRef = doc(db, 'games', gameId);
    await deleteDoc(gameRef);
    await cacheService.removeCachedGame(gameId);
  } catch (error: any) {
    throw new Error('Error deleting game: ' + error.message);
  }
};

export const getGame = async (gameId: string): Promise<Game> => {
  try {
    // Try to get from cache first
    const cachedGame = await cacheService.getCachedGame(gameId);
    if (cachedGame) {
      return cachedGame;
    }

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('Game not found in cache and device is offline');
    }

    const gameRef = doc(db, 'games', gameId);
    const gameSnap = await getDoc(gameRef);
    if (!gameSnap.exists()) {
      throw new Error('Game not found');
    }

    const data = gameSnap.data();
    const game = {
      id: gameSnap.id,
      ...data,
      date: (data.date as Timestamp).toDate(),
    } as Game;

    // Cache the fetched game
    await cacheService.cacheGame(game);

    return game;
  } catch (error: any) {
    throw new Error('Error getting game: ' + error.message);
  }
};

export const getUserGames = async (userId: string): Promise<Game[]> => {
  try {
    // Try to get from cache first
    const cachedGames = await cacheService.getCachedUserGames(userId);
    if (cachedGames) {
      return cachedGames;
    }

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return []; // Return empty array when offline and no cache
    }

    const q = query(
      gamesCollection,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const games = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: (doc.data().date as Timestamp).toDate(),
    })) as Game[];

    // Cache the fetched games
    await cacheService.cacheUserGames(userId, games);

    return games;
  } catch (error: any) {
    throw new Error('Error getting user games: ' + error.message);
  }
}; 