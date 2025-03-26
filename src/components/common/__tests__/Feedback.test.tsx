import React from 'react';
import { fireEvent, render, act } from '@testing-library/react-native';
import { Feedback } from '../Feedback';

jest.useFakeTimers();

describe('Feedback', () => {
  it('renders correctly with required props', () => {
    const { getByText } = render(
      <Feedback type="info" message="Test message" />
    );
    expect(getByText('Test message')).toBeTruthy();
  });

  it('renders different types correctly', () => {
    const types: Array<'success' | 'error' | 'info'> = ['success', 'error', 'info'];
    const { rerender, getByText } = render(
      <Feedback type="info" message="Test message" />
    );

    types.forEach((type) => {
      rerender(<Feedback type={type} message={`${type} message`} />);
      expect(getByText(`${type} message`)).toBeTruthy();
    });
  });

  it('calls onDismiss after duration', () => {
    const onDismiss = jest.fn();
    render(
      <Feedback
        type="info"
        message="Test message"
        duration={1000}
        onDismiss={onDismiss}
      />
    );

    act(() => {
      jest.advanceTimersByTime(1200);
    });

    expect(onDismiss).toHaveBeenCalled();
  });

  it('handles manual dismiss', () => {
    const onDismiss = jest.fn();
    const { getByText } = render(
      <Feedback
        type="info"
        message="Test message"
        onDismiss={onDismiss}
        showDismiss
      />
    );

    const dismissButton = getByText('✕');
    fireEvent.press(dismissButton);

    expect(onDismiss).toHaveBeenCalled();
  });

  it('does not show dismiss button when showDismiss is false', () => {
    const { queryByText } = render(
      <Feedback
        type="info"
        message="Test message"
        showDismiss={false}
      />
    );

    expect(queryByText('✕')).toBeNull();
  });

  it('cleans up animations on unmount', () => {
    const { unmount } = render(
      <Feedback type="info" message="Test message" />
    );

    unmount();
    // Verify no animation-related errors occur
  });

  it('handles different message lengths', () => {
    const longMessage = 'This is a very long message that should still be displayed properly without breaking the layout of the feedback component';
    const { getByText } = render(
      <Feedback type="info" message={longMessage} />
    );

    expect(getByText(longMessage)).toBeTruthy();
  });
}); 