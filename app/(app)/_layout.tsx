import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../lib/auth-store';

export default function AppLayout() {
  const { user } = useAuthStore();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}