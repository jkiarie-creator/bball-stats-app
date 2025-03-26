import { useCallback } from 'react';
import { Game } from '../services/game.service';
import { statsService, StatType, StatUpdate } from '../services/stats.service';

interface UseStatsProps {
  game: Game;
  onUpdate: (update: Partial<Game>) => void;
}

export const useStats = ({ game, onUpdate }: UseStatsProps) => {
  const updateStat = useCallback((
    playerId: string,
    teamType: 'homeTeam' | 'awayTeam',
    statType: StatType,
    value: number = 1
  ) => {
    const update: StatUpdate = {
      playerId,
      teamType,
      statType,
      value,
      timestamp: Date.now(),
    };

    const gameUpdate = statsService.updateStats(game, update);
    onUpdate(gameUpdate);
  }, [game, onUpdate]);

  const recordFieldGoal = useCallback((
    playerId: string,
    teamType: 'homeTeam' | 'awayTeam',
    made: boolean,
    isThreePointer: boolean
  ) => {
    // Update attempts
    updateStat(playerId, teamType, isThreePointer ? 'threePointersAttempted' : 'fieldGoalsAttempted', 1);
    
    if (made) {
      // Update makes
      updateStat(playerId, teamType, isThreePointer ? 'threePointersMade' : 'fieldGoalsMade', 1);
      // Update points
      updateStat(playerId, teamType, 'points', isThreePointer ? 3 : 2);
    }
  }, [updateStat]);

  const recordFreeThrow = useCallback((
    playerId: string,
    teamType: 'homeTeam' | 'awayTeam',
    made: boolean
  ) => {
    updateStat(playerId, teamType, 'freeThrowsAttempted', 1);
    
    if (made) {
      updateStat(playerId, teamType, 'freeThrowsMade', 1);
      updateStat(playerId, teamType, 'points', 1);
    }
  }, [updateStat]);

  const recordRebound = useCallback((
    playerId: string,
    teamType: 'homeTeam' | 'awayTeam',
    isOffensive: boolean
  ) => {
    updateStat(playerId, teamType, 'rebounds', 1);
    updateStat(
      playerId,
      teamType,
      isOffensive ? 'offensiveRebounds' : 'defensiveRebounds',
      1
    );
  }, [updateStat]);

  const getTeamStats = useCallback((teamType: 'homeTeam' | 'awayTeam') => {
    return statsService.getTeamStats(game, teamType);
  }, [game]);

  const getPlayerStats = useCallback((teamType: 'homeTeam' | 'awayTeam', playerId: string) => {
    return statsService.getPlayerStats(game, teamType, playerId);
  }, [game]);

  const getLeadingScorer = useCallback(() => {
    return statsService.getLeadingScorer(game);
  }, [game]);

  const formatStat = useCallback((value: number, statType: StatType) => {
    return statsService.formatStat(value, statType);
  }, []);

  const getStatDisplay = useCallback((stat: StatType) => {
    return statsService.getStatDisplay(stat);
  }, []);

  return {
    updateStat,
    recordFieldGoal,
    recordFreeThrow,
    recordRebound,
    getTeamStats,
    getPlayerStats,
    getLeadingScorer,
    formatStat,
    getStatDisplay,
  };
}; 