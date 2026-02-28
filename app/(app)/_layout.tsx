import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { DataProvider } from '@/storage/data-context';

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/landing" />;
  }

  return (
    <DataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="group/[id]" />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen name="modals/group-form" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modals/recipe-form" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modals/ricetta" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="modals/settings" options={{ presentation: 'modal' }} />
      </Stack>
    </DataProvider>
  );
}
