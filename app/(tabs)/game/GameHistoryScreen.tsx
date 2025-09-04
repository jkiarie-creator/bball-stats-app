import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Surface, Title, Text, Button, ActivityIndicator } from 'react-native-paper';
import { collection, query, orderBy, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import type { GameData } from 'src/types/game';

interface Team {
  name: string;
  score: number;
}

interface GameSummary {
  id: string;
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  winner?: string;
}

const GameHistoryScreen = () => {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const gamesRef = collection(db, 'games');
      const q = query(gamesRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const gamesList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setGames(gamesList as GameData[]);
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Failed to load game history. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button mode="contained" onPress={loadGames} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Game History</Title>
      {games.length === 0 ? (
        <Text style={styles.noGames}>No games found</Text>
      ) : (
        games.map((game) => (
          <Surface key={game.id} style={styles.gameCard}>
            <View style={styles.gameHeader}>
              <Text style={styles.gameDate}>{game.startTime}</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.teamName}>{game.homeTeam.name}</Text>
              <Text style={styles.score}>
                {game.homeTeam.score} - {game.awayTeam.score}
              </Text>
              <Text style={styles.teamName}>{game.awayTeam.name}</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statLabel}>Quarter:</Text>
              <Text style={styles.statValue}>{game.currentQuarter}</Text>
              
              <Text style={styles.statLabel}>Time Remaining:</Text>
              <Text style={styles.statValue}>{game.timeRemaining}s</Text>
            </View>
          </Surface>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  gameCard: {
    marginBottom: 16,
    padding: 16,
    elevation: 4,
    backgroundColor: 'white',
  },
  gameHeader: {
    marginBottom: 12,
  },
  gameDate: {
    fontSize: 14,
    color: '#666',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    marginTop: 8,
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  error: {
    textAlign: 'center',
    color: '#f44336',
    marginTop: 20,
    fontSize: 16,
  },
  retryButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  noGames: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default GameHistoryScreen;