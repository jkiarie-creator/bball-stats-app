import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserPreferences {
  darkMode: boolean;
  notificationsEnabled: boolean;
  quarterLength: number;
  shotClockLength: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  preferences: UserPreferences;
  stats: {
    gamesTracked: number;
    totalPoints: number;
    averagePointsPerGame: number;
  };
}

const usersCollection = collection(db, 'users');

export const createUserProfile = async (userId: string, userData: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userId);
    const defaultPreferences: UserPreferences = {
      darkMode: false,
      notificationsEnabled: true,
      quarterLength: 12, // 12 minutes
      shotClockLength: 24, // 24 seconds
    };

    const defaultStats = {
      gamesTracked: 0,
      totalPoints: 0,
      averagePointsPerGame: 0,
    };

    await setDoc(userRef, {
      ...userData,
      preferences: defaultPreferences,
      stats: defaultStats,
    });
  } catch (error: any) {
    throw new Error('Error creating user profile: ' + error.message);
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const userRef = doc(usersCollection, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('User profile not found');
    }
    
    return {
      id: userSnap.id,
      ...userSnap.data(),
    } as UserProfile;
  } catch (error: any) {
    throw new Error('Error getting user profile: ' + error.message);
  }
};

export const updateUserProfile = async (userId: string, userData: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, userData);
  } catch (error: any) {
    throw new Error('Error updating user profile: ' + error.message);
  }
};

export const updateUserPreferences = async (userId: string, preferences: Partial<UserPreferences>): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userId);
    await updateDoc(userRef, { preferences });
  } catch (error: any) {
    throw new Error('Error updating user preferences: ' + error.message);
  }
};

export const updateUserStats = async (userId: string, gamePoints: number): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error('User profile not found');
    }
    
    const userData = userSnap.data();
    const newGamesTracked = userData.stats.gamesTracked + 1;
    const newTotalPoints = userData.stats.totalPoints + gamePoints;
    const newAveragePoints = newTotalPoints / newGamesTracked;
    
    await updateDoc(userRef, {
      stats: {
        gamesTracked: newGamesTracked,
        totalPoints: newTotalPoints,
        averagePointsPerGame: newAveragePoints,
      },
    });
  } catch (error: any) {
    throw new Error('Error updating user stats: ' + error.message);
  }
}; 