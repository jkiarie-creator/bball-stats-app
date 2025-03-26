declare module 'react-native-animatable' {
  import * as React from 'react';
  import { ViewStyle, TextStyle, ImageStyle, StyleProp } from 'react-native';

  type AnimatableProperties = {
    animation?: string;
    duration?: number;
    delay?: number;
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    easing?: string;
    iterationCount?: number | 'infinite';
    transition?: string | string[];
    useNativeDriver?: boolean;
    onAnimationBegin?: () => void;
    onAnimationEnd?: () => void;
    onTransitionBegin?: () => void;
    onTransitionEnd?: () => void;
  };

  type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

  export interface AnimatableViewProps extends AnimatableProperties {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }

  export interface AnimatableTextProps extends AnimatableProperties {
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
  }

  export interface AnimatableImageProps extends AnimatableProperties {
    style?: StyleProp<ImageStyle>;
    children?: React.ReactNode;
  }

  export class View extends React.Component<AnimatableViewProps> {
    animate: (animation: string, duration?: number) => Promise<void>;
    stopAnimation: () => void;
  }

  export class Text extends React.Component<AnimatableTextProps> {
    animate: (animation: string, duration?: number) => Promise<void>;
    stopAnimation: () => void;
  }

  export class Image extends React.Component<AnimatableImageProps> {
    animate: (animation: string, duration?: number) => Promise<void>;
    stopAnimation: () => void;
  }

  export const createAnimatableComponent: <T>(component: React.ComponentType<T>) => React.ComponentType<T & AnimatableProperties>;
} 