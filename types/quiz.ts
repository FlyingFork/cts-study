import type { LocalizedString } from '@/data/patterns';

export type QuestionType = 'single' | 'multiple' | 'matching' | 'ordering' | 'code';
export type Topic = 'design-patterns' | 'solid' | 'clean-code' | 'junit4' | 'testing-strategies';
export type QuizMode = 'exam' | 'practice';
export type Difficulty = 'easy' | 'medium';

export interface QuizOption {
  id: string;
  text: LocalizedString;
}

interface BaseQuestion {
  id: string;
  type: QuestionType;
  topic: Topic;
  difficulty: Difficulty;
  text: LocalizedString;
  explanation: LocalizedString;
  relatedPatternSlug?: string;
}

export interface SingleQuestion extends BaseQuestion {
  type: 'single';
  options: QuizOption[];
  correctId: string;
}

export interface MultipleQuestion extends BaseQuestion {
  type: 'multiple';
  options: QuizOption[];
  correctIds: string[];
}

export interface MatchingPair {
  id: string;
  left: LocalizedString;
  right: LocalizedString;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
}

export interface OrderingItem {
  id: string;
  text: LocalizedString;
}

export interface OrderingQuestion extends BaseQuestion {
  type: 'ordering';
  items: OrderingItem[];
}

export interface CodeQuestion extends BaseQuestion {
  type: 'code';
  codeSnippet: string;
  language: 'java';
  options: QuizOption[];
  correctIds: string[];
}

export type Question = SingleQuestion | MultipleQuestion | MatchingQuestion | OrderingQuestion | CodeQuestion;

export type UserAnswerValue = string | string[] | Record<string, string>;

export interface UserAnswer {
  questionId: string;
  value: UserAnswerValue;
  isCorrect: boolean;
  pointsEarned: number;
  timeSpentMs: number;
}

export interface QuestionShuffle {
  optionIds?: string[];
  rightIds?: string[];
  itemIds?: string[];
}

export interface QuizSession {
  id: string;
  mode: QuizMode;
  startedAt: number;
  finishedAt?: number;
  questionIds: string[];
  answers: Record<string, UserAnswer>;
  visitedIds: string[];
  flaggedIds: string[];
  shuffles: Record<string, QuestionShuffle>;
  settings: QuizSettings;
  score?: number;
  totalPoints?: number;
}

export interface QuizSettings {
  examDurationMinutes: number;
  examQuestionCount: number;
  topicFilters: Topic[];
  practiceQuestionCount: number;
}

export interface TopicStats {
  topic: Topic;
  attempted: number;
  correct: number;
  pointsEarned: number;
  totalPoints: number;
}
