import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import type { Difficulty } from '@/constants/types';
import { Radius, Spacing } from '@/constants/theme';

interface DifficultyFilterProps {
  selected: Difficulty | null;
  onChange: (value: Difficulty | null) => void;
}

export function DifficultyFilter({ selected, onChange }: DifficultyFilterProps) {
  const tint = useThemeColor({}, 'tint');
  const tintLight = useThemeColor({}, 'tintLight');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const { t } = useLanguage();

  const OPTIONS: { label: string; value: Difficulty | null }[] = [
    { label: t('difficulty.all'), value: null },
    { label: t('difficulty.Easy'), value: 'Easy' },
    { label: t('difficulty.Medium'), value: 'Medium' },
    { label: t('difficulty.Hard'), value: 'Hard' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}>
      {OPTIONS.map((opt) => {
        const active = selected === opt.value;
        return (
          <Pressable
            key={opt.label}
            style={[
              styles.pill,
              {
                backgroundColor: active ? tintLight : 'transparent',
                borderColor: active ? tint : border,
              },
            ]}
            onPress={() => onChange(opt.value)}>
            <ThemedText
              style={[styles.label, { color: active ? tint : text }]}
              lightColor={active ? tint : text}
              darkColor={active ? tint : text}>
              {opt.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
