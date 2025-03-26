import { useState, useEffect, useCallback } from 'react';
import { Game, getUserGames } from '../services/game.service';
import { useSync } from './useSync';
import { useAuth } from './useAuth';

export const useGameData = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, isSyncing, forceSync } = useSync();
  const { user } = useAuth();

  const loadGames = useCallback(async () => {
    if (!user) {
      setGames([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const userGames = await getUserGames(user.uid);
      setGames(userGames);
    } catch (err: any) {
      setError(err.message);
      console.error('Error loading games:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load games initially and when user changes
  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Reload games when coming back online after sync
  useEffect(() => {
    if (isOnline && !isSyncing) {
      loadGames();
    }
  }, [isOnline, isSyncing, loadGames]);

  const refreshGames = useCallback(async () => {
    if (isOnline) {
      await forceSync();
    }
    await loadGames();
  }, [isOnline, forceSync, loadGames]);

  return {
    games,
    isLoading,
    error,
    refreshGames,
    isOnline,
    isSyncing
  };
}; 