// Timer state
export interface TimerState {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  completedSessions: number;
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

export interface NotebookState {
  notes: Note[];
  categories: string[];
}
