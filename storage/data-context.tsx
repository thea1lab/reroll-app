import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Difficulty, Group, Recipe } from '@/constants/types';
import { useAuth } from '@/contexts/auth-context';
import {
  addGroupDoc,
  addRecipeDoc,
  deleteGroupDoc,
  deleteRecipeDoc,
  generateFirestoreId,
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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const userId = user.uid;
    let groupsLoaded = false;
    let recipesLoaded = false;

    const checkReady = () => {
      if (groupsLoaded && recipesLoaded) setIsLoading(false);
    };

    const unsubGroups = subscribeGroups(
      userId,
      (g) => {
        groupsLoaded = true;
        setGroups(g);
        checkReady();
      },
      (err) => console.error('Groups subscription error:', err)
    );

    const unsubRecipes = subscribeRecipes(
      userId,
      (r) => {
        recipesLoaded = true;
        setRecipes(r);
        checkReady();
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
