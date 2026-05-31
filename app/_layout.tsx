import '@expo/metro-runtime';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../lib/auth-store';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MD3DarkTheme } from 'react-native-paper';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF6347',
    secondary: '#FF8C47',
  },
};

export default function RootLayout() {
  const { isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        style="light"
        backgroundColor="#1a1a1a"
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
