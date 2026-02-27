import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Difficulty, Group, Recipe } from '@/constants/types';
import { loadGroups, loadRecipes, saveGroups, saveRecipes } from '@/storage';

interface DataContextValue {
  groups: Group[];
  recipes: Recipe[];
  isLoading: boolean;
  addGroup: (name: string, emoji: string) => Group;
  updateGroup: (id: string, updates: Partial<Pick<Group, 'name' | 'emoji'>>) => void;
  deleteGroup: (id: string) => void;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Recipe;
  updateRecipe: (id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteRecipe: (id: string) => void;
  getRecipesForGroup: (groupId: string, difficulty?: Difficulty | null) => Recipe[];
}

const DataContext = createContext<DataContextValue | null>(null);

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

const SEED_GROUPS: Group[] = [
  { id: 'seed-breakfast', name: 'Breakfast', emoji: '🍳', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'seed-dinner', name: 'Dinner', emoji: '🥘', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'seed-desserts', name: 'Desserts', emoji: '🍰', createdAt: Date.now(), updatedAt: Date.now() },
];

const SEED_RECIPES: Recipe[] = [
  {
    id: 'seed-r1',
    groupId: 'seed-breakfast',
    name: 'Fluffy Pancakes',
    ingredients: '2 cups flour\n2 eggs\n1 cup milk\n2 tbsp sugar\n1 tsp baking powder\nButter for cooking',
    steps: 'Mix dry ingredients together\nWhisk eggs and milk, combine with dry mix\nHeat a buttered pan over medium heat\nPour batter and cook until bubbles form\nFlip and cook until golden',
    estimatedTime: 20,
    difficulty: 'Easy',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'seed-r2',
    groupId: 'seed-breakfast',
    name: 'Avocado Toast',
    ingredients: '2 slices sourdough bread\n1 ripe avocado\nSalt and pepper\nRed pepper flakes\nLemon juice',
    steps: 'Toast the bread until golden\nMash the avocado with lemon juice, salt, and pepper\nSpread on toast\nSprinkle red pepper flakes on top',
    estimatedTime: 10,
    difficulty: 'Easy',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'seed-r3',
    groupId: 'seed-dinner',
    name: 'Chicken Stir-Fry',
    ingredients: '500g chicken breast\n2 cups mixed vegetables\n3 tbsp soy sauce\n1 tbsp sesame oil\n2 cloves garlic\nRice for serving',
    steps: 'Slice chicken into strips\nHeat sesame oil in a wok\nCook chicken until golden\nAdd garlic and vegetables\nPour soy sauce and toss\nServe over rice',
    estimatedTime: 30,
    difficulty: 'Medium',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'seed-r4',
    groupId: 'seed-dinner',
    name: 'Spaghetti Bolognese',
    ingredients: '400g spaghetti\n500g ground beef\n1 can crushed tomatoes\n1 onion\n2 cloves garlic\nOlive oil\nBasil\nParmesan',
    steps: 'Cook spaghetti according to package\nSauté onion and garlic in olive oil\nBrown the ground beef\nAdd crushed tomatoes and simmer 20 min\nSeason with basil, salt, pepper\nServe sauce over pasta with parmesan',
    estimatedTime: 45,
    difficulty: 'Medium',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'seed-r5',
    groupId: 'seed-desserts',
    name: 'Chocolate Mug Cake',
    ingredients: '4 tbsp flour\n4 tbsp sugar\n2 tbsp cocoa powder\n1 egg\n3 tbsp milk\n3 tbsp oil\nChocolate chips',
    steps: 'Mix all dry ingredients in a mug\nAdd egg, milk, and oil\nStir until smooth\nDrop in chocolate chips\nMicrowave 90 seconds\nLet cool 1 minute',
    estimatedTime: 5,
    difficulty: 'Easy',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [storedGroups, storedRecipes] = await Promise.all([loadGroups(), loadRecipes()]);
      if (storedGroups.length === 0 && storedRecipes.length === 0) {
        setGroups(SEED_GROUPS);
        setRecipes(SEED_RECIPES);
        await Promise.all([saveGroups(SEED_GROUPS), saveRecipes(SEED_RECIPES)]);
      } else {
        setGroups(storedGroups);
        setRecipes(storedRecipes);
      }
      setIsLoading(false);
    })();
  }, []);

  const persistGroups = useCallback(async (next: Group[]) => {
    setGroups(next);
    await saveGroups(next);
  }, []);

  const persistRecipes = useCallback(async (next: Recipe[]) => {
    setRecipes(next);
    await saveRecipes(next);
  }, []);

  const addGroup = useCallback(
    (name: string, emoji: string): Group => {
      const now = Date.now();
      const group: Group = { id: generateId(), name, emoji, createdAt: now, updatedAt: now };
      const next = [...groups, group];
      persistGroups(next);
      return group;
    },
    [groups, persistGroups]
  );

  const updateGroup = useCallback(
    (id: string, updates: Partial<Pick<Group, 'name' | 'emoji'>>) => {
      const next = groups.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: Date.now() } : g));
      persistGroups(next);
    },
    [groups, persistGroups]
  );

  const deleteGroup = useCallback(
    (id: string) => {
      persistGroups(groups.filter((g) => g.id !== id));
      persistRecipes(recipes.filter((r) => r.groupId !== id));
    },
    [groups, recipes, persistGroups, persistRecipes]
  );

  const addRecipe = useCallback(
    (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe => {
      const now = Date.now();
      const recipe: Recipe = { ...data, id: generateId(), createdAt: now, updatedAt: now };
      persistRecipes([...recipes, recipe]);
      return recipe;
    },
    [recipes, persistRecipes]
  );

  const updateRecipe = useCallback(
    (id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const next = recipes.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r));
      persistRecipes(next);
    },
    [recipes, persistRecipes]
  );

  const deleteRecipe = useCallback(
    (id: string) => {
      persistRecipes(recipes.filter((r) => r.id !== id));
    },
    [recipes, persistRecipes]
  );

  const getRecipesForGroup = useCallback(
    (groupId: string, difficulty?: Difficulty | null): Recipe[] => {
      return recipes.filter((r) => r.groupId === groupId && (!difficulty || r.difficulty === difficulty));
    },
    [recipes]
  );

  return (
    <DataContext.Provider
      value={{
        groups,
        recipes,
        isLoading,
        addGroup,
        updateGroup,
        deleteGroup,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipesForGroup,
      }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
