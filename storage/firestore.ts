import { getApp } from '@react-native-firebase/app';
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';
import type { Group, Recipe } from '@/constants/types';

const db = getFirestore(getApp());

function groupsCol(userId: string) {
  return collection(db, 'users', userId, 'groups');
}

function recipesCol(userId: string) {
  return collection(db, 'users', userId, 'recipes');
}

// --- Groups ---

export function subscribeGroups(
  userId: string,
  onNext: (groups: Group[]) => void,
  onError: (error: Error) => void
) {
  const q = query(groupsCol(userId), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const groups: Group[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Group[];
    onNext(groups);
  }, onError);
}

export async function addGroupDoc(userId: string, group: Group): Promise<void> {
  const { id, ...data } = group;
  await setDoc(doc(groupsCol(userId), id), data);
}

export async function updateGroupDoc(
  userId: string,
  id: string,
  updates: Partial<Pick<Group, 'name' | 'emoji'>> & { updatedAt: number }
): Promise<void> {
  await updateDoc(doc(groupsCol(userId), id), updates);
}

export async function deleteGroupDoc(userId: string, id: string): Promise<void> {
  const batch = writeBatch(db);

  batch.delete(doc(groupsCol(userId), id));

  const recipesSnapshot = await getDocs(query(recipesCol(userId), where('groupId', '==', id)));
  recipesSnapshot.docs.forEach((d) => {
    batch.delete(d.ref);
  });

  await batch.commit();
}

// --- Recipes ---

export function subscribeRecipes(
  userId: string,
  onNext: (recipes: Recipe[]) => void,
  onError: (error: Error) => void
) {
  const q = query(recipesCol(userId), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const recipes: Recipe[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Recipe[];
    onNext(recipes);
  }, onError);
}

export async function addRecipeDoc(userId: string, recipe: Recipe): Promise<void> {
  const { id, ...data } = recipe;
  await setDoc(doc(recipesCol(userId), id), data);
}

export async function updateRecipeDoc(
  userId: string,
  id: string,
  updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(recipesCol(userId), id), updates);
}

export async function deleteRecipeDoc(userId: string, id: string): Promise<void> {
  await deleteDoc(doc(recipesCol(userId), id));
}

// --- ID generation ---

export function generateFirestoreId(userId: string, col: 'groups' | 'recipes'): string {
  return doc(collection(db, 'users', userId, col)).id;
}
