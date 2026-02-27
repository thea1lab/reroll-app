import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
