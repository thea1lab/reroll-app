import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Radius, Spacing } from '@/constants/theme';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
];

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const bg = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');
  const tintLight = useThemeColor({}, 'tintLight');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const FEATURES = [
    {
      emoji: '📂',
      title: t('landing.feature1Title'),
      description: t('landing.feature1Desc'),
    },
    {
      emoji: '🎲',
      title: t('landing.feature2Title'),
      description: t('landing.feature2Desc'),
    },
    {
      emoji: '👨‍🍳',
      title: t('landing.feature3Title'),
      description: t('landing.feature3Desc'),
    },
  ];

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Sign-in error:', error);
      Alert.alert(t('landing.signInFailed'), error?.message || t('landing.signInError'));
      setIsSigningIn(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
      ]}>
      <View pointerEvents="none" style={[styles.blobTop, { backgroundColor: tintLight }]} />
      <View pointerEvents="none" style={[styles.blobMid, { backgroundColor: tintLight }]} />

      <Animated.View entering={FadeInDown.duration(550)} style={styles.languageSection}>
        <ThemedText style={[styles.languageLabel, { color: textSecondary }]}>{t('settings.language')}</ThemedText>
        <View style={styles.languageRow}>
          {LANGUAGES.map((lang) => {
            const active = locale === lang.code;
            return (
              <Pressable
                key={lang.code}
                style={[
                  styles.langPill,
                  {
                    backgroundColor: active ? tintLight : surface,
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
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(120).duration(600)}
        style={[styles.hero, { backgroundColor: surface, borderColor: border }]}>
        <View style={[styles.heroBadge, { backgroundColor: tintLight, borderColor: border }]}>
          <ThemedText style={styles.heroEmoji}>🎲</ThemedText>
          <ThemedText style={[styles.heroBadgeText, { color: tint }]}>{t('landing.badge')}</ThemedText>
        </View>
        <ThemedText type="title" style={styles.heroTitle}>
          {t('landing.title')}
        </ThemedText>
        <ThemedText style={[styles.heroSubtitle, { color: textSecondary }]}>{t('landing.subtitle')}</ThemedText>
      </Animated.View>

      <View style={styles.features}>
        {FEATURES.map((feature, index) => (
          <Animated.View
            key={feature.emoji}
            entering={FadeInDown.delay(320 + index * 120).duration(500)}
            style={[styles.featureCard, { backgroundColor: surface, borderColor: border }]}>
            <View style={[styles.featureEmojiWrap, { backgroundColor: tintLight }]}>
              <ThemedText style={styles.featureEmoji}>{feature.emoji}</ThemedText>
            </View>
            <View style={styles.featureText}>
              <ThemedText type="defaultSemiBold">{feature.title}</ThemedText>
              <ThemedText style={[styles.featureDesc, { color: textSecondary }]}>
                {feature.description}
              </ThemedText>
            </View>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInDown.delay(760).duration(500)} style={styles.signInSection}>
        <Pressable
          style={[styles.signInBtn, { backgroundColor: tint }]}
          onPress={handleSignIn}
          disabled={isSigningIn}>
          {isSigningIn ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.signInText} lightColor="#fff" darkColor="#fff">
              {t('landing.signIn')}
            </ThemedText>
          )}
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
    overflow: 'hidden',
  },
  blobTop: {
    position: 'absolute',
    top: 20,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.5,
  },
  blobMid: {
    position: 'absolute',
    top: 210,
    left: -90,
    width: 200,
    height: 200,
    borderRadius: 999,
    opacity: 0.4,
  },
  languageSection: {
    marginBottom: Spacing.xs,
  },
  languageLabel: {
    fontSize: 13,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  languageRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  langPill: {
    flex: 1,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hero: {
    alignItems: 'center',
    borderRadius: Radius.xl,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.xl,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  heroEmoji: {
    fontSize: 26,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 38,
    textAlign: 'center',
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    gap: Spacing.sm + 2,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  featureEmojiWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  signInSection: {
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  signInBtn: {
    width: '100%',
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  signInText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
