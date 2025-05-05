import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  loading: true,
  error: null,
});

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true); // Ensure loading state is set at the start
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Firebase auth error:', error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading, error }}>
      {children}
    </FirebaseContext.Provider>
  );
}
