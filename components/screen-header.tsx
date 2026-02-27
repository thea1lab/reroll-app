import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export function ScreenHeader({ title, subtitle, leftIcon, rightIcon, onLeftPress, onRightPress }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const bg = useThemeColor({}, 'background');

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sm, backgroundColor: bg }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {leftIcon && (
            <Pressable onPress={onLeftPress} hitSlop={12} style={styles.iconBtn}>
              {leftIcon}
            </Pressable>
          )}
        </View>
        <View style={styles.center}>
          <ThemedText type="title" numberOfLines={1} style={styles.title}>
            {title}
          </ThemedText>
        </View>
        <View style={styles.side}>
          {rightIcon && (
            <Pressable onPress={onRightPress} hitSlop={12} style={styles.iconBtn}>
              {rightIcon}
            </Pressable>
          )}
        </View>
      </View>
      {subtitle && (
        <ThemedText style={styles.subtitle} lightColor="#8B7355" darkColor="#A89585">
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  side: {
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 2,
  },
  iconBtn: {
    padding: Spacing.xs,
  },
});
