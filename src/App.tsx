import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  type AnalysisSummary,
  type CareerPath,
  type DashboardResponse,
  type HistoryResponse,
  type LearningModule,
  type ResultResponse,
  type Screen,
} from './types';
import { Sidebar, Topbar } from './components/Navigation';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Analysis } from './components/Analysis';
import { Processing } from './components/Processing';
import { Results } from './components/Results';
import { Learning } from './components/Learning';
import { Career } from './components/Career';
import { Export } from './components/Export';
import {
  compareAnalyses,
  exportReport,
  getCareer,
  getDashboard,
  getHistory,
  getLearning,
  getResult,
  login,
  rerunAnalysis,
} from './services/api';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [analysisPayload, setAnalysisPayload] = useState({
    resumeText: '',
    jobDescription: '',
    targetRole: '',
    experienceLevel: 'Intermediate',
  });

  const [currentAnalysisId, setCurrentAnalysisId] = useState('');
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [careerPath, setCareerPath] = useState<CareerPath | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [history, setHistory] = useState<HistoryResponse['items']>([]);
  const [exportState, setExportState] = useState<{
    message?: string;
    fileName?: string;
    reportPath?: string;
    shareLink?: string;
    saved?: boolean;
  } | null>(null);

  const loadUserData = async (uid: string) => {
    const [dash, hist] = await Promise.all([getDashboard(uid), getHistory(uid)]);
    setDashboard(dash);
    setHistory(hist.items);
  };

  const loadAnalysisData = async (analysisId: string) => {
    const [resultRes, learningRes, careerRes] = await Promise.all([
      getResult(analysisId),
      getLearning(analysisId),
      getCareer(analysisId),
    ]);

    setResult(resultRes);
    setLearningModules(learningRes.learningModules);
    setCareerPath(careerRes);
  };

  useEffect(() => {
    const token = localStorage.getItem('nebula_token');
    const uid = localStorage.getItem('nebula_user_id');
    if (token && uid) {
      setScreen('dashboard');
      loadUserData(uid).catch(() => undefined);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const auth = await login(email, password);
    await loadUserData(auth.user.userId);
    setScreen('dashboard');
  };

  const handleStartAnalysis = (payload: {
    resumeText: string;
    jobDescription: string;
    targetRole: string;
    experienceLevel: string;
  }) => {
    setAnalysisPayload(payload);
    setScreen('processing');
  };

  const handleAnalysisComplete = async (summary: AnalysisSummary) => {
    setCurrentAnalysisId(summary.analysisId);
    await loadAnalysisData(summary.analysisId);
    const uid = localStorage.getItem('nebula_user_id') || '';
    if (uid) {
      await loadUserData(uid);
    }
    setScreen('results');
  };

  const handleViewResult = async (analysisId: string) => {
    setCurrentAnalysisId(analysisId);
    await loadAnalysisData(analysisId);
    setScreen('results');
  };

  const handleRerun = async () => {
    if (!currentAnalysisId) return;
    const rerun = await rerunAnalysis(currentAnalysisId);
    await handleViewResult(rerun.analysisId);
  };

  const handleCompareLatest = async () => {
    if (history.length < 2) return;
    const latest = history[0].analysisId;
    const previous = history[1].analysisId;
    const comparison = await compareAnalyses(previous, latest);
    alert(`Score delta between latest two analyses: ${comparison.scoreDelta.toFixed(2)}%`);
  };

  const handleExport = async () => {
    if (!currentAnalysisId) return;
    const response = await exportReport(currentAnalysisId);
    setExportState(response);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <Dashboard
            dashboard={dashboard}
            history={history}
            onNewAnalysis={() => setScreen('analysis')}
            onViewResult={handleViewResult}
            onCompareLatest={handleCompareLatest}
          />
        );
      case 'analysis':
        return <Analysis onStart={handleStartAnalysis} />;
      case 'processing':
        return <Processing payload={analysisPayload} onComplete={handleAnalysisComplete} />;
      case 'results':
        return <Results result={result} analysisId={currentAnalysisId} onRerun={handleRerun} />;
      case 'learning':
        return <Learning modules={learningModules} />;
      case 'career':
        return <Career career={careerPath} />;
      case 'export':
        return <Export analysisId={currentAnalysisId} exportState={exportState} onExport={handleExport} />;
      default:
        return null;
    }
  };

  if (screen === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/30 selection:text-primary-bright">
      <Sidebar currentScreen={screen} onScreenChange={setScreen} />

      <div className="pl-64 min-h-screen flex flex-col">
        <Topbar />

        <main className="flex-1 mt-20 p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="max-w-7xl mx-auto w-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
