import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations, { type AppLocale } from '@/i18n';

const STORAGE_KEY = '@ricetta/language';

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

function getDeviceLocale(): AppLocale {
  const locales = getLocales();
  const lang = locales?.[0]?.languageCode ?? 'en';
  return lang === 'pt' ? 'pt' : 'en';
}

function resolve(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const hasUserSelectedLocale = useRef(false);
  const [locale, setLocaleState] = useState<AppLocale>(getDeviceLocale);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (hasUserSelectedLocale.current) {
        return;
      }
      if (saved && (saved === 'en' || saved === 'pt')) {
        setLocaleState(saved);
      }
    });
  }, []);

  const setLocale = useCallback((newLocale: string) => {
    if (newLocale !== 'en' && newLocale !== 'pt') {
      return;
    }
    hasUserSelectedLocale.current = true;
    setLocaleState(newLocale);
    void AsyncStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const t = useCallback(
    (key: string, options?: TranslateOptions) => {
      const dict = translations[locale];
      let value = resolve(dict, key);

      // Handle pluralization (e.g. recipeCount: { one, other })
      if (typeof value === 'object' && value !== null && options?.count !== undefined) {
        const count = Number(options.count);
        value = count === 1 ? value.one : value.other;
      }

      if (typeof value !== 'string') return key;

      // Handle interpolation (e.g. %{name})
      if (options) {
        Object.entries(options).forEach(([k, v]) => {
          value = (value as string).replace(`%{${k}}`, String(v));
        });
      }

      return value;
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
