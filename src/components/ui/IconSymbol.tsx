import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons';

interface IconSymbolProps {
  name: keyof typeof MaterialCommunityIconsType.glyphMap;
  size: number;
  color: string;
  style?: ViewStyle;
}

export function IconSymbol({ name, size, color, style }: IconSymbolProps) {
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 