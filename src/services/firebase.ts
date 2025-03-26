import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
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
  setDoc,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { Team, Player, GameSettings, SettingsState, GameData } from '../types';

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Auth functions
export const loginWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential;
};

export const logoutUser = () => signOut(auth);

interface PlayerStats extends Player {
  gameId: string;
  teamId: string;
  finalStats: Player['stats'];
}

// Game functions
export const saveGame = async (gameData: Omit<GameData, 'id' | 'date' | 'completed'>) => {
  const gamesRef = collection(db, 'games');
  const docRef = await addDoc(gamesRef, {
    ...gameData,
    date: new Date().toISOString(),
    completed: false,
  });
  return docRef.id;
};

export const updateGame = async (gameId: string, updates: Partial<GameData>) => {
  const gameRef = doc(db, 'games', gameId);
  await updateDoc(gameRef, updates);
};

export const deleteGame = async (gameId: string) => {
  const gameRef = doc(db, 'games', gameId);
  await deleteDoc(gameRef);
};

export const getGame = async (gameId: string) => {
  const gameRef = doc(db, 'games', gameId);
  const gameDoc = await getDoc(gameRef);
  if (!gameDoc.exists()) return null;

  const data = gameDoc.data();
  return {
    id: gameDoc.id,
    ...data,
    settings: data.settings || { quarterLength: 600, enableShotClock: true },
    currentQuarter: data.currentQuarter || 1,
    timeRemaining: data.timeRemaining || 600,
    isRunning: data.isRunning || false,
    isPaused: data.isPaused || false,
    completed: data.completed || false,
    date: data.date || new Date().toISOString(),
  } as GameData;
};

export const getUserGames = async (userId: string) => {
  const gamesRef = collection(db, 'games');
  const q = query(
    gamesRef,
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      settings: data.settings || { quarterLength: 600, enableShotClock: true },
      currentQuarter: data.currentQuarter || 1,
      timeRemaining: data.timeRemaining || 600,
      isRunning: data.isRunning || false,
      isPaused: data.isPaused || false,
      completed: data.completed || false,
      date: data.date || new Date().toISOString(),
    } as GameData;
  });
};

// Player stats functions
export const savePlayerStats = async (playerStats: PlayerStats) => {
  const statsRef = collection(db, 'playerStats');
  const docRef = await addDoc(statsRef, playerStats);
  return docRef.id;
};

export const getPlayerStats = async (playerId: string) => {
  const statsRef = collection(db, 'playerStats');
  const q = query(statsRef, where('id', '==', playerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as PlayerStats[];
};

// User preferences
export interface UserPreferences extends SettingsState {
  userId: string;
}

export const saveUserPreferences = async (preferences: UserPreferences) => {
  const { userId, ...settings } = preferences;
  const prefsRef = doc(db, 'userPreferences', userId);
  await setDoc(prefsRef, settings);
};

export const getUserPreferences = async (userId: string): Promise<SettingsState> => {
  const prefsRef = doc(db, 'userPreferences', userId);
  const prefsDoc = await getDoc(prefsRef);
  return prefsDoc.exists()
    ? (prefsDoc.data() as SettingsState)
    : {
        theme: 'light',
        sound: {
          enabled: true,
          volume: 1.0,
        },
        vibration: {
          enabled: true,
          intensity: 1.0,
        },
        autoSave: true,
      };
};

export default app;