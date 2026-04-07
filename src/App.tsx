import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type AnalysisRecord, type AnalysisResult, type AuthSession, type DashboardData, type Screen } from './types';
import { Sidebar, Topbar } from './components/Navigation';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Analysis } from './components/Analysis';
import { Processing } from './components/Processing';
import { Results } from './components/Results';
import { Learning } from './components/Learning';
import { Career } from './components/Career';
import { SettingsScreen } from './components/Settings';
import { Export } from './components/Export';
import { History } from './components/History';
import {
  analyzeProfile,
  clearSession,
  fetchCurrentUser,
  fetchDashboard,
  fetchHistory,
  getStoredSession,
  resetUserData,
  storeSession,
} from './services/apiService';

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

const emptyDashboard: DashboardData = {
  totalAnalyses: 0,
  averageMatchScore: 0,
  latestAnalysis: null,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [resumeText, setResumeText] = useState('');
  const [roleRequirements, setRoleRequirements] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData>(emptyDashboard);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const sessionRef = useRef<AuthSession | null>(null);
  const inFlightAnalysisRef = useRef<{ key: string; promise: Promise<AnalysisResult> } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const loadUserData = useCallback(
    async (activeSession?: AuthSession) => {
      const targetSession = activeSession || sessionRef.current;
      if (!targetSession) {
        return;
      }

      try {
        setIsLoadingData(true);
        setDataError(null);

        const [dashboardResponse, historyResponse] = await Promise.all([
          fetchDashboard(targetSession.user.id, targetSession.token),
          fetchHistory(targetSession.user.id, targetSession.token),
        ]);

        setDashboardData(dashboardResponse);
        setHistory(historyResponse);

        setAnalysisResult((previous) => previous || dashboardResponse.latestAnalysis?.result || null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch user data';
        setDataError(message);
        showToast(message, 'error');
      } finally {
        setIsLoadingData(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    const restoreSession = async () => {
      const stored = getStoredSession();
      if (!stored) {
        return;
      }

      try {
        const refreshedUser = await fetchCurrentUser(stored.token);
        const hydratedSession: AuthSession = {
          token: stored.token,
          user: refreshedUser,
        };
        storeSession(hydratedSession);
        setSession(hydratedSession);
        setScreen('dashboard');
        await loadUserData(hydratedSession);
      } catch {
        clearSession();
        setSession(null);
        setScreen('login');
      }
    };

    restoreSession();
  }, [loadUserData]);

  const handleLogin = async (authSession: AuthSession) => {
    storeSession(authSession);
    setSession(authSession);
    setScreen('dashboard');
    await loadUserData(authSession);
    showToast('Logged in successfully', 'success');
  };

  const handleStartAnalysis = (text: string, requirements: string) => {
    setResumeText(text);
    setRoleRequirements(requirements);
    setScreen('processing');
  };

  const runAnalysis = useCallback(async (text: string, requirements: string) => {
    const activeSession = sessionRef.current;
    if (!activeSession) {
      throw new Error('No active session. Please login again.');
    }

    const analysisKey = `${activeSession.user.id}::${text}::${requirements}`;
    if (inFlightAnalysisRef.current?.key === analysisKey) {
      return inFlightAnalysisRef.current.promise;
    }

    const requestPromise = analyzeProfile({
      token: activeSession.token,
      resumeText: text,
      jobDescription: requirements,
    })
      .then((response) => {
        setAnalysisResult(response.analysis);
        return response.analysis;
      })
      .finally(() => {
        if (inFlightAnalysisRef.current?.key === analysisKey) {
          inFlightAnalysisRef.current = null;
        }
      });

    inFlightAnalysisRef.current = {
      key: analysisKey,
      promise: requestPromise,
    };

    return requestPromise;
  }, []);

  const handleAnalysisComplete = async (result: AnalysisResult) => {
    setAnalysisResult(result);
    await loadUserData();
    setScreen('results');
    showToast('Analysis saved to database', 'success');
  };

  const handleOpenResult = (record: AnalysisRecord) => {
    setAnalysisResult(record.result);
    setScreen('results');
  };

  const handleResetAllData = async () => {
    if (!session) {
      showToast('No active session', 'error');
      return;
    }

    setIsResetting(true);
    try {
      await resetUserData(session.token);
      setHistory([]);
      setDashboardData(emptyDashboard);
      setAnalysisResult(null);
      setResumeText('');
      setRoleRequirements('');
      setScreen('dashboard');
      showToast('All data has been reset', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Reset failed', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    inFlightAnalysisRef.current = null;
    setSession(null);
    setHistory([]);
    setDashboardData(emptyDashboard);
    setAnalysisResult(null);
    setScreen('login');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <Dashboard
            dashboardData={dashboardData}
            history={history}
            loading={isLoadingData}
            error={dataError}
            onNewAnalysis={() => setScreen('analysis')}
            onOpenHistory={() => setScreen('history')}
            onOpenResult={handleOpenResult}
          />
        );
      case 'analysis':
        return <Analysis onStart={handleStartAnalysis} />;
      case 'processing':
        return (
          <Processing
            resumeText={resumeText}
            roleRequirements={roleRequirements}
            onAnalyze={runAnalysis}
            onComplete={handleAnalysisComplete}
            onRetry={() => setScreen('analysis')}
          />
        );
      case 'results':
        return <Results result={analysisResult} />;
      case 'history':
        return (
          <History
            items={history}
            loading={isLoadingData}
            error={dataError}
            onOpenResult={handleOpenResult}
            onStartAnalysis={() => setScreen('analysis')}
          />
        );
      case 'learning':
        return <Learning history={history} latestAnalysis={dashboardData.latestAnalysis} loading={isLoadingData} />;
      case 'career':
        return <Career history={history} dashboardData={dashboardData} loading={isLoadingData} />;
      case 'settings':
        return <SettingsScreen onResetAllData={handleResetAllData} isResetting={isResetting} />;
      case 'export':
        return <Export latestAnalysis={dashboardData.latestAnalysis} user={session.user} />;
      default:
        return null;
    }
  };

  if (screen === 'login' || !session) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/30 selection:text-primary-bright">
      <Sidebar
        currentScreen={screen}
        onScreenChange={(nextScreen) => {
          if (nextScreen === 'login') {
            handleLogout();
            return;
          }
          setScreen(nextScreen);
          const activeSession = sessionRef.current;
          if ((nextScreen === 'dashboard' || nextScreen === 'history') && activeSession) {
            loadUserData(activeSession);
          }
        }}
      />

      <div className="pl-64 min-h-screen flex flex-col">
        <Topbar userName={session.user.name} userEmail={session.user.email} />

        <main className="flex-1 mt-20 p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="max-w-7xl mx-auto w-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="p-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-headline font-bold opacity-30">
            Nebula AI • Adaptive Onboarding Engine • v2.5.4-beta
          </p>
        </footer>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl border text-sm z-[100] ${
            toast.type === 'success'
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'bg-tertiary/10 border-tertiary/30 text-tertiary'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
