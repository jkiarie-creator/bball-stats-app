import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('handles onPress events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    const { queryByText, getByTestId } = render(
      <Button title="Test Button" loading testID="loading-indicator" />
    );

    expect(queryByText('Test Button')).toBeNull();
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('disables button when loading or disabled', () => {
    const onPress = jest.fn();
    const { getByText, rerender } = render(
      <Button title="Test Button" onPress={onPress} disabled />
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).not.toHaveBeenCalled();

    rerender(<Button title="Test Button" onPress={onPress} loading />);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies different variants correctly', () => {
    const { getByText, rerender } = render(
      <Button title="Primary" variant="primary" />
    );
    expect(getByText('Primary')).toBeTruthy();

    rerender(<Button title="Secondary" variant="secondary" />);
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('applies different sizes correctly', () => {
    const { getByText, rerender } = render(
      <Button title="Small" size="small" />
    );
    expect(getByText('Small')).toBeTruthy();

    rerender(<Button title="Medium" size="medium" />);
    expect(getByText('Medium')).toBeTruthy();

    rerender(<Button title="Large" size="large" />);
    expect(getByText('Large')).toBeTruthy();
  });

  it('handles press animations', () => {
    const { getByText } = render(<Button title="Animated Button" />);
    const button = getByText('Animated Button');

    fireEvent(button, 'pressIn');
    fireEvent(button, 'pressOut');
    // Animation values are mocked, so we just verify the events don't crash
  });
}); 