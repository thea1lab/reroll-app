import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@reroll/theme';

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  colorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  preference: 'light',
  setPreference: () => {},
  colorScheme: 'light',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const hasUserSelected = useRef(false);
  const [preference, setPreferenceState] = useState<ThemePreference>('light');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (hasUserSelected.current) return;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setPreferenceState(saved);
      }
    });
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    hasUserSelected.current = true;
    setPreferenceState(pref);
    void AsyncStorage.setItem(STORAGE_KEY, pref);
  }, []);

  const colorScheme: 'light' | 'dark' =
    preference === 'system' ? (systemScheme ?? 'light') : preference;

  return (
    <ThemeContext.Provider value={{ preference, setPreference, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
