import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/screen-header';
import { GroupCard } from '@/components/group-card';
import { EmptyState } from '@/components/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/storage/data-context';
import { Radius, Spacing } from '@/constants/theme';
import { useResponsive } from '@/hooks/use-responsive';
import type { Group } from '@/constants/types';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { groups, recipes, deleteGroup } = useData();
  const tint = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const { groupColumns } = useResponsive();

  const handleLongPress = (group: Group) => {
    Alert.alert(group.name, undefined, [
      {
        text: 'Edit',
        onPress: () => router.push({ pathname: '/modals/group-form', params: { groupId: group.id } }),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          Alert.alert('Delete Group', `Delete "${group.name}" and all its recipes?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteGroup(group.id) },
          ]),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderItem = ({ item }: { item: Group }) => {
    const count = recipes.filter((r) => r.groupId === item.id).length;
    return (
      <GroupCard
        emoji={item.emoji}
        name={item.name}
        recipeCount={count}
        onPress={() => router.push({ pathname: '/group/[id]', params: { id: item.id } })}
        onLongPress={() => handleLongPress(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Reroll"
        subtitle="What are we cooking today?"
        rightIcon={<IconSymbol name="gearshape" size={22} color={iconColor} />}
        onRightPress={() => router.push('/modals/settings')}
      />
      {groups.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="No groups yet"
          subtitle="Create your first recipe group to get started!"
          actionLabel="Create Group"
          onAction={() => router.push('/modals/group-form')}
        />
      ) : (
        <FlatList
          key={groupColumns}
          data={groups}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={groupColumns}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        />
      )}
      <Pressable
        style={[styles.fab, { backgroundColor: tint, bottom: insets.bottom + Spacing.lg }]}
        onPress={() => router.push('/modals/group-form')}>
        <IconSymbol name="plus" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});
