export type Screen = 
  | 'login' 
  | 'dashboard' 
  | 'analysis' 
  | 'processing' 
  | 'results' 
  | 'learning' 
  | 'career' 
  | 'settings' 
  | 'export';

export interface Skill {
  name: string;
  level: number; // 0-100
  status: 'mastered' | 'developing' | 'gap';
}

export interface AnalysisResult {
  score: number;
  skills: Skill[];
  reasoning: string;
  distribution: { 
    subject: string; 
    A: number; 
    B: number; 
    fullMark: number; 
  }[];
  benchmarking: { 
    name: string; 
    current: number; 
    target: number; 
  }[];
}
