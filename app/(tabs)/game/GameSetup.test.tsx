import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import GameSetupScreen from './setup';

describe('GameSetupScreen Component', () => {
  test('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <GameSetupScreen />
      </Provider>
    );
    expect(getByText('Game Setup')).toBeTruthy();
  });

  test('starts a new game', () => {
    const { getByText } = render(
      <Provider store={store}>
        <GameSetupScreen />
      </Provider>
    );
    fireEvent.changeText(getByText('Team Name'), 'Home Team');
    fireEvent.press(getByText('Start Game'));
    // Add assertions to check if the game started correctly
  });
});
