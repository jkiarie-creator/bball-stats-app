declare module 'lottie-react-native' {
  import * as React from 'react';
  import { ViewStyle, StyleProp } from 'react-native';

  export interface AnimationProps {
    source: string | object | { uri: string };
    progress?: number;
    speed?: number;
    duration?: number;
    loop?: boolean;
    autoPlay?: boolean;
    autoSize?: boolean;
    style?: StyleProp<ViewStyle>;
    resizeMode?: 'cover' | 'contain' | 'center';
    onAnimationFinish?: (isCancelled: boolean) => void;
    [key: string]: any; // Allow additional props
  }

  type Props = AnimationProps & React.ComponentProps<any>;

  export default class LottieView extends React.Component<Props> {
    play: (startFrame?: number, endFrame?: number) => void;
    reset: () => void;
    pause: () => void;
    resume: () => void;
    props: Props;
    context: any;
    setState: React.Component['setState'];
    forceUpdate: React.Component['forceUpdate'];
    refs: {
      [key: string]: React.ReactInstance;
    };
  }
} 