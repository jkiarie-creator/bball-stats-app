import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { store } from '@/store';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { theme, darkTheme } from '@/theme';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FirebaseProvider } from '@/providers/FirebaseProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <FirebaseProvider>
        <PaperProvider theme={colorScheme === 'dark' ? darkTheme : theme}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </PaperProvider>
      </FirebaseProvider>
    </Provider>
  );
}
