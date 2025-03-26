import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { COLORS, SPACING } from '../../theme';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  message?: string;
  animation?: string;
  style?: ViewStyle;
  onAction?: () => void;
  actionLabel?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  animation = 'empty-box',
  style,
  onAction,
  actionLabel = 'Try Again',
}) => {
  const getAnimationSource = () => {
    switch (animation) {
      case 'empty-list':
        return require('../../assets/animations/empty-list.json');
      case 'no-data':
        return require('../../assets/animations/no-data.json');
      case 'no-internet':
        return require('../../assets/animations/no-internet.json');
      default:
        return require('../../assets/animations/empty-box.json');
    }
  };

  return (
    <Animatable.View
      animation="fadeIn"
      style={[styles.container, style]}
    >
      <LottieView
        source={getAnimationSource()}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text
        style={[styles.title, { textAlign: 'center' }]}
        variant="titleLarge"
      >
        {title}
      </Text>
      {message && (
        <Text
          style={[styles.message, { textAlign: 'center' }]}
          variant="bodyMedium"
          numberOfLines={3}
        >
          {message}
        </Text>
      )}
      {onAction && (
        <Animatable.View
          animation="fadeInUp"
          delay={500}
          style={styles.actionContainer}
        >
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="secondary"
          />
        </Animatable.View>
      )}
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  message: {
    color: COLORS.subtext,
    marginBottom: SPACING.lg,
  },
  actionContainer: {
    width: '100%',
    maxWidth: 200,
  },
});

export default EmptyState; 