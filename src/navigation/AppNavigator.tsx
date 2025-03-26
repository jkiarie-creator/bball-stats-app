import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { IconButton } from 'react-native-paper';
import { RootState } from '../store';
import { COLORS } from '../../bball-stats-app/src/theme';
import { CustomTabBar } from '../components/navigation';
import type { GameSettings, Team } from '../types';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import GameSetupScreen from '../screens/game/GameSetupScreen';
import LiveGameScreen from '../screens/game/LiveGameScreen';
import GameHistoryScreen from '../screens/game/GameHistoryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { NewGameScreen } from '../screens/game/NewGameScreen';
import { HistoryScreen } from '../screens/game/HistoryScreen';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
};

export type GameStackParamList = {
  NewGame: undefined;
  LiveGame: {
    homeTeam: Team;
    awayTeam: Team;
    gameSettings: GameSettings;
  };
};

export type TabParamList = {
  Game: undefined;
  History: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<GameStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const GameStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen name="NewGame" component={NewGameScreen} />
    <Stack.Screen name="LiveGame" component={LiveGameScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          // Auth Stack
          <>
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main App Stack
          <>
            <RootStack.Screen name="MainTabs" component={Tab.Navigator} />
            <RootStack.Screen
              name="Game"
              component={GameStack}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'modal',
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 