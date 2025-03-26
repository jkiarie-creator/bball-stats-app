import { Easing, EasingFunction, Animated } from 'react-native';

interface AnimationConfig {
  duration?: number;
  easing?: EasingFunction;
  delay?: number;
  useNativeDriver?: boolean;
}

/**
 * Creates an animation configuration with React Native's Animated API
 */
export const createAnimation = (
  value: Animated.Value, 
  toValue: number, 
  config: AnimationConfig = {}
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue,
    duration: config.duration ?? 300,
    easing: config.easing ?? Easing.bezier(0.25, 0.1, 0.25, 1),
    delay: config.delay ?? 0,
    useNativeDriver: config.useNativeDriver ?? false,
  });
};

/**
 * Creates a spring animation
 */
export const withSpring = (
  value: Animated.Value,
  toValue: number,
  config: Partial<Animated.SpringAnimationConfig> = {}
): Animated.CompositeAnimation => {
  return Animated.spring(value, {
    toValue,
    tension: config.tension ?? 40,
    friction: config.friction ?? 7,
    useNativeDriver: config.useNativeDriver ?? false,
  });
};

/**
 * Creates a parallel animation group
 */
export const withParallel = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.parallel(animations);
};

/**
 * Creates a sequence animation group
 */
export const withSequence = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.sequence(animations);
};

export default {
  createAnimation,
  withSpring,
  withParallel,
  withSequence,
}; 