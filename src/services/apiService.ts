import { AnalysisRecord, AnalysisResult, AuthSession, DashboardData } from '../types';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'local' | 'google';
  createdAt: string;
}

const SESSION_STORAGE_KEY = 'onboard-ai-session';
const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
const API_URL = (viteEnv?.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalizedPath.replace(/^\/api/, '')}`;
}

async function request<T>(url: string, init: RequestInit): Promise<ApiResponse<T>> {
  const requestUrl = buildApiUrl(url);

  try {
    const response = await fetch(requestUrl, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });

    const rawPayload = await response.text();
    const payload = rawPayload ? (JSON.parse(rawPayload) as ApiResponse<T>) : null;

    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || `API failed with status ${response.status}`);
    }

    return payload;
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message.includes('Failed to fetch')
        ? `Failed to fetch from ${requestUrl}. Ensure API server is running.`
        : error.message;
      throw new Error(message);
    }

    throw new Error('API request failed');
  }
}

function toSession(token: string, user: AuthUser): AuthSession {
  return {
    token,
    user,
  };
}

export function getStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.user?.id) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function storeSession(session: AuthSession) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function signup(params: { name: string; email: string; password: string }): Promise<AuthSession> {
  const payload = await request<{ token: string; user: AuthUser }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  return toSession(payload.data.token, payload.data.user);
}

export async function loginWithPassword(params: { email: string; password: string }): Promise<AuthSession> {
  const payload = await request<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  return toSession(payload.data.token, payload.data.user);
}

export async function loginWithGoogle(idToken: string): Promise<AuthSession> {
  const payload = await request<{ token: string; user: AuthUser }>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });

  return toSession(payload.data.token, payload.data.user);
}

export async function fetchCurrentUser(token: string): Promise<AuthSession['user']> {
  const payload = await request<{ user: AuthUser }>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return payload.data.user;
}

export async function analyzeProfile(params: {
  token: string;
  resumeText: string;
  jobDescription: string;
}): Promise<{ analysis: AnalysisResult; createdAt: string }> {
  const payload = await request<{ analysis: AnalysisResult; createdAt: string }>('/analyze', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      resumeText: params.resumeText,
      jobDescription: params.jobDescription,
    }),
  });

  return payload.data;
}

export async function fetchHistory(userId: string, token: string): Promise<AnalysisRecord[]> {
  const payload = await request<{ items: AnalysisRecord[] }>(`/analysis/history/${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return payload.data.items || [];
}

export async function fetchLatestAnalysis(userId: string, token: string): Promise<AnalysisRecord | null> {
  const payload = await request<{ latestAnalysis: AnalysisRecord | null }>(`/analysis/latest/${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return payload.data.latestAnalysis;
}

export async function fetchDashboard(userId: string, token: string): Promise<DashboardData> {
  const payload = await request<DashboardData>(`/dashboard/${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return payload.data;
}

export async function resetUserData(token: string): Promise<number> {
  const payload = await request<{ deletedCount: number }>('/analysis/reset', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return payload.data.deletedCount || 0;
}
