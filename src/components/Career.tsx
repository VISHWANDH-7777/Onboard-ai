import React from 'react';
import { TrendingUp, Target, Star, Clock, AlertCircle } from 'lucide-react';
import { GlassCard } from './UI';
import { AnalysisRecord, DashboardData } from '../types';

interface CareerProps {
  history: AnalysisRecord[];
  dashboardData: DashboardData;
  loading: boolean;
}

function getCareerStage(avgScore: number) {
  if (avgScore >= 85) return 'Advanced';
  if (avgScore >= 70) return 'Growing';
  if (avgScore >= 50) return 'Developing';
  return 'Foundation';
}

export function Career({ history, dashboardData, loading }: CareerProps) {
  const recent = history.slice(0, 6);
  const stage = getCareerStage(dashboardData.averageMatchScore);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Evolution Path</h1>
          <p className="text-on-surface-variant font-medium">Trajectory calculated from your real analysis history.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Current Stage</p>
          <p className="text-lg font-headline font-bold text-secondary">{stage}</p>
        </div>
      </div>

      {loading && <p className="text-sm text-on-surface-variant">Loading evolution data...</p>}

      {!loading && history.length === 0 && (
        <GlassCard className="p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-tertiary mx-auto" />
          <h2 className="font-headline font-bold text-xl">No Evolution Data</h2>
          <p className="text-sm text-on-surface-variant">Run analyses to build your career trajectory from real outcomes.</p>
        </GlassCard>
      )}

      {history.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-headline font-semibold text-lg">Average Match Score</h2>
            </div>
            <p className="text-4xl font-headline font-bold text-primary">{dashboardData.averageMatchScore}%</p>
            <p className="text-sm text-on-surface-variant">Based on {dashboardData.totalAnalyses} completed analyses.</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              <h2 className="font-headline font-semibold text-lg">Latest Score</h2>
            </div>
            <p className="text-4xl font-headline font-bold text-secondary">
              {dashboardData.latestAnalysis ? `${dashboardData.latestAnalysis.result.score}%` : '--'}
            </p>
            <p className="text-sm text-on-surface-variant">Most recent position-fit evaluation.</p>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-tertiary" />
              <h2 className="font-headline font-semibold text-lg">Growth Signal</h2>
            </div>
            <p className="text-4xl font-headline font-bold text-tertiary">{stage}</p>
            <p className="text-sm text-on-surface-variant">Derived from DB-backed performance trend.</p>
          </GlassCard>
        </div>
      )}

      {recent.length > 0 && (
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-headline font-semibold text-lg">Recent Evolution Events</h2>
          </div>

          <div className="space-y-3">
            {recent.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-surface-bright/40 border border-white/5">
                <p className="text-sm font-headline font-semibold">Match score recorded: {item.result.score}%</p>
                <p className="text-xs text-on-surface-variant mt-1">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
