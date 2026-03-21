import React from 'react';
import { AlertCircle, CheckCircle2, RefreshCcw, Target } from 'lucide-react';
import { Button, GlassCard } from './UI';
import { ResultResponse } from '../types';

interface ResultsProps {
  result: ResultResponse | null;
  analysisId: string;
  onRerun: () => void;
}

export function Results({ result, analysisId, onRerun }: ResultsProps) {
  if (!result) {
    return <div className="text-on-surface-variant">Run an analysis to view results.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl">Results</h1>
          <p className="text-on-surface-variant">Analysis ID: {analysisId}</p>
        </div>
        <Button onClick={onRerun} className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" />
          Re-run Analysis
        </Button>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="font-headline font-bold text-xl">Match Score</h2>
        </div>
        <p className="text-4xl font-headline font-bold">{result.matchScore}%</p>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="font-headline font-bold mb-4">Matched Skills</h3>
          <div className="space-y-2">
            {result.matchedSkills.map((skill) => (
              <div key={skill} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-headline font-bold mb-4">Missing / Weak Skills</h3>
          <div className="space-y-2">
            {[...result.missingSkills, ...result.weakSkills].map((skill) => (
              <div key={skill} className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-tertiary" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="font-headline font-bold mb-4">Reasoning</h3>
        <ul className="space-y-2 text-sm text-on-surface-variant">
          {result.reasoning.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
