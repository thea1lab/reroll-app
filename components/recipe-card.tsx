import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { DifficultyBadge } from '@/components/difficulty-badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/theme';
import type { Recipe } from '@/constants/types';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.card, { backgroundColor: surface, borderColor: border }, animatedStyle]}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      onPress={onPress}>
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.name}>
          {recipe.name}
        </ThemedText>
        <View style={styles.meta}>
          <View style={styles.time}>
            <IconSymbol name="clock" size={14} color={iconColor} />
            <ThemedText style={styles.timeText} lightColor="#8B7355" darkColor="#A89585">
              {recipe.estimatedTime} min
            </ThemedText>
          </View>
          <DifficultyBadge difficulty={recipe.difficulty} size="small" />
        </View>
      </View>
      <IconSymbol name="chevron.right" size={18} color={iconColor} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 13,
  },
});
