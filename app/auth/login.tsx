import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/common/ThemedText';
import { ThemedView } from '@/components/common/ThemedView';
import { COLORS, SPACING } from '@/theme';
import { login } from '@/store/slices/authSlice';
import type { AppDispatch, RootState } from '@/types';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading: isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await dispatch(login({ email, password })).unwrap();
      router.replace('/(tabs)' as any);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title">Basketball Stats</ThemedText>
          <ThemedText type="subtitle">Sign in to continue</ThemedText>
        </View>

        <View style={styles.form}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {error && (
            <ThemedText style={styles.error}>{error}</ThemedText>
          )}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading || !email || !password}
            style={styles.button}>
            Sign In
          </Button>

          <Button
            mode="text"
            onPress={() => router.push('/(auth)/register' as any)}
            style={styles.link}>
            Don't have an account? Sign Up
          </Button>
        </View>
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
  header: {
    alignItems: 'center',
    marginVertical: SPACING.xlarge,
  },
  form: {
    marginTop: SPACING.large,
  },
  input: {
    marginBottom: SPACING.medium,
  },
  button: {
    marginTop: SPACING.large,
  },
  link: {
    marginTop: SPACING.medium,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
});
