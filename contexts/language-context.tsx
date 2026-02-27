import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';

const STORAGE_KEY = '@reroll/language';

type TranslateOptions = Record<string, string | number>;

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, options?: TranslateOptions) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
});

function getDeviceLocale(): string {
  const locales = getLocales();
  const lang = locales?.[0]?.languageCode ?? 'en';
  return lang === 'pt' ? 'pt' : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const hasUserSelectedLocale = useRef(false);
  const [locale, setLocaleState] = useState(() => {
    const deviceLocale = getDeviceLocale();
    i18n.locale = deviceLocale;
    return deviceLocale;
  });

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (hasUserSelectedLocale.current) {
        return;
      }
      if (saved && (saved === 'en' || saved === 'pt')) {
        i18n.locale = saved;
        setLocaleState(saved);
      }
    });
  }, []);

  const setLocale = useCallback((newLocale: string) => {
    if (newLocale !== 'en' && newLocale !== 'pt') {
      return;
    }
    hasUserSelectedLocale.current = true;
    i18n.locale = newLocale;
    setLocaleState(newLocale);
    void AsyncStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: string, options?: TranslateOptions) => {
      // This depends on `locale` so consumers re-render on language change
      void locale;
      return i18n.t(key, options);
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
