import React, { useRef, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Animated, Easing } from 'react-native';
import { StyleGuide } from '../../theme/StyleGuide';
import { COLORS, SIZES } from '../../theme';

interface LoadingProps {
  variant?: 'fullscreen' | 'inline' | 'overlay';
  size?: 'small' | 'large';
  text?: string;
  backgroundColor?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'inline',
  size = 'small',
  text,
  backgroundColor = COLORS.background + 'CC',
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeInOpacity = Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    });

    const scaleUp = Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    });

    const fadeIn = Animated.parallel([fadeInOpacity, scaleUp]);

    const spin = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    fadeIn.start();
    spin.start();

    return () => {
      fadeIn.stop();
      spin.stop();
    };
  }, [opacity, scale, rotation]);

  const spinInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderContent = () => (
    <Animated.View
      style={[
        styles.content,
        {
          opacity,
          transform: [{ scale }, { rotate: spinInterpolation }],
        },
      ]}
    >
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={styles.spinner}
        testID="loading-spinner"
      />
      {text && (
        <Animated.Text
          style={[
            styles.text,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          {text}
        </Animated.Text>
      )}
    </Animated.View>
  );

  switch (variant) {
    case 'fullscreen':
      return (
        <View style={[styles.fullscreen, { backgroundColor }]} testID="loading-wrapper">
          {renderContent()}
        </View>
      );
    case 'overlay':
      return (
        <View style={[styles.overlay, { backgroundColor }]} testID="loading-wrapper">
          {renderContent()}
        </View>
      );
    default:
      return <View style={styles.inline} testID="loading-wrapper">{renderContent()}</View>;
  }
};

const styles = StyleSheet.create({
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  inline: {
    padding: SIZES.sm,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: SIZES.xs,
  },
  text: {
    ...StyleGuide.caption,
    marginTop: SIZES.xs,
  },
});

export default Loading; 