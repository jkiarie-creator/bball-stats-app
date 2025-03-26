import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Easing } from 'react-native';
import { StyleGuide } from '../../theme/StyleGuide';
import { COLORS, SIZES } from '../../theme';
import { createAnimation, withSequence, withSpring, withParallel } from '../../utils/animations';

interface FeedbackProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onDismiss?: () => void;
  duration?: number;
  showDismiss?: boolean;
}

export const Feedback: React.FC<FeedbackProps> = ({
  type,
  message,
  onDismiss,
  duration = 3000,
  showDismiss = true,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const showAnimation = withSequence([
      withParallel([
        withSpring(scale, 1, {
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        withSpring(translateY, 0, {
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        createAnimation(opacity, 1, {
          duration: 200,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(duration),
      withParallel([
        createAnimation(opacity, 0, {
          duration: 200,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        withSpring(translateY, -20, {
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        withSpring(scale, 0.95, {
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]);

    showAnimation.start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });

    return () => {
      showAnimation.stop();
    };
  }, [duration, onDismiss, opacity, scale, translateY]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return COLORS.success + '20';
      case 'error':
        return COLORS.error + '20';
      case 'info':
        return COLORS.info + '20';
      default:
        return COLORS.info + '20';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return COLORS.success;
      case 'error':
        return COLORS.error;
      case 'info':
        return COLORS.info;
      default:
        return COLORS.info;
    }
  };

  const handleDismiss = () => {
    withParallel([
      createAnimation(opacity, 0, {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      withSpring(translateY, -20, {
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      withSpring(scale, 0.95, {
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.icon, { backgroundColor: getIconColor() }]} />
        <Text style={styles.message}>{message}</Text>
      </View>
      {showDismiss && (
        <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: SIZES.xl,
    left: SIZES.md,
    right: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    ...StyleGuide.card,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SIZES.sm,
  },
  message: {
    ...StyleGuide.body,
    flex: 1,
  },
  dismissButton: {
    marginLeft: SIZES.sm,
    padding: SIZES.xs,
  },
  dismissText: {
    color: COLORS.subtext,
    fontSize: SIZES.body,
    fontWeight: '500',
  },
}); 