import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/theme';

interface GroupCardProps {
  emoji: string;
  name: string;
  recipeCount: number;
  onPress: () => void;
  onLongPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GroupCard({ emoji, name, recipeCount, onPress, onLongPress }: GroupCardProps) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.card, { backgroundColor: surface, borderColor: border }, animatedStyle]}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View style={styles.emojiContainer}>
        <ThemedText style={styles.emoji}>{emoji}</ThemedText>
      </View>
      <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.name}>
        {name}
      </ThemedText>
      <ThemedText style={styles.count} lightColor="#8B7355" darkColor="#A89585">
        {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  emojiContainer: {
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 40,
  },
  name: {
    fontSize: 16,
    textAlign: 'center',
  },
  count: {
    fontSize: 13,
    marginTop: 4,
  },
});
