import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncManager } from '../services/sync.service';

export const useSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      
      // If we're coming back online, trigger a sync
      if (state.isConnected) {
        handleSync();
      }
    });

    // Get initial sync time
    syncManager.getLastSyncTimestamp().then(setLastSyncTime);

    // Check for initial sync need
    checkAndSync();

    return () => {
      unsubscribe();
    };
  }, []);

  const checkAndSync = async () => {
    const shouldSync = await syncManager.shouldSync();
    if (shouldSync) {
      handleSync();
    }
  };

  const handleSync = async () => {
    if (isSyncing || !isOnline) return;

    try {
      setIsSyncing(true);
      await syncManager.syncWithServer();
      const newLastSync = await syncManager.getLastSyncTimestamp();
      setLastSyncTime(newLastSync);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const forceSync = () => {
    if (!isOnline) {
      console.log('Cannot sync while offline');
      return;
    }
    handleSync();
  };

  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    forceSync,
  };
}; 