import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../lib/auth-store';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  useEffect(() => {
    async function prepare() {

      // fake loading
      await new Promise(resolve => setTimeout(resolve, 2000));

      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}