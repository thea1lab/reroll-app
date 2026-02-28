import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { ScreenHeader } from '@/components/screen-header';
import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useData } from '@/storage/data-context';
import { Layout, Radius, Spacing } from '@/constants/theme';
import { ContentContainer } from '@/components/content-container';
import { useLanguage } from '@/contexts/language-context';
import type { Difficulty } from '@/constants/types';

const LANGUAGE_NAMES: Record<string, string> = { en: 'English', pt: 'Portuguese' };

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
  const { t, locale } = useLanguage();

  const existing = recipeId ? recipes.find((r) => r.id === recipeId) : null;
  const [name, setName] = useState(existing?.name ?? '');
  const [time, setTime] = useState(existing ? String(existing.estimatedTime) : '');
  const [difficulty, setDifficulty] = useState<Difficulty>(existing?.difficulty ?? 'Easy');
  const [ingredients, setIngredients] = useState(existing?.ingredients ?? '');
  const [steps, setSteps] = useState(existing?.steps ?? '');
  const [copied, setCopied] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [jsonText, setJsonText] = useState('');

  const isValid = name.trim().length > 0 && time.trim().length > 0;
  const title = existing ? t('recipeForm.editTitle') : t('recipeForm.newTitle');

  const difficultyColor = (d: Difficulty) => (d === 'Easy' ? success : d === 'Medium' ? warning : danger);

  const handleCopyPrompt = async () => {
    const lang = LANGUAGE_NAMES[locale] ?? 'English';
    const prompt = `Generate a recipe in ${lang}. Use the following JSON format:
{
  "name": "Recipe Name",
  "estimatedTime": 30,
  "difficulty": "Easy",
  "ingredients": "Ingredient 1\\nIngredient 2\\nIngredient 3",
  "steps": "Step 1\\nStep 2\\nStep 3"
}
Rules:
- The recipe MUST be written in ${lang}
- difficulty must be one of: "Easy", "Medium", "Hard" (always in English)
- estimatedTime is in minutes (number)
- ingredients and steps are newline-separated strings
- Return ONLY the JSON, no extra text`;
    await Clipboard.setStringAsync(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportJson = () => {
    try {
      const data = JSON.parse(jsonText);
      if (data.name) setName(data.name);
      if (data.estimatedTime != null) setTime(String(data.estimatedTime));
      if (data.difficulty && ['Easy', 'Medium', 'Hard'].includes(data.difficulty)) {
        setDifficulty(data.difficulty);
      }
      if (data.ingredients) setIngredients(data.ingredients);
      if (data.steps) setSteps(data.steps);
      setJsonText('');
      setShowImport(false);
    } catch {
      Alert.alert(t('recipeForm.importError'), t('recipeForm.importErrorMessage'));
    }
  };

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
          <View style={styles.aiRow}>
            <Pressable
              style={[styles.aiBtn, { borderColor: tint, backgroundColor: tint + '12' }]}
              onPress={handleCopyPrompt}>
              <ThemedText style={styles.aiBtnText} lightColor={tint} darkColor={tint}>
                {copied ? t('recipeForm.copied') : t('recipeForm.copyPrompt')}
              </ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.aiBtn,
                {
                  borderColor: tint,
                  backgroundColor: showImport ? tint + '20' : tint + '12',
                },
              ]}
              onPress={() => setShowImport((v) => !v)}>
              <ThemedText style={styles.aiBtnText} lightColor={tint} darkColor={tint}>
                {t('recipeForm.importJson')}
              </ThemedText>
            </Pressable>
          </View>
          {showImport && (
            <View style={styles.importSection}>
              <TextInput
                style={[styles.importInput, { borderColor: border, color: tint }]}
                placeholder={t('recipeForm.pasteJsonPlaceholder')}
                placeholderTextColor={border}
                value={jsonText}
                onChangeText={setJsonText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <Pressable
                style={[styles.importBtn, { backgroundColor: tint }]}
                onPress={handleImportJson}>
                <ThemedText style={styles.importBtnText}>{t('recipeForm.import')}</ThemedText>
              </Pressable>
            </View>
          )}
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
  aiRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  aiBtn: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  aiBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  importSection: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  importInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    fontSize: 14,
    minHeight: 120,
  },
  importBtn: {
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.xl,
    alignItems: 'center',
  },
  importBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
