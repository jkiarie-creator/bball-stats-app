import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function AuthLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            title: 'Sign In',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: 'Sign Up',
            headerShown: false,
          }}
        />
      </Stack>
    </Provider>
  );
}
