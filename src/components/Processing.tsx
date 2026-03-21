import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Cpu, Zap, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard, cn } from './UI';
import { analyze } from '../services/api';
import { AnalysisSummary } from '../types';

interface ProcessingProps {
  payload: {
    resumeText: string;
    jobDescription: string;
    targetRole: string;
    experienceLevel: string;
  };
  onComplete: (result: AnalysisSummary) => void;
}

export function Processing({ payload, onComplete }: ProcessingProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { label: 'Initializing Neural Engine', icon: Cpu },
    { label: 'Extracting Capability Tokens', icon: BrainCircuit },
    { label: 'Synthesizing Role Alignment', icon: Zap },
    { label: 'Finalizing Evolutionary Path', icon: CheckCircle2 },
  ];

  useEffect(() => {
    let isMounted = true;

    const runAnalysis = async () => {
      try {
        // Simulate progress while waiting for API
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) return prev;
            const next = prev + Math.random() * 5;
            setCurrentStep(Math.min(Math.floor((next / 100) * steps.length), steps.length - 1));
            return next;
          });
        }, 500);

        const result = await analyze(payload);
        
        clearInterval(progressInterval);
        
        if (isMounted) {
          setProgress(100);
          setCurrentStep(steps.length - 1);
          setTimeout(() => {
            onComplete(result);
          }, 1000);
        }
      } catch (err) {
        console.error('Neural Synthesis Error:', err);
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Neural synthesis failed. Please check your connection and try again.';
          setError(message);
        }
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
    };
  }, [payload, onComplete]);

  if (error) {
    return (
      <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-tertiary/10 flex items-center justify-center shadow-2xl shadow-tertiary/20">
          <AlertCircle className="text-tertiary w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-headline font-bold text-2xl">Synthesis Interrupted</h2>
          <p className="text-on-surface-variant">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-surface-bright border border-white/10 rounded-xl font-headline font-bold hover:bg-white/5 transition-all"
        >
          Restart Neural Engine
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center justify-center h-[60vh] space-y-12">
      <div className="relative">
        <div className="w-32 h-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center shadow-2xl shadow-primary/20 intelligence-pulse">
          <Cpu className="text-primary w-16 h-16 animate-pulse" />
        </div>
        <motion.div 
          className="absolute -inset-4 border-2 border-primary/20 rounded-[3rem]"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -inset-8 border border-secondary/10 rounded-[3.5rem]"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-headline font-bold text-2xl tracking-tight">Neural Synthesis in Progress</h2>
          <p className="text-on-surface-variant font-medium">Nebula AI is analyzing your capability matrix...</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">
            <span>Synthesis Progress</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-surface-bright rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {steps.map((step, i) => (
            <div key={i}>
              <GlassCard 
                className={cn(
                  "p-4 flex items-center gap-4 transition-all duration-500",
                  i === currentStep ? "border-primary/30 bg-primary/5 translate-x-2" : 
                  i < currentStep ? "opacity-50" : "opacity-30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  i === currentStep ? "bg-primary/20 text-primary" : 
                  i < currentStep ? "bg-primary/10 text-primary" : "bg-surface-bright text-on-surface-variant"
                )}>
                  {i < currentStep ? <CheckCircle2 className="w-5 h-5" /> : 
                   i === currentStep ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                   <step.icon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "text-sm font-headline font-medium",
                  i === currentStep ? "text-on-surface" : "text-on-surface-variant"
                )}>
                  {step.label}
                </span>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
