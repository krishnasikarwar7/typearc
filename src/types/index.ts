export type TestDuration = 30 | 45 | 60 | 120;
export type TestMode = "time" | "words" | "custom";

export type CharState = "pending" | "correct" | "incorrect" | "current";

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  characters: number;
  mistakes: number;
  elapsedSeconds: number;
}

export interface CodeLanguage {
  id: string;
  label: string;
}

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  initials: string;
  wpm: number;
  accuracy: number;
  score: number;
  color: string;
}

export interface RecentTest {
  id: string;
  mode: string;
  wpm: number;
  accuracy: number;
  date: string;
  score: number;
}

export interface Achievement {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
}

export interface PlayModeDef {
  id: string;
  name: string;
  description: string;
}
