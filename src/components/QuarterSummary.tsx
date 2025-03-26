import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Game } from '../services/game.service';
import { QuarterStats, quarterService } from '../services/quarter.service';

interface QuarterSummaryProps {
  game: Game;
  visible: boolean;
  onClose: () => void;
}

export const QuarterSummary: React.FC<QuarterSummaryProps> = ({
  game,
  visible,
  onClose,
}) => {
  const stats = quarterService.calculateQuarterStats(game, game.quarter);

  const StatRow = ({ label, home, away }: { label: string; home: string; away: string }) => (
    <View style={styles.statRow}>
      <Text style={styles.homeValue}>{home}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.awayValue}>{away}</Text>
    </View>
  );

  const formatPercentage = (made: number, attempted: number): string => {
    if (attempted === 0) return '0.0%';
    return `${((made / attempted) * 100).toFixed(1)}%`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {quarterService.formatQuarterDisplay(game.quarter)} Summary
          </Text>
          
          <View style={styles.headerRow}>
            <Text style={styles.teamName}>{game.homeTeam.name}</Text>
            <Text style={styles.vs}>vs</Text>
            <Text style={styles.teamName}>{game.awayTeam.name}</Text>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.score}>{stats.homeTeam.score}</Text>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.score}>{stats.awayTeam.score}</Text>
          </View>

          <View style={styles.statsContainer}>
            <StatRow
              label="FG"
              home={`${stats.homeTeam.fieldGoalsMade}/${stats.homeTeam.fieldGoalsAttempted}`}
              away={`${stats.awayTeam.fieldGoalsMade}/${stats.awayTeam.fieldGoalsAttempted}`}
            />
            <StatRow
              label="FG%"
              home={formatPercentage(stats.homeTeam.fieldGoalsMade, stats.homeTeam.fieldGoalsAttempted)}
              away={formatPercentage(stats.awayTeam.fieldGoalsMade, stats.awayTeam.fieldGoalsAttempted)}
            />
            <StatRow
              label="3PT"
              home={`${stats.homeTeam.threePointersMade}/${stats.homeTeam.threePointersAttempted}`}
              away={`${stats.awayTeam.threePointersMade}/${stats.awayTeam.threePointersAttempted}`}
            />
            <StatRow
              label="3P%"
              home={formatPercentage(stats.homeTeam.threePointersMade, stats.homeTeam.threePointersAttempted)}
              away={formatPercentage(stats.awayTeam.threePointersMade, stats.awayTeam.threePointersAttempted)}
            />
            <StatRow
              label="FT"
              home={`${stats.homeTeam.freeThrowsMade}/${stats.homeTeam.freeThrowsAttempted}`}
              away={`${stats.awayTeam.freeThrowsMade}/${stats.awayTeam.freeThrowsAttempted}`}
            />
            <StatRow
              label="FT%"
              home={formatPercentage(stats.homeTeam.freeThrowsMade, stats.homeTeam.freeThrowsAttempted)}
              away={formatPercentage(stats.awayTeam.freeThrowsMade, stats.awayTeam.freeThrowsAttempted)}
            />
            <StatRow
              label="REB"
              home={stats.homeTeam.rebounds.toString()}
              away={stats.awayTeam.rebounds.toString()}
            />
            <StatRow
              label="TO"
              home={stats.homeTeam.turnovers.toString()}
              away={stats.awayTeam.turnovers.toString()}
            />
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2c3e50',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    fontSize: 16,
    color: '#7f8c8d',
    marginHorizontal: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginHorizontal: 10,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  statLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    width: 80,
  },
  homeValue: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  awayValue: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 