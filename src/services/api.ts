import {
  type AnalysisSummary,
  type AuthResponse,
  type CareerPath,
  type DashboardResponse,
  type HistoryResponse,
  type LearningResponse,
  type ResultResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function getToken(): string {
  return localStorage.getItem('nebula_token') || '';
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem('nebula_token', response.token);
  localStorage.setItem('nebula_user_id', response.user.userId);
  return response;
}

export async function getDashboard(userId: string): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>(`/api/dashboard/${userId}`);
}

export async function analyze(payload: {
  resumeText: string;
  jobDescription: string;
  targetRole: string;
  experienceLevel: string;
}): Promise<AnalysisSummary> {
  console.log('Sending analysis payload:', payload);
  console.log('Analyze endpoint:', `${API_BASE}/api/analyze`);
  return apiFetch<AnalysisSummary>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getResult(analysisId: string): Promise<ResultResponse> {
  return apiFetch<ResultResponse>(`/api/result/${analysisId}`);
}

export async function getLearning(analysisId: string): Promise<LearningResponse> {
  return apiFetch<LearningResponse>(`/api/learning/${analysisId}`);
}

export async function getCareer(analysisId: string): Promise<CareerPath> {
  return apiFetch<CareerPath>(`/api/career/${analysisId}`);
}

export async function getHistory(userId: string): Promise<HistoryResponse> {
  return apiFetch<HistoryResponse>(`/api/result/history/${userId}`);
}

export async function rerunAnalysis(analysisId: string): Promise<{ analysisId: string; matchScore: number }> {
  return apiFetch<{ analysisId: string; matchScore: number }>(`/api/analyze/${analysisId}/rerun`, {
    method: 'POST',
  });
}

export async function compareAnalyses(analysisA: string, analysisB: string): Promise<{
  analysisA: { analysisId: string; score: number; createdAt: string };
  analysisB: { analysisId: string; score: number; createdAt: string };
  scoreDelta: number;
}> {
  return apiFetch(`/api/result/compare/${analysisA}/${analysisB}`);
}

export async function exportReport(analysisId: string): Promise<{
  message: string;
  fileName: string;
  reportPath: string;
  shareLink: string;
  saved: boolean;
}> {
  return apiFetch(`/api/export/${analysisId}`);
}
