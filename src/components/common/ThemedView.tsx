import React from 'react';
import { View, ViewProps } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/theme';

export function ThemedView({ style, ...props }: ViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? COLORS.backgroundDark : COLORS.background;

  return (
    <View
      style={[
        {
          backgroundColor,
        },
        style,
      ]}
      {...props}
    />
  );
}
