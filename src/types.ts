export type Screen = 
  | 'login' 
  | 'dashboard' 
  | 'analysis' 
  | 'processing' 
  | 'results' 
  | 'learning' 
  | 'career' 
  | 'export';

export interface AuthResponse {
  token: string;
  user: {
    userId: string;
    email: string;
  };
  session: {
    token: string;
    createdAt: string;
  };
}

export interface AnalysisSummary {
  analysisId: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  learningPath: LearningModule[];
  careerPath: CareerPath;
}

export interface ResultResponse {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  weakSkills: string[];
  reasoning: string[];
}

export interface LearningModule {
  skill: string;
  steps: string[];
  duration: string;
}

export interface LearningResponse {
  learningModules: LearningModule[];
}

export interface CareerPath {
  currentRole: string;
  targetRole: string;
  timeline: string[];
}

export interface DashboardResponse {
  totalAnalyses: number;
  avgScore: number;
  recentActivities: {
    analysisId: string;
    targetRole: string;
    score: number;
    createdAt: string;
  }[];
}

export interface HistoryResponse {
  items: {
    analysisId: string;
    targetRole: string;
    matchScore: number;
    createdAt: string;
    rerunOf?: string;
  }[];
}
