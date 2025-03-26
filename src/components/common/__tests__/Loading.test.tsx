import React from 'react';
import { render } from '@testing-library/react-native';
import Loading from '../Loading';
import { StyleGuide } from '../../../theme/StyleGuide';

jest.useFakeTimers();

describe('Loading', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<Loading />);
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('renders different variants correctly', () => {
    const variants: Array<'fullscreen' | 'inline' | 'overlay'> = [
      'fullscreen',
      'inline',
      'overlay',
    ];

    variants.forEach((variant) => {
      const { getByTestId } = render(<Loading variant={variant} />);
      expect(getByTestId('loading-spinner')).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes: Array<'small' | 'large'> = ['small', 'large'];

    sizes.forEach((size) => {
      const { getByTestId } = render(<Loading size={size} />);
      expect(getByTestId('loading-spinner')).toBeTruthy();
    });
  });

  it('displays loading text when provided', () => {
    const text = 'Loading...';
    const { getByText } = render(<Loading text={text} />);
    expect(getByText(text)).toBeTruthy();
  });

  it('applies custom background color', () => {
    const backgroundColor = 'rgba(0, 0, 0, 0.5)';
    const { getByTestId } = render(
      <Loading backgroundColor={backgroundColor} variant="fullscreen" />
    );
    const wrapper = getByTestId('loading-wrapper');
    expect(wrapper.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor })
    );
  });

  it('handles animation cleanup on unmount', () => {
    const { unmount } = render(<Loading />);
    unmount();
    // Verify no animation-related errors occur
  });

  it('renders fullscreen variant with correct styles', () => {
    const { getByTestId } = render(<Loading variant="fullscreen" />);
    const wrapper = getByTestId('loading-wrapper');
    expect(wrapper.props.style).toContainEqual(
      expect.objectContaining({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      })
    );
  });

  it('renders overlay variant with correct styles', () => {
    const { getByTestId } = render(<Loading variant="overlay" />);
    const wrapper = getByTestId('loading-wrapper');
    expect(wrapper.props.style).toContainEqual(
      expect.objectContaining({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      })
    );
  });

  it('renders inline variant with correct styles', () => {
    const { getByTestId } = render(<Loading variant="inline" />);
    const wrapper = getByTestId('loading-wrapper');
    expect(wrapper.props.style).toContainEqual(
      expect.objectContaining({
        padding: 8, // SIZES.sm
      })
    );
  });

  it('handles long loading text', () => {
    const longText = 'This is a very long loading message that should still be displayed properly';
    const { getByText } = render(<Loading text={longText} />);
    expect(getByText(longText)).toBeTruthy();
  });
}); 