import { initializeApp, FirebaseApp, FirebaseError } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey) throw new Error('Firebase API key is missing');
if (!firebaseConfig.authDomain) throw new Error('Firebase Auth Domain is missing');
if (!firebaseConfig.projectId) throw new Error('Firebase Project ID is missing');
if (!firebaseConfig.storageBucket) throw new Error('Firebase Storage Bucket is missing');
if (!firebaseConfig.messagingSenderId) throw new Error('Firebase Messaging Sender ID is missing');
if (!firebaseConfig.appId) throw new Error('Firebase App ID is missing');

// Initialize Firebase with error handling
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (error instanceof FirebaseError) {
    console.error('Firebase initialization error:', error.message);
    throw error;
  }
  throw new Error('Failed to initialize Firebase');
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
