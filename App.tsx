import React, { useEffect, useRef, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { store } from '@/store';
import { ThemeProvider } from '@/theme/ThemeProvider';
import AppNavigator from '@/navigation/AppNavigator';
import { ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSync } from '@/hooks/useSync';
import { Snackbar } from 'react-native-paper';
import { AuthProvider } from '@/providers/AuthProvider';
import { FirebaseProvider } from '@/providers/FirebaseProvider';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Define types for notification data
interface NotificationData {
  gameId?: string;
  type?: 'game_start' | 'game_end' | 'quarter_end' | 'milestone';
  [key: string]: any;
}

function AppContent() {
  const navigationRef = useNavigationContainerRef();
  const { isOnline, isSyncing, lastSyncTime } = useSync();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
    }
  }, [isOnline]);

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
      
      <Snackbar
        visible={showOfflineMessage}
        onDismiss={() => setShowOfflineMessage(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setShowOfflineMessage(false),
        }}
      >
        {isOnline ? 'Back online' : 'You are offline'}
      </Snackbar>

      {isSyncing && (
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: 8,
          borderBottomLeftRadius: 8,
        }}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>Syncing...</Text>
        </View>
      )}
    </>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigationRef = useNavigationContainerRef();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Request notification permissions
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permissions not granted');
          return;
        }

        // Listen for incoming notifications
        notificationListener.current = Notifications.addNotificationReceivedListener(
          notification => {
            console.log('Received notification:', notification);
          }
        );

        // Listen for notification responses
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
          response => {
            const data = response.notification.request.content.data as NotificationData;
            if (data?.gameId) {
              navigationRef.current?.navigate('GameDetails', { gameId: data.gameId });
            }
          }
        );

        setIsLoading(false);
      } catch (error) {
        setError(error as Error);
        setIsLoading(false);
      }
    };

    setupNotifications();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <FirebaseProvider> {/* Wrap with FirebaseProvider */}
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}