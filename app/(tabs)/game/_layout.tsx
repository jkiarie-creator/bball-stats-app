import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/theme';

export default function GameLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? COLORS.backgroundDark : COLORS.background;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: colorScheme === 'dark' ? COLORS.textDark : COLORS.text,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Games',
        }}
      />
      <Stack.Screen
        name="setup"
        options={{
          title: 'Game Setup',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="live"
        options={{
          title: 'Live Game',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: 'Game History',
        }}
      />
    </Stack>
  );
}
