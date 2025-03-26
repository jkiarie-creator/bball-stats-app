import { useState, useCallback } from 'react';

interface UseUXOptions {
  defaultLoadingText?: string;
  defaultFeedbackDuration?: number;
}

interface FeedbackMessage {
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export const useUX = (options: UseUXOptions = {}) => {
  const {
    defaultLoadingText = 'Loading...',
    defaultFeedbackDuration = 3000,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(defaultLoadingText);
  const [loadingVariant, setLoadingVariant] = useState<'fullscreen' | 'inline' | 'overlay'>('inline');
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const showLoading = useCallback((text?: string, variant?: 'fullscreen' | 'inline' | 'overlay') => {
    setLoadingText(text || defaultLoadingText);
    setLoadingVariant(variant || 'inline');
    setIsLoading(true);
  }, [defaultLoadingText]);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const showFeedback = useCallback((
    type: 'success' | 'error' | 'info',
    message: string,
    duration?: number
  ) => {
    setFeedback({
      type,
      message,
      duration: duration || defaultFeedbackDuration,
    });
  }, [defaultFeedbackDuration]);

  const hideFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  const withLoading = useCallback(async <T,>(
    promise: Promise<T>,
    text?: string,
    variant?: 'fullscreen' | 'inline' | 'overlay'
  ): Promise<T> => {
    try {
      showLoading(text, variant);
      const result = await promise;
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return {
    // Loading
    isLoading,
    loadingText,
    loadingVariant,
    showLoading,
    hideLoading,
    withLoading,

    // Feedback
    feedback,
    showFeedback,
    hideFeedback,

    // Convenience methods
    showSuccess: useCallback((message: string, duration?: number) => {
      showFeedback('success', message, duration);
    }, [showFeedback]),
    showError: useCallback((message: string, duration?: number) => {
      showFeedback('error', message, duration);
    }, [showFeedback]),
    showInfo: useCallback((message: string, duration?: number) => {
      showFeedback('info', message, duration);
    }, [showFeedback]),
  };
}; 