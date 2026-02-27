import { ContentContainer } from '@/components/content-container';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const tint = useThemeColor({}, 'tint');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const danger = useThemeColor({}, 'danger');

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
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
        title="Settings"
        leftIcon={
          <ThemedText style={styles.headerBtn} lightColor={tint} darkColor={tint}>
            Done
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
                  {user.displayName || 'User'}
                </ThemedText>
                <ThemedText style={styles.email} lightColor="#8B7355" darkColor="#A89585" numberOfLines={1}>
                  {user.email}
                </ThemedText>
              </View>
            </View>
          )}

          <View style={styles.spacer} />

          <Pressable style={[styles.signOutBtn, { borderColor: danger }]} onPress={handleSignOut}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color={danger} />
            <ThemedText style={styles.signOutText} lightColor={danger} darkColor={danger}>
              Sign Out
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
  spacer: {
    flex: 1,
    marginVertical: Spacing.xs,
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
