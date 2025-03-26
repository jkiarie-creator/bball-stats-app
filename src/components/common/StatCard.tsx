import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { COLORS, FONTS, BORDER_RADIUS, SHADOWS, SPACING } from '../../theme';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  style?: ViewStyle;
  animation?: string;
  delay?: number;
  statType?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  style,
  animation = 'fadeIn',
  delay = 0,
  statType,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return COLORS.success;
      case 'down':
        return COLORS.error;
      default:
        return COLORS.subtext;
    }
  };

  const getStatColor = () => {
    if (!statType) return COLORS.text;
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
      default:
        return COLORS.text;
    }
  };

  return (
    <Animatable.View
      animation={animation}
      delay={delay}
      style={[styles.container, style]}
    >
      <Surface style={styles.card}>
        <View style={styles.header}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.content}>
          <Text style={[styles.value, { color: getStatColor() }]}>
            {value}
          </Text>
          {trend && trendValue && (
            <View style={styles.trendContainer}>
              <Text style={[styles.trendValue, { color: getTrendColor() }]}>
                {trendValue}
              </Text>
            </View>
          )}
        </View>
      </Surface>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SPACING.xs,
    flex: 1,
  },
  card: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    ...SHADOWS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.subtext,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  value: {
    fontFamily: FONTS.numbers,
    fontSize: 24,
    color: COLORS.text,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    marginLeft: SPACING.xs,
  },
});

export default StatCard; 