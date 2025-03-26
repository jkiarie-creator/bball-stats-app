import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  style?: ViewStyle;
  transparent?: boolean;
  gradient?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  transparent = false,
  gradient = false,
}) => {
  const insets = useSafeAreaInsets();

  const renderContent = () => (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
      <View style={styles.leftContainer}>
        {leftIcon && (
          <IconButton
            icon={leftIcon}
            size={24}
            onPress={onLeftPress}
            iconColor={transparent || gradient ? COLORS.surface : COLORS.text}
          />
        )}
      </View>
      <Animatable.Text
        animation="fadeIn"
        style={[
          styles.title,
          { color: transparent || gradient ? COLORS.surface : COLORS.text },
        ]}
      >
        {title}
      </Animatable.Text>
      <View style={styles.rightContainer}>
        {rightIcon && (
          <IconButton
            icon={rightIcon}
            size={24}
            onPress={onRightPress}
            iconColor={transparent || gradient ? COLORS.surface : COLORS.text}
          />
        )}
      </View>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, style]}
      >
        {renderContent()}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        transparent ? styles.transparent : styles.solid,
        style,
      ]}
    >
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  solid: {
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  gradient: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    height: 56 + SPACING.lg,
  },
  leftContainer: {
    width: 48,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 48,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
});

export default Header; 