import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { updateGameStats } from '@/store/slices/gameSlice';
import type { RootState, AppDispatch, GameData } from '@/types';

export function useGameSync() {
  const dispatch = useDispatch<AppDispatch>();
  const currentGame = useSelector((state: RootState) => state.game.currentGame);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!currentGame?.id || !user?.id) return;

    // Subscribe to real-time game updates
    const gameRef = doc(db, 'games', currentGame.id);
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data() as Omit<GameData, 'id'>;
      dispatch(updateGameStats({
        ...data,
        id: currentGame.id,
      }));
    });

    return () => unsubscribe();
  }, [currentGame?.id, user?.id, dispatch]);

  return null;
}
