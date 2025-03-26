import { useState, useCallback } from 'react';
import { Game, Player } from '../services/game.service';
import { substitutionService, SubstitutionError } from '../services/substitution.service';

interface UseSubstitutionsProps {
  game: Game;
  teamType: 'homeTeam' | 'awayTeam';
  onUpdate: (update: Partial<Game>) => void;
}

export const useSubstitutions = ({ game, teamType, onUpdate }: UseSubstitutionsProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activePlayers = substitutionService.getActivePlayersWithStats(game, teamType);
  const benchPlayers = substitutionService.getBenchedPlayersWithStats(game, teamType);

  const handlePlayerSelect = useCallback((player: Player) => {
    if (selectedPlayer) {
      // If we already have a selected player, attempt substitution
      try {
        const isSelectedActive = game[teamType].activePlayers.includes(selectedPlayer.id);
        const isClickedActive = game[teamType].activePlayers.includes(player.id);

        // Determine which player is coming in and which is going out
        const incomingId = isSelectedActive ? player.id : selectedPlayer.id;
        const outgoingId = isSelectedActive ? selectedPlayer.id : player.id;

        const update = substitutionService.makeSubstitution(
          game,
          teamType,
          incomingId,
          outgoingId
        );
        
        onUpdate(update);
        setSelectedPlayer(null);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      // First player selection
      setSelectedPlayer(player);
      setError(null);
    }
  }, [game, teamType, selectedPlayer, onUpdate]);

  const cancelSelection = useCallback(() => {
    setSelectedPlayer(null);
    setError(null);
  }, []);

  const getPlayerTimeInGame = useCallback((player: Player) => {
    return substitutionService.getPlayerTimeInGame(player, game);
  }, [game]);

  const formatPlayTime = useCallback((seconds: number) => {
    return substitutionService.formatPlayTime(seconds);
  }, []);

  const isPlayerSelected = useCallback((player: Player) => {
    return selectedPlayer?.id === player.id;
  }, [selectedPlayer]);

  const canSubstitute = useCallback((player: Player) => {
    if (!selectedPlayer) return true;
    
    const isSelectedActive = game[teamType].activePlayers.includes(selectedPlayer.id);
    const isPlayerActive = game[teamType].activePlayers.includes(player.id);
    
    // Can't substitute two benched players or two active players
    return isSelectedActive !== isPlayerActive;
  }, [game, teamType, selectedPlayer]);

  return {
    activePlayers,
    benchPlayers,
    selectedPlayer,
    error,
    handlePlayerSelect,
    cancelSelection,
    getPlayerTimeInGame,
    formatPlayTime,
    isPlayerSelected,
    canSubstitute,
  };
}; 