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
import { useLanguage } from '@/contexts/language-context';
import type { Difficulty } from '@/constants/types';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export default function RecipeFormModal() {
  const router = useRouter();
  const { groupId, recipeId } = useLocalSearchParams<{ groupId: string; recipeId?: string }>();
  const { recipes, addRecipe, updateRecipe } = useData();
  const tint = useThemeColor({}, 'tint');
  const tintLight = useThemeColor({}, 'tintLight');
  const border = useThemeColor({}, 'border');
  const success = useThemeColor({}, 'success');
  const warning = useThemeColor({}, 'warning');
  const danger = useThemeColor({}, 'danger');
  const { t } = useLanguage();

  const existing = recipeId ? recipes.find((r) => r.id === recipeId) : null;
  const [name, setName] = useState(existing?.name ?? '');
  const [time, setTime] = useState(existing ? String(existing.estimatedTime) : '');
  const [difficulty, setDifficulty] = useState<Difficulty>(existing?.difficulty ?? 'Easy');
  const [ingredients, setIngredients] = useState(existing?.ingredients ?? '');
  const [steps, setSteps] = useState(existing?.steps ?? '');

  const isValid = name.trim().length > 0 && time.trim().length > 0;
  const title = existing ? t('recipeForm.editTitle') : t('recipeForm.newTitle');

  const difficultyColor = (d: Difficulty) => (d === 'Easy' ? success : d === 'Medium' ? warning : danger);

  const handleSave = () => {
    if (!isValid) return;
    if (existing) {
      updateRecipe(existing.id, {
        name: name.trim(),
        estimatedTime: parseInt(time) || 0,
        difficulty,
        ingredients: ingredients.trim(),
        steps: steps.trim(),
      });
    } else {
      addRecipe({
        groupId: groupId!,
        name: name.trim(),
        estimatedTime: parseInt(time) || 0,
        difficulty,
        ingredients: ingredients.trim(),
        steps: steps.trim(),
      });
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={title}
        leftIcon={
          <ThemedText style={styles.headerBtn} lightColor={tint} darkColor={tint}>
            {t('common.cancel')}
          </ThemedText>
        }
        onLeftPress={() => router.back()}
        rightIcon={
          <ThemedText
            style={[styles.headerBtn, styles.headerBtnBold, { opacity: isValid ? 1 : 0.4 }]}
            lightColor={tint}
            darkColor={tint}>
            {t('common.save')}
          </ThemedText>
        }
        onRightPress={handleSave}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ContentContainer maxWidth={Layout.modalMaxWidth}>
          <FormField
            label={t('recipeForm.nameLabel')}
            placeholder={t('recipeForm.namePlaceholder')}
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <FormField
            label={t('recipeForm.timeLabel')}
            placeholder={t('recipeForm.timePlaceholder')}
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
          />
          <ThemedText style={styles.label}>{t('recipeForm.difficultyLabel')}</ThemedText>
          <View style={styles.difficultyRow}>
            {DIFFICULTIES.map((d) => {
              const active = difficulty === d;
              const color = difficultyColor(d);
              return (
                <Pressable
                  key={d}
                  style={[
                    styles.diffPill,
                    {
                      backgroundColor: active ? color + '20' : 'transparent',
                      borderColor: active ? color : border,
                    },
                  ]}
                  onPress={() => setDifficulty(d)}>
                  <ThemedText style={[styles.diffText, { color }]} lightColor={color} darkColor={color}>
                    {t(`difficulty.${d}`)}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          <FormField
            label={t('recipeForm.ingredientsLabel')}
            placeholder={t('recipeForm.ingredientsPlaceholder')}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            numberOfLines={5}
          />
          <FormField
            label={t('recipeForm.stepsLabel')}
            placeholder={t('recipeForm.stepsPlaceholder')}
            value={steps}
            onChangeText={setSteps}
            multiline
            numberOfLines={5}
          />
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
    paddingBottom: Spacing.xl * 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  diffPill: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  diffText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerBtn: {
    fontSize: 16,
  },
  headerBtnBold: {
    fontWeight: '600',
  },
});
