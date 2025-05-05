import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TeamSetup } from './TeamSetup';
import type { Team } from '@/types';

describe('TeamSetup Component', () => {
  let mockTeam: Team;
  let mockOnTeamChange: jest.Mock;

  beforeEach(() => {
    mockTeam = {
      id: '1',
      name: 'Home Team',
      players: [],
      timeoutsRemaining: 5,
      foulsInQuarter: 0,
      score: 0,
    };
    mockOnTeamChange = jest.fn();
  });

  test('renders correctly', () => {
    const { getByLabelText } = render(
      <TeamSetup team={mockTeam} onTeamChange={mockOnTeamChange} title="Team Setup" />
    );
    expect(getByLabelText('Team Name')).toBeTruthy();
  });

  test('adds a player', () => {
    const { getByText } = render(
      <TeamSetup team={mockTeam} onTeamChange={mockOnTeamChange} title="Team Setup" />
    );
    fireEvent.press(getByText('Add Player'));
    expect(mockOnTeamChange).toHaveBeenCalled();
  });

  test('updates player name', () => {
    const { getByLabelText, getByText } = render(
      <TeamSetup team={mockTeam} onTeamChange={mockOnTeamChange} title="Team Setup" />
    );
    fireEvent.changeText(getByLabelText('Player Name'), 'New Player');
    expect(mockOnTeamChange).toHaveBeenCalled();
  });

  test('removes a player', () => {
    const { getByText } = render(
      <TeamSetup team={{ ...mockTeam, players: [{ id: '2', name: 'Player 1' }] }} onTeamChange={mockOnTeamChange} title="Team Setup" />
    );
    fireEvent.press(getByText('X'));
    expect(mockOnTeamChange).toHaveBeenCalled();
  });

  test('prevents submission with empty team name', () => {
    const { getByLabelText, getByText } = render(
      <TeamSetup team={{ ...mockTeam, name: '' }} onTeamChange={mockOnTeamChange} title="Team Setup" />
    );
    fireEvent.press(getByText('Submit')); // Assuming there's a submit button
    expect(getByText('Team name is required')).toBeTruthy(); // Assuming there's an error message
  });

  test('prevents adding more than maximum players', () => {
    const { getByText } = render(
      <TeamSetup team={{ ...mockTeam, players: Array(5).fill({ id: '1', name: 'Player' }) }} onTeamChange={mockOnTeamChange} title="Team Setup" />
    );
    fireEvent.press(getByText('Add Player'));
    expect(mockOnTeamChange).not.toHaveBeenCalled(); // Ensure onTeamChange is not called
    expect(getByText('Maximum players reached')).toBeTruthy(); // Assuming there's an error message
  });
});
