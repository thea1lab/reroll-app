import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/screen-header';
import { RecipeCard } from '@/components/recipe-card';
import { DifficultyFilter } from '@/components/difficulty-filter';
import { EmptyState } from '@/components/empty-state';
import { RerollButton } from '@/components/reroll-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/storage/data-context';
import { Layout, Radius, Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import type { Difficulty, Recipe } from '@/constants/types';

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { groups, getRecipesForGroup } = useData();
  const [filter, setFilter] = useState<Difficulty | null>(null);
  const { recipeColumns, isTablet } = useResponsive();
  const tint = useThemeColor({}, 'tint');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const group = groups.find((g) => g.id === id);
  const filteredRecipes = getRecipesForGroup(id!, filter);
  const allRecipes = getRecipesForGroup(id!);

  if (!group) return null;

  const renderItem = ({ item }: { item: Recipe }) => {
    const card = (
      <RecipeCard
        recipe={item}
        onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: item.id } })}
      />
    );
    if (recipeColumns > 1) {
      return <View style={{ flex: 1 }}>{card}</View>;
    }
    return card;
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={`${group.emoji} ${group.name}`}
        leftIcon={<IconSymbol name="chevron.left" size={24} color={tint} />}
        onLeftPress={() => router.back()}
        rightIcon={<IconSymbol name="pencil" size={20} color={iconColor} />}
        onRightPress={() => router.push({ pathname: '/modals/group-form', params: { groupId: group.id } })}
      />
      {allRecipes.length > 0 && <DifficultyFilter selected={filter} onChange={setFilter} />}
      {filteredRecipes.length === 0 ? (
        <EmptyState
          icon="📝"
          title={allRecipes.length === 0 ? 'No recipes yet' : 'No matching recipes'}
          subtitle={
            allRecipes.length === 0
              ? 'Add your first recipe to this group!'
              : 'Try changing the difficulty filter.'
          }
          actionLabel={allRecipes.length === 0 ? 'Add Recipe' : undefined}
          onAction={
            allRecipes.length === 0
              ? () => router.push({ pathname: '/modals/recipe-form', params: { groupId: group.id } })
              : undefined
          }
        />
      ) : (
        <FlatList
          key={recipeColumns}
          data={filteredRecipes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={recipeColumns}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        />
      )}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + Spacing.sm, backgroundColor: surface, borderTopColor: border }]}>
        <View style={[styles.bottomBarInner, isTablet && { maxWidth: Layout.contentMaxWidth, alignSelf: 'center' as const, width: '100%' as const }]}>
          <Pressable
            style={[styles.addBtn, { borderColor: tint }]}
            onPress={() => router.push({ pathname: '/modals/recipe-form', params: { groupId: group.id } })}>
            <ThemedText style={styles.addBtnText} lightColor={tint} darkColor={tint}>
              Add Recipe
            </ThemedText>
          </Pressable>
          <RerollButton
            onPress={() =>
              router.push({
                pathname: '/modals/reroll',
                params: { groupId: group.id, difficulty: filter ?? '' },
              })
            }
            disabled={filteredRecipes.length === 0}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  bottomBarInner: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  addBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
