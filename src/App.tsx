import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { type Screen, type AnalysisResult } from './types';
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

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [resumeText, setResumeText] = useState('');
  const [roleRequirements, setRoleRequirements] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Handle login
  const handleLogin = () => {
    setScreen('dashboard');
  };

  // Handle analysis start
  const handleStartAnalysis = (text: string, requirements: string) => {
    setResumeText(text);
    setRoleRequirements(requirements);
    setScreen('processing');
  };

  // Handle analysis completion
  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setScreen('results');
  };

  // Render the current screen
  const renderScreen = () => {
    switch (screen) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard />;
      case 'analysis':
        return <Analysis onStart={handleStartAnalysis} />;
      case 'processing':
        return (
          <Processing 
            resumeText={resumeText} 
            roleRequirements={roleRequirements} 
            onComplete={handleAnalysisComplete} 
          />
        );
      case 'results':
        return <Results result={analysisResult} />;
      case 'learning':
        return <Learning />;
      case 'career':
        return <Career />;
      case 'settings':
        return <SettingsScreen />;
      case 'export':
        return <Export />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-headline font-bold text-on-surface-variant">Neural Module Under Construction</h2>
              <p className="text-on-surface-variant/50">This capability is being synthesized in the next evolution cycle.</p>
              <button 
                onClick={() => setScreen('dashboard')}
                className="text-primary font-headline font-bold hover:underline"
              >
                Return to Command Center
              </button>
            </div>
          </div>
        );
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
              transition={{ duration: 0.4, ease: "easeInOut" }}
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

      {/* Global background effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
