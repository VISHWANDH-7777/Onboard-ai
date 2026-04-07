import React from 'react';
import { BookOpen, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard, Button } from './UI';
import { AnalysisRecord } from '../types';

interface LearningProps {
  history: AnalysisRecord[];
  latestAnalysis: AnalysisRecord | null;
  loading: boolean;
}

function deriveRecommendations(latestAnalysis: AnalysisRecord | null) {
  if (!latestAnalysis) {
    return [];
  }

  const gapSkills = latestAnalysis.result.skills.filter((skill) => skill.status === 'gap').slice(0, 5);

  return gapSkills.map((skill) => ({
    title: `Improve ${skill.name}`,
    summary: `Current proficiency is ${skill.level}%. Focus on project-based exercises to close this skill gap.`,
    tasks: [
      `Build one mini-project using ${skill.name}`,
      `Add ${skill.name} examples to your resume`,
      `Re-run analysis after targeted practice`,
    ],
  }));
}

export function Learning({ history, latestAnalysis, loading }: LearningProps) {
  const recommendations = deriveRecommendations(latestAnalysis);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Skill Synthesis</h1>
          <p className="text-on-surface-variant font-medium">Recommendations generated from your latest DB-backed analysis.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Analyses Used</p>
          <p className="text-lg font-headline font-bold text-primary">{history.length}</p>
        </div>
      </div>

      {loading && <p className="text-sm text-on-surface-variant">Loading learning recommendations...</p>}

      {!loading && !latestAnalysis && (
        <GlassCard className="p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-tertiary mx-auto" />
          <h2 className="font-headline font-bold text-xl">No Analysis Data Available</h2>
          <p className="text-sm text-on-surface-variant">Run an analysis to generate personalized learning recommendations.</p>
        </GlassCard>
      )}

      {!loading && latestAnalysis && recommendations.length === 0 && (
        <GlassCard className="p-8 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
          <h2 className="font-headline font-bold text-xl">No Critical Skill Gaps</h2>
          <p className="text-sm text-on-surface-variant">Your latest analysis does not indicate major gaps. Keep practicing your mastered skills.</p>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((item) => (
          <div key={item.title}>
            <GlassCard className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-headline font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-on-surface-variant mt-2">{item.summary}</p>
                </div>
                <BookOpen className="w-5 h-5 text-primary shrink-0" />
              </div>

              <div className="space-y-2">
                {item.tasks.map((task) => (
                  <div key={task} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </Button>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
}
