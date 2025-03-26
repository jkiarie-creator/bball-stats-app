import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { COLORS, SPACING } from '@/theme';
import { fetchGameHistory } from '@/store/slices/gameSlice';
import type { RootState, AppDispatch, GameData, Player } from '@/types';

export default function GameHistoryScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { gameHistory, loading } = useSelector((state: RootState) => state.game);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchGameHistory(user.id));
    }
  }, [dispatch, user?.id]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTopScorer = (players: Player[]): Player | null => {
    if (!players.length) return null;
    return players.reduce((max, player) => 
      (player.stats.points > max.stats.points) ? player : max
    );
  };

  const renderGameCard = ({ item }: { item: GameData }) => {
    const gameDate = new Date(item.date).toLocaleDateString();
    const homeScore = item.homeTeam.score;
    const awayScore = item.awayTeam.score;
    const winner = homeScore > awayScore ? item.homeTeam.name : item.awayTeam.name;

    const homeTopScorer = getTopScorer(item.homeTeam.players);
    const awayTopScorer = getTopScorer(item.awayTeam.players);

    const quarterDisplay = item.currentQuarter > 4 
      ? `OT${item.currentQuarter - 4}` 
      : `Q${item.currentQuarter}`;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <ThemedText type="subtitle" style={styles.date}>
            {gameDate} - {quarterDisplay}
          </ThemedText>
          
          <View style={styles.scoreRow}>
            <View style={styles.teamColumn}>
              <ThemedText type="subtitle">{item.homeTeam.name}</ThemedText>
              <ThemedText style={[styles.score, homeScore > awayScore && styles.winningScore]}>
                {homeScore}
              </ThemedText>
              {homeTopScorer && (
                <ThemedText style={styles.topScorer}>
                  {homeTopScorer.name}: {homeTopScorer.stats.points} pts
                </ThemedText>
              )}
            </View>
            
            <ThemedText style={styles.vs}>vs</ThemedText>
            
            <View style={styles.teamColumn}>
              <ThemedText type="subtitle">{item.awayTeam.name}</ThemedText>
              <ThemedText style={[styles.score, awayScore > homeScore && styles.winningScore]}>
                {awayScore}
              </ThemedText>
              {awayTopScorer && (
                <ThemedText style={styles.topScorer}>
                  {awayTopScorer.name}: {awayTopScorer.stats.points} pts
                </ThemedText>
              )}
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.statsRow}>
            <ThemedText style={styles.statLabel}>Game Length:</ThemedText>
            <ThemedText>
              {formatTime(item.settings.quarterLength)} per quarter
            </ThemedText>
          </View>

          <View style={styles.statsRow}>
            <ThemedText style={styles.statLabel}>Shot Clock:</ThemedText>
            <ThemedText>
              {item.settings.enableShotClock ? 'Enabled' : 'Disabled'}
            </ThemedText>
          </View>

          <ThemedText style={styles.winner}>
            Winner: {winner}
          </ThemedText>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText>Loading game history...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Game History
        </ThemedText>
        {gameHistory.length === 0 ? (
          <ThemedText style={styles.noGames}>
            No games found. Start a new game to see your history.
          </ThemedText>
        ) : (
          <FlatList
            data={gameHistory}
            renderItem={renderGameCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.large,
  },
  title: {
    marginBottom: SPACING.large,
    textAlign: 'center',
  },
  list: {
    gap: SPACING.medium,
  },
  card: {
    marginBottom: SPACING.medium,
  },
  date: {
    marginBottom: SPACING.small,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.medium,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  vs: {
    marginHorizontal: SPACING.medium,
    color: COLORS.primary,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: SPACING.small,
  },
  winningScore: {
    color: COLORS.success,
  },
  topScorer: {
    fontSize: 12,
    color: COLORS.primary,
  },
  divider: {
    marginVertical: SPACING.medium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.small,
  },
  statLabel: {
    color: COLORS.primary,
  },
  winner: {
    marginTop: SPACING.medium,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.success,
  },
  noGames: {
    textAlign: 'center',
    marginTop: SPACING.xlarge,
  },
});
