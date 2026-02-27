import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/screen-header';
import { DifficultyBadge } from '@/components/difficulty-badge';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/storage/data-context';
import { Radius, Spacing } from '@/constants/theme';
import { ContentContainer } from '@/components/content-container';
import { useLanguage } from '@/contexts/language-context';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { recipes, deleteRecipe } = useData();
  const tint = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const danger = useThemeColor({}, 'danger');
  const { t } = useLanguage();

  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) return null;

  const ingredientsList = recipe.ingredients.split('\n').filter((l) => l.trim());
  const stepsList = recipe.steps.split('\n').filter((l) => l.trim());

  const handleDelete = () => {
    Alert.alert(t('recipe.deleteTitle'), t('recipe.deleteMessage', { name: recipe.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteRecipe(recipe.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={recipe.name}
        leftIcon={<IconSymbol name="chevron.left" size={24} color={tint} />}
        onLeftPress={() => router.back()}
        rightIcon={<IconSymbol name="pencil" size={20} color={iconColor} />}
        onRightPress={() =>
          router.push({
            pathname: '/modals/recipe-form',
            params: { groupId: recipe.groupId, recipeId: recipe.id },
          })
        }
      />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]}>
        <ContentContainer>
          <View style={styles.metaRow}>
            <DifficultyBadge difficulty={recipe.difficulty} />
            <View style={styles.time}>
              <IconSymbol name="clock" size={18} color={iconColor} />
              <ThemedText style={styles.timeText}>{recipe.estimatedTime} {t('common.min')}</ThemedText>
            </View>
          </View>

          {ingredientsList.length > 0 && (
            <View style={[styles.section, { backgroundColor: surface, borderColor: border }]}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {t('recipe.ingredients')}
              </ThemedText>
              {ingredientsList.map((item, i) => (
                <View key={i} style={styles.bulletRow}>
                  <ThemedText style={styles.bullet}>•</ThemedText>
                  <ThemedText style={styles.bulletText}>{item.trim()}</ThemedText>
                </View>
              ))}
            </View>
          )}

          {stepsList.length > 0 && (
            <View style={[styles.section, { backgroundColor: surface, borderColor: border }]}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {t('recipe.steps')}
              </ThemedText>
              {stepsList.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <ThemedText style={[styles.stepNum, { color: tint }]}>{i + 1}.</ThemedText>
                  <ThemedText style={styles.stepText}>{step.trim()}</ThemedText>
                </View>
              ))}
            </View>
          )}

          <Pressable style={[styles.deleteBtn, { borderColor: danger }]} onPress={handleDelete}>
            <IconSymbol name="trash" size={18} color={danger} />
            <ThemedText style={styles.deleteText} lightColor={danger} darkColor={danger}>
              {t('recipe.deleteRecipe')}
            </ThemedText>
          </Pressable>
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 15,
  },
  section: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 17,
    marginBottom: Spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    gap: Spacing.sm,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    gap: Spacing.sm,
  },
  stepNum: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 24,
    width: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 4,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    marginTop: Spacing.lg,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
