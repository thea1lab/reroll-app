import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DataProvider } from '@/storage/data-context';

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
    primary: Colors.light.tint,
  },
};

const DarkAppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
    primary: Colors.dark.tint,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkAppTheme : LightTheme}>
      <DataProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="group/[id]" />
          <Stack.Screen name="recipe/[id]" />
          <Stack.Screen name="modals/group-form" options={{ presentation: 'modal' }} />
          <Stack.Screen name="modals/recipe-form" options={{ presentation: 'modal' }} />
          <Stack.Screen name="modals/reroll" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        </Stack>
        <StatusBar style="auto" />
      </DataProvider>
    </ThemeProvider>
  );
}
