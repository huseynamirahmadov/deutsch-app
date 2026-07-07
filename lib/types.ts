export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  completedSessions: number;
}

export interface TimerStateDB {
  id: string;
  user_id: string;
  is_running: boolean;
  start_time: string | null;
  duration_seconds: number;
}

// XP state
export interface XpHistoryEntry {
  id: string;
  date: string;
  amount: number;
  source: string;
}

export interface XpState {
  totalXp: number;
  level: number;
  history: XpHistoryEntry[];
}

// Linter response
export interface LintError {
  type: string;
  original: string;
  suggested: string;
  explanationAzerbaijani: string;
}

export interface LintResult {
  isValid: boolean;
  correctedText: string;
  errors: LintError[];
}

// Notebook
export interface Note {
  id: string;
  content: string;
  category: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export interface NotebookState {
  notes: Note[];
  categories: Category[];
}

// Translation
export type TranslationDirection = 'az-to-de' | 'de-to-az';

export interface VocabularyItem {
  word: string;
  meaning: string;
  notes: string;
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
  vocabularyBreakdown: VocabularyItem[];
}
