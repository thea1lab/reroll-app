import { Platform, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/theme';

interface RerollButtonProps {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function RerollButton({ onPress, disabled, label = 'Reroll' }: RerollButtonProps) {
  const tint = useThemeColor({}, 'tint');
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  return (
    <AnimatedPressable
      style={[
        styles.button,
        { backgroundColor: tint, opacity: disabled ? 0.5 : 1 },
        animatedStyle,
      ]}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      onPress={handlePress}>
      <ThemedText style={styles.label} lightColor="#fff" darkColor="#fff">
        {label} 🎲
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
  },
});
