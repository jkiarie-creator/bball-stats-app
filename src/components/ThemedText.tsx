import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/theme';

interface ThemedTextProps extends TextProps {
  type?: 'title' | 'defaultSemiBold' | 'link';
}

export function ThemedText({ style, type, ...props }: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? COLORS.textDark : COLORS.text;

  return (
    <Text
      style={[
        styles.text,
        type === 'title' && styles.title,
        type === 'defaultSemiBold' && styles.defaultSemiBold,
        type === 'link' && styles.link,
        { color: textColor },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  defaultSemiBold: {
    fontWeight: '600',
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
}); 