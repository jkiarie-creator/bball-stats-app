import React from 'react';
import { Text, TextProps } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/theme';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'subtitle' | 'body';
}

export function ThemedText({ style, type = 'body', ...props }: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? COLORS.textDark : COLORS.text;

  let fontSize = 16;
  switch (type) {
    case 'title':
      fontSize = 24;
      break;
    case 'subtitle':
      fontSize = 18;
      break;
    default:
      fontSize = 16;
  }

  return (
    <Text
      style={[
        {
          color,
          fontSize,
        },
        style,
      ]}
      {...props}
    />
  );
}
