import React from 'react';
import { Tabs } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform, useColorScheme } from 'react-native';
import { COLORS } from '@/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <AuthGuard>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colorScheme === 'dark' ? COLORS.primaryDark : COLORS.primary,
            tabBarStyle: {
              backgroundColor: colorScheme === 'dark' ? COLORS.backgroundDark : COLORS.background,
              ...Platform.select({
                ios: {
                  position: 'absolute',
                },
                default: {},
              }),
            },
          }}>
          <Tabs.Screen
            name="game"
            options={{
              title: 'Game',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons name="basketball" size={24} color={color} />,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              title: 'History',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons name="history" size={24} color={color} />,
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog" size={24} color={color} />,
              headerShown: false,
            }}
          />
        </Tabs>
      </AuthGuard>
    </Provider>
  );
}
