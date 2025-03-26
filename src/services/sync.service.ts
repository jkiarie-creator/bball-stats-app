import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import { Game } from './game.service';
import { UserProfile } from './user.service';

const PENDING_CHANGES_KEY = '@pending_changes';
const LAST_SYNC_KEY = '@last_sync';
const CONFLICT_RESOLUTION_KEY = '@conflict_resolution';

interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: string;
  data?: any;
  timestamp: number;
  version?: number;
}

interface ConflictResolution {
  id: string;
  resolution: 'local' | 'server';
  timestamp: number;
}

export const syncManager = {
  async savePendingChange(change: PendingChange): Promise<void> {
    try {
      const pendingChanges = await this.getPendingChanges();
      // Add version number for conflict detection
      change.version = await this.getCurrentVersion(change.id, change.collection);
      
      // Replace existing change if one exists for the same document
      const existingIndex = pendingChanges.findIndex(
        pc => pc.id === change.id && pc.collection === change.collection
      );
      
      if (existingIndex !== -1) {
        pendingChanges[existingIndex] = change;
      } else {
        pendingChanges.push(change);
      }
      
      await AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pendingChanges));
    } catch (error) {
      console.error('Error saving pending change:', error);
    }
  },

  async getCurrentVersion(docId: string, collectionName: string): Promise<number> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data().version || 0) : 0;
    } catch (error) {
      return 0;
    }
  },

  async getPendingChanges(): Promise<PendingChange[]> {
    try {
      const changes = await AsyncStorage.getItem(PENDING_CHANGES_KEY);
      return changes ? JSON.parse(changes) : [];
    } catch (error) {
      console.error('Error getting pending changes:', error);
      return [];
    }
  },

  async clearPendingChanges(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PENDING_CHANGES_KEY);
    } catch (error) {
      console.error('Error clearing pending changes:', error);
    }
  },

  async saveConflictResolution(resolution: ConflictResolution): Promise<void> {
    try {
      const resolutions = await this.getConflictResolutions();
      resolutions.push(resolution);
      await AsyncStorage.setItem(CONFLICT_RESOLUTION_KEY, JSON.stringify(resolutions));
    } catch (error) {
      console.error('Error saving conflict resolution:', error);
    }
  },

  async getConflictResolutions(): Promise<ConflictResolution[]> {
    try {
      const resolutions = await AsyncStorage.getItem(CONFLICT_RESOLUTION_KEY);
      return resolutions ? JSON.parse(resolutions) : [];
    } catch (error) {
      console.error('Error getting conflict resolutions:', error);
      return [];
    }
  },

  async handleConflict(change: PendingChange, serverData: any): Promise<'local' | 'server'> {
    // Check if there's a saved resolution for this document
    const resolutions = await this.getConflictResolutions();
    const existingResolution = resolutions.find(r => r.id === change.id);
    
    if (existingResolution) {
      return existingResolution.resolution;
    }

    // Default conflict resolution strategy:
    // 1. For deletes, prefer the delete operation
    if (change.type === 'delete') {
      return 'local';
    }

    // 2. For updates, check versions
    const serverVersion = serverData.version || 0;
    if (change.version !== undefined && change.version < serverVersion) {
      return 'server';
    }

    // 3. For creates or if versions match, prefer the most recent change
    const serverTimestamp = serverData.lastModified?.toMillis() || 0;
    return change.timestamp > serverTimestamp ? 'local' : 'server';
  },

  async syncWithServer(): Promise<void> {
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected) {
      console.log('No internet connection, skipping sync');
      return;
    }

    try {
      const pendingChanges = await this.getPendingChanges();
      const processedChanges: string[] = [];
      
      for (const change of pendingChanges) {
        try {
          const docRef = doc(db, change.collection, change.id);
          const serverDoc = await getDoc(docRef);
          
          if (serverDoc.exists()) {
            const serverData = serverDoc.data();
            const resolution = await this.handleConflict(change, serverData);

            if (resolution === 'local') {
              // Apply local changes
              if (change.type === 'delete') {
                await setDoc(docRef, { deleted: true, deletedAt: new Date() }, { merge: true });
              } else {
                const updatedData = {
                  ...change.data,
                  version: (serverData.version || 0) + 1,
                  lastModified: Timestamp.now(),
                };
                await setDoc(docRef, updatedData, { merge: true });
              }
            }
            // If resolution is 'server', we keep the server version
          } else if (change.type === 'create') {
            // No conflict for new documents
            const newData = {
              ...change.data,
              version: 1,
              lastModified: Timestamp.now(),
            };
            await setDoc(docRef, newData);
          }

          processedChanges.push(change.id);
          
          // Save the conflict resolution
          await this.saveConflictResolution({
            id: change.id,
            resolution: 'local',
            timestamp: Date.now(),
          });
        } catch (error) {
          console.error(`Error processing change for document ${change.id}:`, error);
        }
      }

      // Remove successfully processed changes
      const remainingChanges = pendingChanges.filter(
        change => !processedChanges.includes(change.id)
      );
      
      if (remainingChanges.length === 0) {
        await this.clearPendingChanges();
      } else {
        await AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(remainingChanges));
      }

      await this.updateLastSyncTimestamp();
    } catch (error) {
      console.error('Error syncing with server:', error);
      throw error;
    }
  },

  async updateLastSyncTimestamp(): Promise<void> {
    try {
      await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
    } catch (error) {
      console.error('Error updating last sync timestamp:', error);
    }
  },

  async getLastSyncTimestamp(): Promise<number> {
    try {
      const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
      return timestamp ? parseInt(timestamp, 10) : 0;
    } catch (error) {
      console.error('Error getting last sync timestamp:', error);
      return 0;
    }
  },

  async shouldSync(): Promise<boolean> {
    const lastSync = await this.getLastSyncTimestamp();
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;
    
    return (now - lastSync) > ONE_HOUR || (await this.getPendingChanges()).length > 0;
  }
}; 