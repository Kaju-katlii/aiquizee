export type ScreenType = 'home' | 'loading' | 'quiz' | 'results';

export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface QuestionBreakdown {
  question: string;
  isCorrect: boolean;
  selectedLetter: string | null;
  correctLetter: string;
  correctText: string;
  explanation?: string;
}

export interface QuizResult {
  score: number;
  total: number;
  breakdown: QuestionBreakdown[];
}

export interface GenerateQuizRequest {
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count?: number;
}
