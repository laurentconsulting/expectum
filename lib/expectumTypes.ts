export type ReflectionMode = "meeting" | "thought" | "exploration";

export type ThreadMessage = {
  role: "user" | "assistant";
  text: string;
  createdAt: string;
  sessionId?: string;
  mode?: ReflectionMode;
};

export type Landmark = {
  id: string;
  text: string;
  question: string;
  thread?: ThreadMessage[];
  createdAt: string;
};

export type HistoryItem = {
  question: string;
  reflection: string;
  thread?: ThreadMessage[];
  mode?: ReflectionMode;
  createdAt: string;
};

export type SessionGroup = {
  sessionId: string;
  date: string;
  messages: ThreadMessage[];
};

export type JourneyReflection = {
  text: string;
  createdAt: string;
  historyCount?: number;
  landmarksCount?: number;
  sessionsCount?: number;
};

export type SharedInsight = {
  id: string;
  text: string;
  question: string;
  createdAt?: string;
  created_at?: string;
  questionCount?: number;
  question_count?: number;
  approved?: boolean;
};
export type ThemeItem = {
  name: string;
  count: number;
  matches: string[];
};

export type TrajectoryItem = {
  text: string;
  createdAt: string;
};
export type ExpectumFooterLink = {
  href: string;
  label: string;
  symbol?:
    | "meeting"
    | "echo"
    | "theme"
    | "direction"
    | "path"
    | "memory"
    | "aim";
};