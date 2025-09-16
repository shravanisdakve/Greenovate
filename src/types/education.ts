export interface Topic {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  videoId: string;
  duration?: number; // in seconds
  completed: boolean;
  progress: number;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'quiz' | 'builder' | 'memory' | 'puzzle' | 'simulation' | 'adventure' | 'calculator' | 'strategy' | 'research' | 'consulting' | 'explorer' | 'sorting';
}

export interface SchoolLevel {
  id: string;
  name: string;
  topics: Topic[];
  games: Game[];
  overallProgress: number;
}

export interface GameState {
  score: number;
  level: number;
  timeRemaining: number;
  isPlaying: boolean;
  gameOver: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}