import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Difficulty, Group, Recipe } from '@/constants/types';
import { useAuth } from '@/contexts/auth-context';
import {
  addGroupDoc,
  addRecipeDoc,
  deleteGroupDoc,
  deleteRecipeDoc,
  generateFirestoreId,
  seedInitialData,
  subscribeGroups,
  subscribeRecipes,
  updateGroupDoc,
  updateRecipeDoc,
} from '@/storage/firestore';

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

const SEED_GROUPS: Omit<Group, 'id'>[] = [
  { name: 'Breakfast', emoji: '🍳', createdAt: Date.now(), updatedAt: Date.now() },
  { name: 'Dinner', emoji: '🥘', createdAt: Date.now(), updatedAt: Date.now() },
  { name: 'Desserts', emoji: '🍰', createdAt: Date.now(), updatedAt: Date.now() },
];

const SEED_RECIPES_TEMPLATE: Omit<Recipe, 'id' | 'groupId'>[] = [
  {
    name: 'Fluffy Pancakes',
    ingredients: '2 cups flour\n2 eggs\n1 cup milk\n2 tbsp sugar\n1 tsp baking powder\nButter for cooking',
    steps: 'Mix dry ingredients together\nWhisk eggs and milk, combine with dry mix\nHeat a buttered pan over medium heat\nPour batter and cook until bubbles form\nFlip and cook until golden',
    estimatedTime: 20,
    difficulty: 'Easy',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: 'Avocado Toast',
    ingredients: '2 slices sourdough bread\n1 ripe avocado\nSalt and pepper\nRed pepper flakes\nLemon juice',
    steps: 'Toast the bread until golden\nMash the avocado with lemon juice, salt, and pepper\nSpread on toast\nSprinkle red pepper flakes on top',
    estimatedTime: 10,
    difficulty: 'Easy',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: 'Chicken Stir-Fry',
    ingredients: '500g chicken breast\n2 cups mixed vegetables\n3 tbsp soy sauce\n1 tbsp sesame oil\n2 cloves garlic\nRice for serving',
    steps: 'Slice chicken into strips\nHeat sesame oil in a wok\nCook chicken until golden\nAdd garlic and vegetables\nPour soy sauce and toss\nServe over rice',
    estimatedTime: 30,
    difficulty: 'Medium',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: 'Spaghetti Bolognese',
    ingredients: '400g spaghetti\n500g ground beef\n1 can crushed tomatoes\n1 onion\n2 cloves garlic\nOlive oil\nBasil\nParmesan',
    steps: 'Cook spaghetti according to package\nSauté onion and garlic in olive oil\nBrown the ground beef\nAdd crushed tomatoes and simmer 20 min\nSeason with basil, salt, pepper\nServe sauce over pasta with parmesan',
    estimatedTime: 45,
    difficulty: 'Medium',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: 'Chocolate Mug Cake',
    ingredients: '4 tbsp flour\n4 tbsp sugar\n2 tbsp cocoa powder\n1 egg\n3 tbsp milk\n3 tbsp oil\nChocolate chips',
    steps: 'Mix all dry ingredients in a mug\nAdd egg, milk, and oil\nStir until smooth\nDrop in chocolate chips\nMicrowave 90 seconds\nLet cool 1 minute',
    estimatedTime: 5,
    difficulty: 'Easy',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// Map recipe index -> seed group index (Breakfast: 0,1; Dinner: 2,3; Desserts: 4)
const RECIPE_GROUP_MAP = [0, 0, 1, 1, 2];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const seededRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    const userId = user.uid;
    let groupsLoaded = false;
    let recipesLoaded = false;
    let loadedGroups: Group[] = [];
    let loadedRecipes: Recipe[] = [];

    const checkSeed = async () => {
      if (!groupsLoaded || !recipesLoaded) return;
      if (loadedGroups.length === 0 && loadedRecipes.length === 0 && !seededRef.current) {
        seededRef.current = true;
        const seedGroups: Group[] = SEED_GROUPS.map((g) => ({
          ...g,
          id: generateFirestoreId(userId, 'groups'),
        }));
        const seedRecipes: Recipe[] = SEED_RECIPES_TEMPLATE.map((r, i) => ({
          ...r,
          id: generateFirestoreId(userId, 'recipes'),
          groupId: seedGroups[RECIPE_GROUP_MAP[i]].id,
        }));
        await seedInitialData(userId, seedGroups, seedRecipes);
        // Firestore subscription will update state automatically
      }
      setIsLoading(false);
    };

    const unsubGroups = subscribeGroups(
      userId,
      (g) => {
        loadedGroups = g;
        groupsLoaded = true;
        setGroups(g);
        checkSeed();
      },
      (err) => console.error('Groups subscription error:', err)
    );

    const unsubRecipes = subscribeRecipes(
      userId,
      (r) => {
        loadedRecipes = r;
        recipesLoaded = true;
        setRecipes(r);
        checkSeed();
      },
      (err) => console.error('Recipes subscription error:', err)
    );

    return () => {
      unsubGroups();
      unsubRecipes();
    };
  }, [user]);

  const addGroup = useCallback(
    (name: string, emoji: string): Group => {
      if (!user) throw new Error('Not authenticated');
      const now = Date.now();
      const id = generateFirestoreId(user.uid, 'groups');
      const group: Group = { id, name, emoji, createdAt: now, updatedAt: now };
      addGroupDoc(user.uid, group);
      return group;
    },
    [user]
  );

  const updateGroup = useCallback(
    (id: string, updates: Partial<Pick<Group, 'name' | 'emoji'>>) => {
      if (!user) return;
      updateGroupDoc(user.uid, id, { ...updates, updatedAt: Date.now() });
    },
    [user]
  );

  const deleteGroup = useCallback(
    (id: string) => {
      if (!user) return;
      deleteGroupDoc(user.uid, id);
    },
    [user]
  );

  const addRecipe = useCallback(
    (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe => {
      if (!user) throw new Error('Not authenticated');
      const now = Date.now();
      const id = generateFirestoreId(user.uid, 'recipes');
      const recipe: Recipe = { ...data, id, createdAt: now, updatedAt: now };
      addRecipeDoc(user.uid, recipe);
      return recipe;
    },
    [user]
  );

  const updateRecipe = useCallback(
    (id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>) => {
      if (!user) return;
      updateRecipeDoc(user.uid, id, { ...updates, updatedAt: Date.now() });
    },
    [user]
  );

  const deleteRecipe = useCallback(
    (id: string) => {
      if (!user) return;
      deleteRecipeDoc(user.uid, id);
    },
    [user]
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
