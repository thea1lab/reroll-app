import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import type { Difficulty } from '@/constants/types';
import { Radius, Spacing } from '@/constants/theme';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'small' | 'normal';
}

export function DifficultyBadge({ difficulty, size = 'normal' }: DifficultyBadgeProps) {
  const colorKey = difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'warning' : 'danger';
  const color = useThemeColor({}, colorKey);
  const { t } = useLanguage();

  return (
    <View style={[styles.badge, { borderColor: color }, size === 'small' && styles.badgeSmall]}>
      <ThemedText
        style={[styles.text, { color }, size === 'small' && styles.textSmall]}
        lightColor={color}
        darkColor={color}>
        {t(`difficulty.${difficulty}`)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1.5,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
  },
  badgeSmall: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 11,
  },
});
