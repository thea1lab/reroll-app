import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/contexts/auth-context';
import { Radius, Spacing } from '@/constants/theme';

const FEATURES = [
  {
    emoji: '📂',
    title: 'Organize Your Recipes',
    description: 'Group your favorite recipes into custom collections.',
  },
  {
    emoji: '🎲',
    title: 'Reroll & Discover',
    description: "Can't decide what to cook? Let Reroll pick for you!",
  },
  {
    emoji: '👨‍🍳',
    title: 'Cook with Confidence',
    description: 'Step-by-step instructions for every recipe.',
  },
];

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const tint = useThemeColor({}, 'tint');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      setIsSigningIn(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
      ]}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
        <ThemedText style={styles.heroEmoji}>🎲</ThemedText>
        <ThemedText type="title" style={styles.heroTitle}>
          Reroll
        </ThemedText>
        <ThemedText style={[styles.heroSubtitle, { color: textSecondary }]}>
          What should we cook today?
        </ThemedText>
      </Animated.View>

      <View style={styles.features}>
        {FEATURES.map((feature, index) => (
          <Animated.View
            key={feature.title}
            entering={FadeInDown.delay(200 + index * 150).duration(500)}
            style={[styles.featureCard, { backgroundColor: surface, borderColor: border }]}>
            <ThemedText style={styles.featureEmoji}>{feature.emoji}</ThemedText>
            <View style={styles.featureText}>
              <ThemedText type="defaultSemiBold">{feature.title}</ThemedText>
              <ThemedText style={[styles.featureDesc, { color: textSecondary }]}>
                {feature.description}
              </ThemedText>
            </View>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInDown.delay(700).duration(500)} style={styles.signInSection}>
        <Pressable
          style={[styles.signInBtn, { backgroundColor: tint }]}
          onPress={handleSignIn}
          disabled={isSigningIn}>
          {isSigningIn ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.signInText} lightColor="#fff" darkColor="#fff">
              Sign in with Google
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
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: 36,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: 18,
  },
  features: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  featureEmoji: {
    fontSize: 32,
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
  },
  signInBtn: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  signInText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
