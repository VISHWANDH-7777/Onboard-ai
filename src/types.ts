export type Screen = 
  | 'login' 
  | 'dashboard' 
  | 'analysis' 
  | 'processing' 
  | 'results' 
  | 'history'
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

export interface AnalysisRecord {
  id: string;
  userId: string;
  resumeText: string;
  jobDescription: string;
  result: AnalysisResult;
  createdAt: string;
}

export interface DashboardData {
  totalAnalyses: number;
  averageMatchScore: number;
  latestAnalysis: AnalysisRecord | null;
}

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    provider: 'local' | 'google';
    createdAt: string;
  };
  token: string;
}
