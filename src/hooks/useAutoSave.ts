import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { updateGame } from '@/services/firebase';
import type { RootState, GameData } from '@/types';

const AUTOSAVE_DELAY = 2000; // 2 seconds

export function useAutoSave() {
  const currentGame = useSelector((state: RootState) => state.game.currentGame);
  const { autoSave } = useSelector((state: RootState) => state.settings);
  const previousGameRef = useRef<GameData | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!currentGame || !autoSave) {
      previousGameRef.current = null;
      return;
    }

    // Clear any pending auto-save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if game state has changed
    if (JSON.stringify(currentGame) === JSON.stringify(previousGameRef.current)) {
      return;
    }

    // Schedule auto-save after delay
    timeoutRef.current = setTimeout(async () => {
      try {
        if (!currentGame.id) return;

        const { id, userId, date, ...updates } = currentGame;
        await updateGame(id, updates);
        previousGameRef.current = currentGame;
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, AUTOSAVE_DELAY);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentGame, autoSave]);

  return null;
}
