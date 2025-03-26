import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../../theme';

interface StatAction {
  type: string;
  value: number;
  timestamp: number;
  player: string;
}

interface PlayerStats {
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
}

interface LiveStatsTrackerProps {
  playerId: string;
  playerName: string;
  onStatUpdate?: (stats: PlayerStats) => void;
  onAction?: (action: StatAction) => void;
}

const LiveStatsTracker: React.FC<LiveStatsTrackerProps> = ({
  playerId,
  playerName,
  onStatUpdate,
  onAction,
}) => {
  const [stats, setStats] = useState<PlayerStats>({
    points: 0,
    assists: 0,
    rebounds: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    fouls: 0,
  });

  const handleStatUpdate = (type: keyof PlayerStats, value: number) => {
    const newStats = {
      ...stats,
      [type]: Math.max(0, stats[type] + value),
    };

    setStats(newStats);
    onStatUpdate?.(newStats);

    const action: StatAction = {
      type,
      value,
      timestamp: Date.now(),
      player: playerId,
    };
    onAction?.(action);
  };

  const StatButton = ({ type, label, color }: { type: keyof PlayerStats; label: string; color: string }) => (
    <View style={styles.statContainer}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statActions}>
        <TouchableOpacity
          style={[styles.statButton, { backgroundColor: color }]}
          onPress={() => handleStatUpdate(type, -1)}
        >
          <Text style={styles.statButtonText}>-</Text>
        </TouchableOpacity>
        <Animatable.Text
          animation={stats[type] > 0 ? 'bounceIn' : undefined}
          style={[styles.statValue, { color }]}
        >
          {stats[type]}
        </Animatable.Text>
        <TouchableOpacity
          style={[styles.statButton, { backgroundColor: color }]}
          onPress={() => handleStatUpdate(type, 1)}
        >
          <Text style={styles.statButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Animatable.View animation="fadeIn" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.playerName}>{playerName}</Text>
      </View>
      <View style={styles.statsGrid}>
        <StatButton type="points" label="PTS" color={COLORS.points} />
        <StatButton type="assists" label="AST" color={COLORS.assists} />
        <StatButton type="rebounds" label="REB" color={COLORS.rebounds} />
        <StatButton type="steals" label="STL" color={COLORS.steals} />
        <StatButton type="blocks" label="BLK" color={COLORS.blocks} />
        <StatButton type="turnovers" label="TO" color={COLORS.turnovers} />
        <StatButton type="fouls" label="FOULS" color={COLORS.warning} />
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    margin: SPACING.sm,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statContainer: {
    width: '45%',
    marginVertical: SPACING.xs,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: SPACING.xs,
  },
  statActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.light,
  },
  statButtonText: {
    color: COLORS.surface,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 36,
    textAlign: 'center',
  },
});

export default LiveStatsTracker; 