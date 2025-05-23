import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import type { MD3TypescaleKey } from 'react-native-paper/lib/typescript/types';
import { Platform } from 'react-native';

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

const lightColors = {
  primary: '#2196F3',
  secondary: '#03DAC6',
  accent: '#FF4081',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#000000',
  subtext: '#666666',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  homeTeam: '#2196F3',
  awayTeam: '#F44336',
  points: '#4CAF50',
  assists: '#2196F3',
  rebounds: '#FF9800',
  steals: '#9C27B0',
  blocks: '#FF4081',
  turnovers: '#F44336',
  fouls: '#FF9800',
};

const darkColors = {
  primary: '#90CAF9',
  secondary: '#03DAC6',
  accent: '#FF4081',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  subtext: '#AAAAAA',
  success: '#81C784',
  error: '#E57373',
  warning: '#FFB74D',
  info: '#64B5F6',
  homeTeam: '#64B5F6',
  awayTeam: '#E57373',
  points: '#81C784',
  assists: '#64B5F6',
  rebounds: '#FFB74D',
  steals: '#CE93D8',
  blocks: '#F06292',
  turnovers: '#E57373',
  fouls: '#FFB74D',
};

const baseFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
  },
};

export const COLORS = {
  ...lightColors,
  gradientStart: '#4a6da7',
  gradientEnd: '#2c3e50',
};

export { SPACING, SHADOWS };

export const SIZES = {
  h1: 32,
  h2: 24,
  h3: 18,
  body: 16,
  caption: 12,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 999,
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    error: COLORS.error,
  },
  fonts: {
    fontFamily: baseFont,
  },
};

export const getStatColor = (statType: string) => {
  switch (statType.toLowerCase()) {
    case 'points':
      return COLORS.points;
    case 'assists':
      return COLORS.assists;
    case 'rebounds':
      return COLORS.rebounds;
    case 'steals':
      return COLORS.steals;
    case 'blocks':
      return COLORS.blocks;
    case 'turnovers':
      return COLORS.turnovers;
    case 'fouls':
      return COLORS.fouls;
    default:
      return COLORS.text;
  }
}; 