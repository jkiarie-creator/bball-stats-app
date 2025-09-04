import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../../src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Game } from '../../../src/services/game.service';
import { QuarterByQuarter } from '../../../src/components/QuarterByQuarter';
import { PlayerQuarterStatsView } from '../../../src/components/PlayerQuarterStats';
import { Timestamp } from 'firebase/firestore';

const GameDetailsScreen = () => {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        const gameRef = doc(db, 'games', gameId);
        const gameDoc = await getDoc(gameRef);
        
        if (gameDoc.exists()) {
          setGame({ id: gameDoc.id, ...gameDoc.data() } as Game);
        } else {
          setError('Game not found');
        }
      } catch (err) {
        console.error('Error loading game:', err);
        setError('Failed to load game details');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !game) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Game not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Text style={styles.date}>
          {game.date instanceof Timestamp 
            ? game.date.toDate().toLocaleDateString()
            : game.date.toLocaleDateString()}
        </Text>
        <View style={styles.scoreContainer}>
          <View style={styles.team}>
            <Text style={styles.teamName}>{game.homeTeam.name}</Text>
            <Text style={styles.score}>{game.homeTeam.score}</Text>
          </View>
          <Text style={styles.vs}>vs</Text>
          <View style={styles.team}>
            <Text style={styles.teamName}>{game.awayTeam.name}</Text>
            <Text style={styles.score}>{game.awayTeam.score}</Text>
          </View>
        </View>
        <Text style={styles.status}>
          {game.status === 'completed' ? 'Final' : `Q${game.quarter}`}
        </Text>
      </Surface>

      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Quarter by Quarter</Text>
        <QuarterByQuarter game={game} />
      </Surface>

      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Player Stats</Text>
        {/* Home Team */}
        <Text style={styles.teamHeader}>{game.homeTeam.name}</Text>
        {game.homeTeam.players.map((player) => (
          <PlayerQuarterStatsView
            key={player.id}
            game={game}
            player={player}
            team="homeTeam"
          />
        ))}

        {/* Away Team */}
        <Text style={styles.teamHeader}>{game.awayTeam.name}</Text>
        {game.awayTeam.players.map((player) => (
          <PlayerQuarterStatsView
            key={player.id}
            game={game}
            player={player}
            team="awayTeam"
          />
        ))}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
  },
  header: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
  },
  team: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  score: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  vs: {
    fontSize: 16,
    color: '#666',
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  teamHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
});

export default GameDetailsScreen;
