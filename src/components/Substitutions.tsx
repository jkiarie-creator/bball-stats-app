import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Game, Player } from '../services/game.service';
import { useSubstitutions } from '../hooks/useSubstitutions';

interface SubstitutionsProps {
  game: Game;
  teamType: 'homeTeam' | 'awayTeam';
  onUpdate: (update: Partial<Game>) => void;
}

export const Substitutions: React.FC<SubstitutionsProps> = ({
  game,
  teamType,
  onUpdate,
}) => {
  const {
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
  } = useSubstitutions({ game, teamType, onUpdate });

  const renderPlayer = (player: Player, isActive: boolean) => {
    const timeInGame = getPlayerTimeInGame(player);
    const selected = isPlayerSelected(player);
    const canSelect = canSubstitute(player);

    return (
      <TouchableOpacity
        key={player.id}
        style={[
          styles.playerCard,
          selected && styles.selectedPlayer,
          !canSelect && styles.disabledPlayer,
          isActive && styles.activePlayer,
        ]}
        onPress={() => canSelect && handlePlayerSelect(player)}
        disabled={!canSelect}
      >
        <Text style={styles.playerNumber}>#{player.number}</Text>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerPosition}>{player.position || 'N/A'}</Text>
          <Text style={styles.playTime}>
            {formatPlayTime(timeInGame)}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>PTS: {player.stats.points}</Text>
          <Text style={styles.statText}>REB: {player.stats.rebounds}</Text>
          <Text style={styles.statText}>AST: {player.stats.assists}</Text>
          <Text style={styles.statText}>F: {player.stats.fouls}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {game[teamType].name} - {selectedPlayer ? 'Select player to substitute' : 'Substitutions'}
      </Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={cancelSelection}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.courtContainer}>
        <Text style={styles.sectionTitle}>On Court</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.playersRow}>
            {activePlayers.map(player => renderPlayer(player, true))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.benchContainer}>
        <Text style={styles.sectionTitle}>Bench</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.playersRow}>
            {benchPlayers.map(player => renderPlayer(player, false))}
          </View>
        </ScrollView>
      </View>

      {selectedPlayer && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={cancelSelection}
        >
          <Text style={styles.cancelButtonText}>Cancel Selection</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#34495e',
  },
  courtContainer: {
    marginBottom: 20,
  },
  benchContainer: {
    marginBottom: 10,
  },
  playersRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    minWidth: 200,
  },
  selectedPlayer: {
    backgroundColor: '#3498db',
  },
  disabledPlayer: {
    opacity: 0.5,
  },
  activePlayer: {
    borderColor: '#27ae60',
    borderWidth: 2,
  },
  playerNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#2c3e50',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  playerPosition: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  playTime: {
    fontSize: 14,
    color: '#7f8c8d',
    fontFamily: 'monospace',
  },
  statsContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: '#fff',
    flex: 1,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 