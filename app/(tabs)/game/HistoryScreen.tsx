import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SPACING, SHADOWS } from '../../theme';
import { Header, EmptyState } from '../../components/common';
import { fetchGameHistory } from '../../store/slices/gameSlice';
import type { RootState, AppDispatch } from '../../store';

const HistoryScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { gameHistory, isLoading } = useSelector(
    (state: RootState) => state.game
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchGameHistory(user.uid));
    }
  }, [dispatch, user]);

  const renderGameCard = (game: typeof gameHistory[0]) => (
    <Card key={game.id} style={styles.gameCard} mode="elevated">
      <Card.Content>
        <Text style={styles.date}>
          {game.date.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.scoreContainer}>
          <View style={styles.teamContainer}>
            <Text style={styles.teamName}>{game.homeTeam.name}</Text>
            <Text
              style={[styles.score, { color: game.homeTeam.color }]}
            >
              {game.finalScore.home}
            </Text>
          </View>

          <Text style={styles.vs}>vs</Text>

          <View style={styles.teamContainer}>
            <Text style={styles.teamName}>{game.awayTeam.name}</Text>
            <Text
              style={[styles.score, { color: game.awayTeam.color }]}
            >
              {game.finalScore.away}
            </Text>
          </View>
        </View>

        <View style={styles.statsPreview}>
          <Text style={styles.statsText}>
            {game.homeTeam.players.length} players • {' '}
            {game.finalScore.home + game.finalScore.away} total points
          </Text>
        </View>
      </Card.Content>

      <Card.Actions>
        <IconButton
          icon="chart-box"
          iconColor={COLORS.primary}
          size={24}
          onPress={() => {}}
        />
        <IconButton
          icon="share"
          iconColor={COLORS.primary}
          size={24}
          onPress={() => {}}
        />
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Game History" />
      <ScrollView style={styles.content}>
        {isLoading ? (
          <EmptyState
            title="Loading..."
            message="Fetching your game history"
            animation="loading"
          />
        ) : gameHistory.length === 0 ? (
          <EmptyState
            title="No Games Yet"
            message="Your game history will appear here"
            animation="empty-list"
          />
        ) : (
          gameHistory.map(renderGameCard)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  gameCard: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  date: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  vs: {
    fontSize: 16,
    color: COLORS.subtext,
    marginHorizontal: SPACING.md,
  },
  statsPreview: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.subtext,
  },
  statsText: {
    fontSize: 14,
    color: COLORS.subtext,
    textAlign: 'center',
  },
});

export default HistoryScreen; 