import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Game, QuarterStats } from '../services/game.service';
import { quarterService } from '../services/quarter.service';

interface QuarterByQuarterProps {
  game: Game;
}

export const QuarterByQuarter: React.FC<QuarterByQuarterProps> = ({ game }) => {
  const formatPercentage = (made: number, attempted: number): string => {
    if (attempted === 0) return '0.0%';
    return `${((made / attempted) * 100).toFixed(1)}%`;
  };

  const renderQuarterHeader = (quarter: number) => (
    <View style={styles.headerCell}>
      <Text style={styles.headerText}>
        {quarter <= 4 ? `Q${quarter}` : `OT${quarter - 4}`}
      </Text>
    </View>
  );

  const renderStatRow = (
    label: string,
    getValue: (stats: QuarterStats['homeTeam' | 'awayTeam']) => string,
    team: 'homeTeam' | 'awayTeam'
  ) => (
    <View style={styles.row}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      {game.quarterStats.map((quarterStats, index) => (
        <View key={index} style={styles.cell}>
          <Text style={styles.cellText}>
            {getValue(quarterStats[team])}
          </Text>
        </View>
      ))}
      <View style={[styles.cell, styles.totalCell]}>
        <Text style={[styles.cellText, styles.totalText]}>
          {getValue(quarterService.calculateQuarterTotals(game)[team])}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView horizontal style={styles.container}>
      <View>
        {/* Headers */}
        <View style={styles.row}>
          <View style={styles.labelCell} />
          {game.quarterStats.map((_, index) => renderQuarterHeader(index + 1))}
          <View style={[styles.headerCell, styles.totalCell]}>
            <Text style={styles.headerText}>Total</Text>
          </View>
        </View>

        {/* Team Names */}
        <View style={styles.teamSection}>
          <Text style={styles.teamName}>{game.homeTeam.name}</Text>
          {renderStatRow(
            'Points',
            stats => stats.score.toString(),
            'homeTeam'
          )}
          {renderStatRow(
            'FG',
            stats => `${stats.fieldGoalsMade}/${stats.fieldGoalsAttempted}`,
            'homeTeam'
          )}
          {renderStatRow(
            'FG%',
            stats => formatPercentage(stats.fieldGoalsMade, stats.fieldGoalsAttempted),
            'homeTeam'
          )}
          {renderStatRow(
            '3PT',
            stats => `${stats.threePointersMade}/${stats.threePointersAttempted}`,
            'homeTeam'
          )}
          {renderStatRow(
            '3P%',
            stats => formatPercentage(stats.threePointersMade, stats.threePointersAttempted),
            'homeTeam'
          )}
          {renderStatRow(
            'FT',
            stats => `${stats.freeThrowsMade}/${stats.freeThrowsAttempted}`,
            'homeTeam'
          )}
          {renderStatRow(
            'REB',
            stats => stats.rebounds.toString(),
            'homeTeam'
          )}
          {renderStatRow(
            'TO',
            stats => stats.turnovers.toString(),
            'homeTeam'
          )}
        </View>

        <View style={styles.teamSection}>
          <Text style={styles.teamName}>{game.awayTeam.name}</Text>
          {renderStatRow(
            'Points',
            stats => stats.score.toString(),
            'awayTeam'
          )}
          {renderStatRow(
            'FG',
            stats => `${stats.fieldGoalsMade}/${stats.fieldGoalsAttempted}`,
            'awayTeam'
          )}
          {renderStatRow(
            'FG%',
            stats => formatPercentage(stats.fieldGoalsMade, stats.fieldGoalsAttempted),
            'awayTeam'
          )}
          {renderStatRow(
            '3PT',
            stats => `${stats.threePointersMade}/${stats.threePointersAttempted}`,
            'awayTeam'
          )}
          {renderStatRow(
            '3P%',
            stats => formatPercentage(stats.threePointersMade, stats.threePointersAttempted),
            'awayTeam'
          )}
          {renderStatRow(
            'FT',
            stats => `${stats.freeThrowsMade}/${stats.freeThrowsAttempted}`,
            'awayTeam'
          )}
          {renderStatRow(
            'REB',
            stats => stats.rebounds.toString(),
            'awayTeam'
          )}
          {renderStatRow(
            'TO',
            stats => stats.turnovers.toString(),
            'awayTeam'
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginVertical: 10,
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
  teamSection: {
    borderTopWidth: 2,
    borderTopColor: '#ecf0f1',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    padding: 8,
    backgroundColor: '#f8f9fa',
  },
}); 