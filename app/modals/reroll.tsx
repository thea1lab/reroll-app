import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  SlideInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/storage/data-context';
import { Layout, Radius, Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import type { Difficulty, Recipe } from '@/constants/types';

type Phase = 'shuffle' | 'reveal';

export default function RerollModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { groupId, difficulty } = useLocalSearchParams<{ groupId: string; difficulty?: string }>();
  const { getRecipesForGroup } = useData();
  const tint = useThemeColor({}, 'tint');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const bg = useThemeColor({}, 'background');

  const { isTablet } = useResponsive();
  const diffFilter = (difficulty as Difficulty) || null;
  const eligible = getRecipesForGroup(groupId!, diffFilter);

  const [phase, setPhase] = useState<Phase>('shuffle');
  const [displayIndex, setDisplayIndex] = useState(0);
  const [finalRecipe, setFinalRecipe] = useState<Recipe | null>(null);

  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  const confettiOpacity = useSharedValue(0);
  const shuffleInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSingleRecipe = eligible.length === 1;

  const triggerHaptic = useCallback((style: Haptics.ImpactFeedbackStyle) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style);
    }
  }, []);

  const revealRecipe = useCallback(
    (recipe: Recipe) => {
      setFinalRecipe(recipe);
      setPhase('reveal');
      cardScale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withSpring(1.05, { damping: 8, stiffness: 150 }),
        withSpring(1, { damping: 12 })
      );
      confettiOpacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(1500, withTiming(0, { duration: 500 }))
      );
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    },
    [cardScale, confettiOpacity]
  );

  useEffect(() => {
    if (eligible.length === 0) return;

    if (isSingleRecipe) {
      const timer = setTimeout(() => revealRecipe(eligible[0]), 500);
      return () => clearTimeout(timer);
    }

    // Shuffle phase
    let count = 0;
    const totalCycles = 20;
    let speed = 80;

    const step = () => {
      count++;
      setDisplayIndex((prev) => (prev + 1) % eligible.length);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);

      if (count >= totalCycles) {
        // Pick random winner
        const winnerIdx = Math.floor(Math.random() * eligible.length);
        setDisplayIndex(winnerIdx);
        revealRecipe(eligible[winnerIdx]);
        return;
      }

      // Slow down toward the end
      if (count > totalCycles * 0.6) {
        speed = 80 + (count - totalCycles * 0.6) * 30;
      }

      shuffleInterval.current = setTimeout(step, speed);
    };

    shuffleInterval.current = setTimeout(step, speed);

    return () => {
      if (shuffleInterval.current) clearTimeout(shuffleInterval.current);
    };
  }, [eligible.length, isSingleRecipe, revealRecipe, triggerHaptic]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const confettiStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  if (eligible.length === 0) return null;

  const currentRecipe = phase === 'reveal' && finalRecipe ? finalRecipe : eligible[displayIndex];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <IconSymbol name="xmark" size={24} color={tint} />
        </Pressable>
      </View>

      <View style={styles.center}>
        {phase === 'reveal' && (
          <Animated.View style={[styles.confetti, confettiStyle]} pointerEvents="none">
            {['🎉', '✨', '🎊', '🌟', '🎉', '✨'].map((e, i) => (
              <Animated.Text
                key={i}
                entering={FadeIn.delay(i * 100).duration(300)}
                style={[
                  styles.confettiEmoji,
                  {
                    top: `${15 + Math.random() * 40}%`,
                    left: `${5 + (i * 18) % 90}%`,
                    transform: [{ rotate: `${Math.random() * 40 - 20}deg` }],
                  },
                ]}>
                {e}
              </Animated.Text>
            ))}
          </Animated.View>
        )}

        <Animated.View style={[styles.card, { backgroundColor: surface, borderColor: border }, cardAnimatedStyle]}>
          <ThemedText style={styles.cardEmoji}>
            {phase === 'reveal' ? '🎯' : '🎲'}
          </ThemedText>
          <ThemedText type="title" style={styles.cardTitle} numberOfLines={2}>
            {currentRecipe?.name}
          </ThemedText>
          {phase === 'reveal' && currentRecipe && (
            <ThemedText style={styles.cardMeta} lightColor="#8B7355" darkColor="#A89585">
              {currentRecipe.estimatedTime} min • {currentRecipe.difficulty}
            </ThemedText>
          )}
        </Animated.View>

        {phase === 'reveal' && isSingleRecipe && (
          <Animated.View entering={FadeIn.delay(400)}>
            <ThemedText style={styles.destinyText} lightColor="#8B7355" darkColor="#A89585">
              Destiny has spoken!
            </ThemedText>
          </Animated.View>
        )}
      </View>

      {phase === 'reveal' && finalRecipe && (
        <Animated.View
          entering={SlideInDown.delay(300).springify()}
          style={[styles.actions, { paddingBottom: insets.bottom + Spacing.md }, isTablet && { maxWidth: Layout.modalMaxWidth, alignSelf: 'center' as const, width: '100%' as const }]}>
          <Pressable
            style={[styles.cookBtn, { backgroundColor: tint }]}
            onPress={() => {
              router.back();
              setTimeout(() => {
                router.push({ pathname: '/recipe/[id]', params: { id: finalRecipe.id } });
              }, 100);
            }}>
            <ThemedText style={styles.cookBtnText} lightColor="#fff" darkColor="#fff">
              Let's Cook!
            </ThemedText>
          </Pressable>
          {!isSingleRecipe && (
            <Pressable
              style={[styles.rerollAgainBtn, { borderColor: tint }]}
              onPress={() => {
                setPhase('shuffle');
                setFinalRecipe(null);
                cardScale.value = 1;
                confettiOpacity.value = 0;

                let count = 0;
                const totalCycles = 20;
                let speed = 80;

                const step = () => {
                  count++;
                  setDisplayIndex((prev) => (prev + 1) % eligible.length);
                  triggerHaptic(Haptics.ImpactFeedbackStyle.Light);

                  if (count >= totalCycles) {
                    const winnerIdx = Math.floor(Math.random() * eligible.length);
                    setDisplayIndex(winnerIdx);
                    revealRecipe(eligible[winnerIdx]);
                    return;
                  }
                  if (count > totalCycles * 0.6) {
                    speed = 80 + (count - totalCycles * 0.6) * 30;
                  }
                  shuffleInterval.current = setTimeout(step, speed);
                };
                shuffleInterval.current = setTimeout(step, speed);
              }}>
              <ThemedText style={styles.rerollAgainText} lightColor={tint} darkColor={tint}>
                Reroll Again 🎲
              </ThemedText>
            </Pressable>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  confetti: {
    ...StyleSheet.absoluteFillObject,
  },
  confettiEmoji: {
    position: 'absolute',
    fontSize: 32,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 32,
  },
  cardMeta: {
    marginTop: Spacing.sm,
    fontSize: 15,
  },
  destinyText: {
    marginTop: Spacing.lg,
    fontSize: 16,
    fontStyle: 'italic',
  },
  actions: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  cookBtn: {
    paddingVertical: Spacing.sm + 6,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  cookBtnText: {
    fontSize: 18,
    fontWeight: '700',
  },
  rerollAgainBtn: {
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  rerollAgainText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
