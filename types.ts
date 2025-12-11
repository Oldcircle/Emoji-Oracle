export enum AppRoute {
  HOME = 'HOME',
  GAME = 'GAME',
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
}

export enum GameTopic {
  MOVIES = 'Movies',
  FOOD = 'Food',
  ANIMALS = 'Animals',
  ACTIONS = 'Actions',
  OBJECTS = 'Daily Objects',
}

export enum Language {
  EN = 'en',
  CN = 'zh-CN',
}

export interface PuzzleData {
  emojis: string;
  answer: string;
  acceptable_answers: string[];
  hint: string;
}

export interface GameStats {
  totalGames: number;
  totalWins: number;
  currentStreak: number;
  bestStreak: number;
  totalScore: number;
}

export type ModelProvider = 'google' | 'openai' | 'deepseek' | 'anthropic' | 'ollama' | 'groq';

export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  apiKey: string;
  baseUrl: string;
  modelName: string;
}

export interface SettingsState {
  language: Language;
  creativity: number; // Temperature 0.0 - 1.0
  modelConfigs: ModelConfig[];
  activeConfigId: string;
}