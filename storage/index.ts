import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Group, Recipe } from '@/constants/types';

const GROUPS_KEY = '@reroll/groups';
const RECIPES_KEY = '@reroll/recipes';

export async function loadGroups(): Promise<Group[]> {
  const json = await AsyncStorage.getItem(GROUPS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveGroups(groups: Group[]): Promise<void> {
  await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

export async function loadRecipes(): Promise<Recipe[]> {
  const json = await AsyncStorage.getItem(RECIPES_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveRecipes(recipes: Recipe[]): Promise<void> {
  await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}
