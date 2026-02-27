export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Group {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
  updatedAt: number;
}

export interface Recipe {
  id: string;
  groupId: string;
  name: string;
  ingredients: string;
  steps: string;
  estimatedTime: number;
  difficulty: Difficulty;
  createdAt: number;
  updatedAt: number;
}
