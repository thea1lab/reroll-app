import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenHeader } from '@/components/screen-header';
import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/storage/data-context';
import { Layout, Radius, Spacing } from '@/constants/theme';
import { ContentContainer } from '@/components/content-container';
import { useResponsive } from '@/hooks/use-responsive';
const GRID_GAP = Spacing.sm;

const FOOD_EMOJIS = [
  '🍳', '🥗', '🍕', '🍔', '🍰', '🥘', '🍜', '🍣',
  '🥐', '🍩', '🥞', '🌮', '🥑', '🍝', '🍱', '🫕',
  '🥧', '🍲', '🧁', '🥪', '🥩', '🍗', '🥡', '🧇',
];

export default function GroupFormModal() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId?: string }>();
  const { groups, addGroup, updateGroup } = useData();
  const tint = useThemeColor({}, 'tint');
  const tintLight = useThemeColor({}, 'tintLight');
  const border = useThemeColor({}, 'border');

  const { width: screenWidth, emojiColumns } = useResponsive();
  const effectiveWidth = Math.min(screenWidth, Layout.modalMaxWidth);
  const cellSize = Math.floor(
    (effectiveWidth - Spacing.md * 2 - GRID_GAP * (emojiColumns - 1)) / emojiColumns
  );

  const existing = groupId ? groups.find((g) => g.id === groupId) : null;
  const [name, setName] = useState(existing?.name ?? '');
  const [emoji, setEmoji] = useState(existing?.emoji ?? '🍳');

  const isValid = name.trim().length > 0;
  const title = existing ? 'Edit Group' : 'New Group';

  const handleSave = () => {
    if (!isValid) return;
    if (existing) {
      updateGroup(existing.id, { name: name.trim(), emoji });
    } else {
      addGroup(name.trim(), emoji);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={title}
        leftIcon={
          <ThemedText style={styles.headerBtn} lightColor={tint} darkColor={tint}>
            Cancel
          </ThemedText>
        }
        onLeftPress={() => router.back()}
        rightIcon={
          <ThemedText
            style={[styles.headerBtn, styles.headerBtnBold, { opacity: isValid ? 1 : 0.4 }]}
            lightColor={tint}
            darkColor={tint}>
            Save
          </ThemedText>
        }
        onRightPress={handleSave}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <ContentContainer maxWidth={Layout.modalMaxWidth}>
          <FormField
            label="Group Name"
            placeholder="e.g. Breakfast, Dinner..."
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <ThemedText style={styles.label}>Emoji</ThemedText>
          <View style={styles.emojiGrid}>
            {FOOD_EMOJIS.map((e) => (
              <Pressable
                key={e}
                style={[
                  styles.emojiBtn,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: emoji === e ? tintLight : 'transparent',
                    borderColor: emoji === e ? tint : border,
                  },
                ]}
                onPress={() => setEmoji(e)}>
                <ThemedText style={[styles.emojiText, { fontSize: cellSize * 0.45 }]}>
                  {e}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </ContentContainer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  emojiBtn: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    textAlign: 'center',
  },
  headerBtn: {
    fontSize: 16,
  },
  headerBtnBold: {
    fontWeight: '600',
  },
});
