import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Game, Player, PlayerQuarterStats } from '../services/game.service';
import { quarterService } from '../services/quarter.service';

interface PlayerQuarterStatsViewProps {
  game: Game;
  player: Player;
  team: 'homeTeam' | 'awayTeam';
}

export const PlayerQuarterStatsView: React.FC<PlayerQuarterStatsViewProps> = ({
  game,
  player,
  team,
}) => {
  const [selectedStat, setSelectedStat] = useState<keyof PlayerQuarterStats>('points');

  const statOptions: Array<{
    key: keyof PlayerQuarterStats;
    label: string;
    format: (value: number) => string;
  }> = [
    { key: 'points', label: 'PTS', format: v => v.toString() },
    { key: 'rebounds', label: 'REB', format: v => v.toString() },
    { key: 'assists', label: 'AST', format: v => v.toString() },
    { key: 'steals', label: 'STL', format: v => v.toString() },
    { key: 'blocks', label: 'BLK', format: v => v.toString() },
    { key: 'fieldGoalsMade', label: 'FGM', format: v => v.toString() },
    { key: 'fieldGoalsAttempted', label: 'FGA', format: v => v.toString() },
    { key: 'threePointersMade', label: 'TPM', format: v => v.toString() },
    { key: 'threePointersAttempted', label: 'TPA', format: v => v.toString() },
    { key: 'freeThrowsMade', label: 'FTM', format: v => v.toString() },
    { key: 'freeThrowsAttempted', label: 'FTA', format: v => v.toString() },
    { key: 'turnovers', label: 'TO', format: v => v.toString() },
    { key: 'timePlayedSeconds', label: 'MIN', format: v => Math.floor(v / 60).toString() },
  ];

  const calculateTotal = (stat: keyof PlayerQuarterStats): number => {
    return player.quarterStats.reduce((total, qStats) => total + qStats[stat], 0);
  };

  const formatEfficiency = (stats: PlayerQuarterStats): string => {
    const efficiency = (
      stats.points +
      stats.rebounds +
      stats.assists +
      stats.steals +
      stats.blocks -
      (stats.fieldGoalsAttempted - stats.fieldGoalsMade) -
      (stats.freeThrowsAttempted - stats.freeThrowsMade) -
      stats.turnovers
    ).toFixed(1);
    return efficiency;
  };

  const renderStatSelector = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statSelector}>
      {statOptions.map(option => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.statOption,
            selectedStat === option.key && styles.selectedStatOption,
          ]}
          onPress={() => setSelectedStat(option.key)}
        >
          <Text
            style={[
              styles.statOptionText,
              selectedStat === option.key && styles.selectedStatOptionText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.playerName}>
          {player.name} #{player.number}
        </Text>
        <Text style={styles.position}>{player.position || 'N/A'}</Text>
      </View>

      {renderStatSelector()}

      <ScrollView horizontal style={styles.statsTable}>
        <View>
          <View style={styles.row}>
            <View style={styles.labelCell} />
            {player.quarterStats.map((_, index) => (
              <View key={index} style={styles.headerCell}>
                <Text style={styles.headerText}>
                  {quarterService.formatQuarterDisplay(index + 1)}
                </Text>
              </View>
            ))}
            <View style={[styles.headerCell, styles.totalCell]}>
              <Text style={styles.headerText}>Total</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>
                {statOptions.find(opt => opt.key === selectedStat)?.label}
              </Text>
            </View>
            {player.quarterStats.map((quarterStats, index) => (
              <View key={index} style={styles.cell}>
                <Text style={styles.cellText}>
                  {statOptions.find(opt => opt.key === selectedStat)?.format(quarterStats[selectedStat])}
                </Text>
              </View>
            ))}
            <View style={[styles.cell, styles.totalCell]}>
              <Text style={[styles.cellText, styles.totalText]}>
                {statOptions.find(opt => opt.key === selectedStat)?.format(calculateTotal(selectedStat))}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>EFF</Text>
            </View>
            {player.quarterStats.map((quarterStats, index) => (
              <View key={index} style={styles.cell}>
                <Text style={styles.cellText}>
                  {formatEfficiency(quarterStats)}
                </Text>
              </View>
            ))}
            <View style={[styles.cell, styles.totalCell]}>
              <Text style={[styles.cellText, styles.totalText]}>
                {formatEfficiency({
                  points: calculateTotal('points'),
                  rebounds: calculateTotal('rebounds'),
                  assists: calculateTotal('assists'),
                  steals: calculateTotal('steals'),
                  blocks: calculateTotal('blocks'),
                  fouls: calculateTotal('fouls'),
                  fieldGoalsMade: calculateTotal('fieldGoalsMade'),
                  fieldGoalsAttempted: calculateTotal('fieldGoalsAttempted'),
                  threePointersMade: calculateTotal('threePointersMade'),
                  threePointersAttempted: calculateTotal('threePointersAttempted'),
                  freeThrowsMade: calculateTotal('freeThrowsMade'),
                  freeThrowsAttempted: calculateTotal('freeThrowsAttempted'),
                  turnovers: calculateTotal('turnovers'),
                  offensiveRebounds: calculateTotal('offensiveRebounds'),
                  defensiveRebounds: calculateTotal('defensiveRebounds'),
                  efficiency: 0,
                  timePlayedSeconds: calculateTotal('timePlayedSeconds'),
                })}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  position: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  statSelector: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  statOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
  },
  selectedStatOption: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  statOptionText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  selectedStatOptionText: {
    color: '#fff',
  },
  statsTable: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  labelCell: {
    width: 80,
    padding: 8,
    justifyContent: 'center',
  },
  cell: {
    width: 70,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCell: {
    width: 70,
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  totalCell: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 1,
    borderLeftColor: '#ecf0f1',
  },
  labelText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  cellText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalText: {
    fontWeight: 'bold',
  },
}); 