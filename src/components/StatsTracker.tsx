import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Game, Player } from '../services/game.service';
import { useStats } from '../hooks/useStats';
import { StatType } from '../services/stats.service';

interface StatsTrackerProps {
  game: Game;
  onUpdate: (update: Partial<Game>) => void;
}

export const StatsTracker: React.FC<StatsTrackerProps> = ({ game, onUpdate }) => {
  const [selectedTeam, setSelectedTeam] = useState<'homeTeam' | 'awayTeam'>('homeTeam');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  const {
    recordFieldGoal,
    recordFreeThrow,
    recordRebound,
    updateStat,
    getTeamStats,
    getPlayerStats,
    formatStat,
    getStatDisplay,
  } = useStats({ game, onUpdate });

  const commonStats: StatType[] = [
    'assists',
    'steals',
    'blocks',
    'turnovers',
    'fouls',
  ];

  const renderStatButton = (
    label: string,
    onPress: () => void,
    color: string = '#3498db'
  ) => (
    <TouchableOpacity
      style={[styles.statButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.statButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderShotButtons = () => (
    <View style={styles.shotButtonsContainer}>
      <View style={styles.shotTypeContainer}>
        <Text style={styles.sectionTitle}>Field Goals</Text>
        <View style={styles.buttonRow}>
          {renderStatButton('2PT Made', () => 
            selectedPlayer && recordFieldGoal(selectedPlayer.id, selectedTeam, true, false),
            '#27ae60'
          )}
          {renderStatButton('2PT Miss', () => 
            selectedPlayer && recordFieldGoal(selectedPlayer.id, selectedTeam, false, false),
            '#e74c3c'
          )}
        </View>
        <View style={styles.buttonRow}>
          {renderStatButton('3PT Made', () => 
            selectedPlayer && recordFieldGoal(selectedPlayer.id, selectedTeam, true, true),
            '#27ae60'
          )}
          {renderStatButton('3PT Miss', () => 
            selectedPlayer && recordFieldGoal(selectedPlayer.id, selectedTeam, false, true),
            '#e74c3c'
          )}
        </View>
      </View>

      <View style={styles.shotTypeContainer}>
        <Text style={styles.sectionTitle}>Free Throws</Text>
        <View style={styles.buttonRow}>
          {renderStatButton('FT Made', () => 
            selectedPlayer && recordFreeThrow(selectedPlayer.id, selectedTeam, true),
            '#27ae60'
          )}
          {renderStatButton('FT Miss', () => 
            selectedPlayer && recordFreeThrow(selectedPlayer.id, selectedTeam, false),
            '#e74c3c'
          )}
        </View>
      </View>
    </View>
  );

  const renderCommonStats = () => (
    <View style={styles.commonStatsContainer}>
      <Text style={styles.sectionTitle}>Other Stats</Text>
      <View style={styles.statsGrid}>
        {commonStats.map(stat => (
          <TouchableOpacity
            key={stat}
            style={styles.commonStatButton}
            onPress={() => selectedPlayer && updateStat(selectedPlayer.id, selectedTeam, stat)}
          >
            <Text style={styles.commonStatButtonText}>{getStatDisplay(stat)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderReboundButtons = () => (
    <View style={styles.reboundContainer}>
      <Text style={styles.sectionTitle}>Rebounds</Text>
      <View style={styles.buttonRow}>
        {renderStatButton('Off. Rebound', () => 
          selectedPlayer && recordRebound(selectedPlayer.id, selectedTeam, true),
          '#8e44ad'
        )}
        {renderStatButton('Def. Rebound', () => 
          selectedPlayer && recordRebound(selectedPlayer.id, selectedTeam, false),
          '#8e44ad'
        )}
      </View>
    </View>
  );

  const renderPlayerStats = () => {
    if (!selectedPlayer) return null;
    
    const stats = getPlayerStats(selectedTeam, selectedPlayer.id);
    if (!stats) return null;

    return (
      <View style={styles.playerStatsContainer}>
        <Text style={styles.playerStatsTitle}>
          {selectedPlayer.name} - #{selectedPlayer.number}
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>PTS</Text>
            <Text style={styles.statValue}>{stats.points}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>REB</Text>
            <Text style={styles.statValue}>{stats.rebounds}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>AST</Text>
            <Text style={styles.statValue}>{stats.assists}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>FG%</Text>
            <Text style={styles.statValue}>{formatStat(stats.shootingPercentage, 'shootingPercentage')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>3P%</Text>
            <Text style={styles.statValue}>{formatStat(stats.threePointPercentage, 'threePointPercentage')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>FT%</Text>
            <Text style={styles.statValue}>{formatStat(stats.freeThrowPercentage, 'freeThrowPercentage')}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.teamSelector}>
        <TouchableOpacity
          style={[
            styles.teamButton,
            selectedTeam === 'homeTeam' && styles.selectedTeam
          ]}
          onPress={() => setSelectedTeam('homeTeam')}
        >
          <Text style={styles.teamButtonText}>{game.homeTeam.name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.teamButton,
            selectedTeam === 'awayTeam' && styles.selectedTeam
          ]}
          onPress={() => setSelectedTeam('awayTeam')}
        >
          <Text style={styles.teamButtonText}>{game.awayTeam.name}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.playerSelector}
      >
        {game[selectedTeam].players.map(player => (
          <TouchableOpacity
            key={player.id}
            style={[
              styles.playerButton,
              selectedPlayer?.id === player.id && styles.selectedPlayer
            ]}
            onPress={() => setSelectedPlayer(player)}
          >
            <Text style={styles.playerButtonText}>
              {player.name} #{player.number}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedPlayer ? (
        <View style={styles.statsContainer}>
          {renderPlayerStats()}
          {renderShotButtons()}
          {renderReboundButtons()}
          {renderCommonStats()}
        </View>
      ) : (
        <View style={styles.noPlayerSelected}>
          <Text style={styles.noPlayerText}>Select a player to record stats</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  teamSelector: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdde1',
  },
  teamButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#dcdde1',
    alignItems: 'center',
  },
  selectedTeam: {
    backgroundColor: '#3498db',
  },
  teamButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  playerSelector: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdde1',
  },
  playerButton: {
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#dcdde1',
  },
  selectedPlayer: {
    backgroundColor: '#3498db',
  },
  playerButtonText: {
    color: '#2c3e50',
  },
  statsContainer: {
    padding: 10,
  },
  shotButtonsContainer: {
    marginBottom: 20,
  },
  shotTypeContainer: {
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statButton: {
    padding: 15,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  statButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commonStatsContainer: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  commonStatButton: {
    width: '30%',
    padding: 15,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  commonStatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reboundContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  playerStatsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  playerStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  noPlayerSelected: {
    padding: 20,
    alignItems: 'center',
  },
  noPlayerText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
}); 