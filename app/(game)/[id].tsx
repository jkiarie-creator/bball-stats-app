import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { db } from '../../src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Game } from '../../src/services/game.service';
import { QuarterByQuarter } from '../../src/components/QuarterByQuarter';
import { PlayerQuarterStatsView } from '../../src/components/PlayerQuarterStats';
import { Timestamp } from 'firebase/firestore';

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      if (!id || typeof id !== 'string') return;
      
      try {
        setLoading(true);
        const gameRef = doc(db, 'games', id);
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
  }, [id]);

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  date: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
  },
  team: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  vs: {
    fontSize: 16,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
});
