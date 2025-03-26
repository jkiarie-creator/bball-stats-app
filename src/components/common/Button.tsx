import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { StyleGuide } from '../../theme/StyleGuide';
import { COLORS } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    Animated.spring(scale, {
      toValue: 0.95,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
    onPressOut?.(e);
  };

  const getButtonStyle = () => {
    const baseStyle = [
      styles.button,
      variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
      size === 'small' && styles.smallButton,
      size === 'large' && styles.largeButton,
      disabled && styles.disabledButton,
      { transform: [{ scale }] },
      style,
    ];
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [
      styles.text,
      variant === 'primary' ? styles.primaryText : styles.secondaryText,
      size === 'small' && styles.smallText,
      size === 'large' && styles.largeText,
      disabled && styles.disabledText,
      textStyle,
    ];
    return baseStyle;
  };

  return (
    <Animated.View style={getButtonStyle()}>
      <TouchableOpacity
        disabled={disabled || loading}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        <Animated.View style={styles.content}>
          {loading ? (
            <ActivityIndicator
              color={variant === 'primary' ? '#FFFFFF' : COLORS.primary}
              size="small"
            />
          ) : (
            <Text style={getTextStyle()}>{title}</Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    ...StyleGuide.button,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  primaryButton: {
    ...StyleGuide.primaryButton,
  },
  secondaryButton: {
    ...StyleGuide.secondaryButton,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 80,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: 140,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    ...StyleGuide.buttonText,
  },
  primaryText: {
    ...StyleGuide.primaryButtonText,
  },
  secondaryText: {
    ...StyleGuide.secondaryButtonText,
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.7,
  },
}); 