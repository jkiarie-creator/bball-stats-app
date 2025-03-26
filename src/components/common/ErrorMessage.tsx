import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING } from '../../theme';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
  showIcon?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  style,
  showIcon = true,
}) => {
  return (
    <Animatable.View
      animation="fadeIn"
      style={[styles.container, style]}
    >
      {showIcon && (
        <IconButton
          icon="alert-circle"
          size={48}
          iconColor={COLORS.error}
          style={styles.icon}
        />
      )}
      <Text
        style={[styles.message, { textAlign: 'center' }]}
        variant="bodyLarge"
        numberOfLines={3}
      >
        {message}
      </Text>
      {onRetry && (
        <Button
          title="Try Again"
          onPress={onRetry}
          variant="secondary"
          style={styles.button}
        />
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: SPACING.md,
  },
  message: {
    color: COLORS.error,
    marginBottom: SPACING.md,
  },
  button: {
    marginTop: SPACING.sm,
  },
});

export default ErrorMessage; 