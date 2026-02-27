import firestore from '@react-native-firebase/firestore';
import type { Group, Recipe } from '@/constants/types';

function groupsRef(userId: string) {
  return firestore().collection('users').doc(userId).collection('groups');
}

function recipesRef(userId: string) {
  return firestore().collection('users').doc(userId).collection('recipes');
}

// --- Groups ---

export function subscribeGroups(
  userId: string,
  onNext: (groups: Group[]) => void,
  onError: (error: Error) => void
) {
  return groupsRef(userId)
    .orderBy('createdAt', 'asc')
    .onSnapshot(
      (snapshot) => {
        const groups: Group[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Group[];
        onNext(groups);
      },
      onError
    );
}

export async function addGroupDoc(userId: string, group: Group): Promise<void> {
  const { id, ...data } = group;
  await groupsRef(userId).doc(id).set(data);
}

export async function updateGroupDoc(
  userId: string,
  id: string,
  updates: Partial<Pick<Group, 'name' | 'emoji'>> & { updatedAt: number }
): Promise<void> {
  await groupsRef(userId).doc(id).update(updates);
}

export async function deleteGroupDoc(userId: string, id: string): Promise<void> {
  const batch = firestore().batch();

  // Delete the group
  batch.delete(groupsRef(userId).doc(id));

  // Delete all recipes in this group
  const recipesSnapshot = await recipesRef(userId).where('groupId', '==', id).get();
  recipesSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}

// --- Recipes ---

export function subscribeRecipes(
  userId: string,
  onNext: (recipes: Recipe[]) => void,
  onError: (error: Error) => void
) {
  return recipesRef(userId)
    .orderBy('createdAt', 'asc')
    .onSnapshot(
      (snapshot) => {
        const recipes: Recipe[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        onNext(recipes);
      },
      onError
    );
}

export async function addRecipeDoc(userId: string, recipe: Recipe): Promise<void> {
  const { id, ...data } = recipe;
  await recipesRef(userId).doc(id).set(data);
}

export async function updateRecipeDoc(
  userId: string,
  id: string,
  updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>
): Promise<void> {
  await recipesRef(userId).doc(id).update(updates);
}

export async function deleteRecipeDoc(userId: string, id: string): Promise<void> {
  await recipesRef(userId).doc(id).delete();
}

// --- Seed ---

export async function seedInitialData(
  userId: string,
  groups: Group[],
  recipes: Recipe[]
): Promise<void> {
  const batch = firestore().batch();

  for (const group of groups) {
    const { id, ...data } = group;
    batch.set(groupsRef(userId).doc(id), data);
  }
  for (const recipe of recipes) {
    const { id, ...data } = recipe;
    batch.set(recipesRef(userId).doc(id), data);
  }

  await batch.commit();
}

// --- ID generation ---

export function generateFirestoreId(userId: string, collection: 'groups' | 'recipes'): string {
  return firestore()
    .collection('users')
    .doc(userId)
    .collection(collection)
    .doc().id;
}
