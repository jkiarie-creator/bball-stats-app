import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game } from './game.service';

const GAME_CACHE_PREFIX = '@game_cache_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CachedGame extends Game {
  lastUpdated: number;
}

export const cacheService = {
  async cacheGame(game: Game): Promise<void> {
    try {
      const cachedGame: CachedGame = {
        ...game,
        lastUpdated: Date.now(),
      };
      await AsyncStorage.setItem(
        `${GAME_CACHE_PREFIX}${game.id}`,
        JSON.stringify(cachedGame)
      );
    } catch (error) {
      console.error('Error caching game:', error);
    }
  },

  async getCachedGame(gameId: string): Promise<Game | null> {
    try {
      const cachedData = await AsyncStorage.getItem(`${GAME_CACHE_PREFIX}${gameId}`);
      if (!cachedData) return null;

      const cachedGame: CachedGame = JSON.parse(cachedData);
      
      // Check if cache is expired
      if (Date.now() - cachedGame.lastUpdated > CACHE_EXPIRY) {
        await this.removeCachedGame(gameId);
        return null;
      }

      return cachedGame;
    } catch (error) {
      console.error('Error getting cached game:', error);
      return null;
    }
  },

  async removeCachedGame(gameId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${GAME_CACHE_PREFIX}${gameId}`);
    } catch (error) {
      console.error('Error removing cached game:', error);
    }
  },

  async clearGameCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const gameCacheKeys = keys.filter(key => key.startsWith(GAME_CACHE_PREFIX));
      await AsyncStorage.multiRemove(gameCacheKeys);
    } catch (error) {
      console.error('Error clearing game cache:', error);
    }
  },

  async cacheUserGames(userId: string, games: Game[]): Promise<void> {
    try {
      const cacheKey = `${GAME_CACHE_PREFIX}user_${userId}`;
      const cacheData = {
        games,
        lastUpdated: Date.now(),
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching user games:', error);
    }
  },

  async getCachedUserGames(userId: string): Promise<Game[] | null> {
    try {
      const cacheKey = `${GAME_CACHE_PREFIX}user_${userId}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);
      if (!cachedData) return null;

      const { games, lastUpdated } = JSON.parse(cachedData);
      
      // Check if cache is expired
      if (Date.now() - lastUpdated > CACHE_EXPIRY) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }

      return games;
    } catch (error) {
      console.error('Error getting cached user games:', error);
      return null;
    }
  }
}; 