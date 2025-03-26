import React from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from './index';
import type { RootState } from '../store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { darkMode } = useSelector((state: RootState) => state.settings);

  // Use system theme if darkMode is not explicitly set
  const isDarkMode = darkMode ?? systemColorScheme === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}; 