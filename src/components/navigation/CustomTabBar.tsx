import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SHADOWS } from '../../theme';
import { Slot, Tabs } from 'expo-router';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ 
  state, 
  descriptors,
  navigation 
}: any) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.95)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {state.routes.map((route: { key: string; name: string }, index: number) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tab}
              >
                <Animatable.View
                  animation={isFocused ? 'bounceIn' : undefined}
                  duration={500}
                  style={styles.iconContainer}
                >
                  {options.tabBarIcon &&
                    options.tabBarIcon({
                      focused: isFocused,
                      color: isFocused ? COLORS.primary : COLORS.subtext,
                      size: 24,
                    })}
                  {isFocused && (
                    <Animatable.View
                      animation="fadeIn"
                      duration={250}
                      style={[
                        styles.indicator,
                        { backgroundColor: COLORS.primary },
                      ]}
                    />
                  )}
                </Animatable.View>
                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused ? COLORS.primary : COLORS.subtext,
                      transform: [{ scale: isFocused ? 1 : 0.92 }],
                    },
                  ]}
                >
                  {label.toString()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  gradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOWS.medium,
  },
  content: {
    flexDirection: 'row',
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default CustomTabBar; 