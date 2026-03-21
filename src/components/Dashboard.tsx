import React from 'react';
import { Clock, History, Target, Zap } from 'lucide-react';
import { GlassCard, Button } from './UI';
import { DashboardResponse, HistoryResponse } from '../types';

interface DashboardProps {
  dashboard: DashboardResponse | null;
  history: HistoryResponse['items'];
  onNewAnalysis: () => void;
  onViewResult: (analysisId: string) => void;
  onCompareLatest: () => void;
}

export function Dashboard({ dashboard, history, onNewAnalysis, onViewResult, onCompareLatest }: DashboardProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Dashboard</h1>
          <p className="text-on-surface-variant">Track analyses, scores, and progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCompareLatest}>Compare Latest Scores</Button>
          <Button onClick={onNewAnalysis}>New Analysis</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            <p className="text-sm text-on-surface-variant">Total Analyses</p>
          </div>
          <p className="text-3xl font-headline font-bold mt-3">{dashboard?.totalAnalyses ?? 0}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-secondary" />
            <p className="text-sm text-on-surface-variant">Avg Score</p>
          </div>
          <p className="text-3xl font-headline font-bold mt-3">{dashboard?.avgScore ?? 0}%</p>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-tertiary" />
            <p className="text-sm text-on-surface-variant">Recent Activities</p>
          </div>
          <p className="text-3xl font-headline font-bold mt-3">{dashboard?.recentActivities?.length ?? 0}</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <History className="w-5 h-5 text-primary" />
          <h2 className="font-headline font-bold text-xl">Analysis History</h2>
        </div>

        <div className="space-y-3">
          {history.length === 0 && <p className="text-sm text-on-surface-variant">No analyses yet.</p>}
          {history.map((item) => (
            <div key={item.analysisId} className="flex items-center justify-between p-4 rounded-xl bg-surface-bright/30 border border-white/5">
              <div>
                <p className="font-headline font-semibold">{item.targetRole || 'Target Role'}</p>
                <p className="text-xs text-on-surface-variant">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-headline font-bold">{item.matchScore}%</p>
                <Button size="sm" variant="outline" onClick={() => onViewResult(item.analysisId)}>
                  View Result
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
