import { ContentContainer } from '@/components/content-container';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
] as const;

const THEMES = ['light', 'dark', 'system'] as const;

export default function SettingsModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const { preference, setPreference } = useTheme();
  const tint = useThemeColor({}, 'tint');
  const tintLight = useThemeColor({}, 'tintLight');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const danger = useThemeColor({}, 'danger');
  const text = useThemeColor({}, 'text');

  const handleSignOut = () => {
    Alert.alert(t('settings.signOut'), t('settings.signOutMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.signOut'),
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.dismissAll();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={t('settings.title')}
        leftIcon={
          <ThemedText style={styles.headerBtn} lightColor={tint} darkColor={tint}>
            {t('common.done')}
          </ThemedText>
        }
        onLeftPress={() => router.back()}
      />
      <View style={[styles.content, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <ContentContainer>
          {user && (
            <View style={[styles.profileCard, { backgroundColor: surface, borderColor: border }]}>
              <ThemedText style={styles.profileEmoji}>👤</ThemedText>
              <View style={styles.profileInfo}>
                <ThemedText type="defaultSemiBold" numberOfLines={1}>
                  {user.displayName || t('common.user')}
                </ThemedText>
                <ThemedText style={styles.email} lightColor="#8B7355" darkColor="#A89585" numberOfLines={1}>
                  {user.email}
                </ThemedText>
              </View>
            </View>
          )}

          <View style={styles.languageSection}>
            <ThemedText style={styles.languageLabel}>{t('settings.language')}</ThemedText>
            <View style={styles.languageRow}>
              {LANGUAGES.map((lang) => {
                const active = locale === lang.code;
                return (
                  <Pressable
                    key={lang.code}
                    style={[
                      styles.langPill,
                      {
                        backgroundColor: active ? tintLight : 'transparent',
                        borderColor: active ? tint : border,
                      },
                    ]}
                    onPress={() => setLocale(lang.code)}>
                    <ThemedText
                      style={[styles.langText, { color: active ? tint : text }]}
                      lightColor={active ? tint : text}
                      darkColor={active ? tint : text}>
                      {lang.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.languageSection}>
            <ThemedText style={styles.languageLabel}>{t('settings.theme')}</ThemedText>
            <View style={styles.languageRow}>
              {THEMES.map((key) => {
                const active = preference === key;
                const label = t(
                  key === 'light'
                    ? 'settings.themeLight'
                    : key === 'dark'
                      ? 'settings.themeDark'
                      : 'settings.themeSystem'
                );
                return (
                  <Pressable
                    key={key}
                    style={[
                      styles.langPill,
                      {
                        backgroundColor: active ? tintLight : 'transparent',
                        borderColor: active ? tint : border,
                      },
                    ]}
                    onPress={() => setPreference(key)}>
                    <ThemedText
                      style={[styles.langText, { color: active ? tint : text }]}
                      lightColor={active ? tint : text}
                      darkColor={active ? tint : text}>
                      {label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.spacer} />

          <Pressable style={[styles.signOutBtn, { borderColor: danger }]} onPress={handleSignOut}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color={danger} />
            <ThemedText style={styles.signOutText} lightColor={danger} darkColor={danger}>
              {t('settings.signOut')}
            </ThemedText>
          </Pressable>
        </ContentContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  profileEmoji: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  email: {
    fontSize: 14,
  },
  languageSection: {
    marginTop: Spacing.lg,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  languageRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  langPill: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
    marginVertical: Spacing.lg,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 4,
    borderWidth: 1.5,
    borderRadius: Radius.md,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerBtn: {
    fontSize: 16,
  },
});
