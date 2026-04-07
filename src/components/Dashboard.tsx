import React from 'react';
import { motion } from 'motion/react';
import { Zap, Target, Trophy, Activity, Clock, ChevronRight, BrainCircuit } from 'lucide-react';
import { GlassCard, Button, cn } from './UI';
import { AnalysisRecord, DashboardData } from '../types';

interface DashboardProps {
  dashboardData: DashboardData;
  history: AnalysisRecord[];
  loading: boolean;
  error: string | null;
  onNewAnalysis: () => void;
  onOpenHistory: () => void;
  onOpenResult: (record: AnalysisRecord) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function Dashboard({
  dashboardData,
  history,
  loading,
  error,
  onNewAnalysis,
  onOpenHistory,
  onOpenResult,
}: DashboardProps) {
  const recentItems = history.slice(0, 3);

  const stats = [
    {
      label: 'Total Analyses',
      value: String(dashboardData.totalAnalyses),
      icon: Zap,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Avg Match Score',
      value: `${dashboardData.averageMatchScore}%`,
      icon: Target,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Latest Match Score',
      value: dashboardData.latestAnalysis ? `${dashboardData.latestAnalysis.result.score}%` : '--',
      icon: Trophy,
      color: 'text-tertiary',
      bg: 'bg-tertiary/10',
    },
    {
      label: 'Latest Analysis Time',
      value: dashboardData.latestAnalysis ? new Date(dashboardData.latestAnalysis.createdAt).toLocaleDateString() : 'No data',
      icon: Activity,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Dashboard</h1>
          <p className="text-on-surface-variant font-medium">Real-time analysis data synced from your MongoDB history.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={onNewAnalysis}>
          <Zap className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      {error && <p className="text-sm text-tertiary">{error}</p>}
      {loading && <p className="text-sm text-on-surface-variant">Loading dashboard data...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-6 flex items-center gap-4 hover:border-white/10 transition-all cursor-default group">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110', stat.bg)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
              <div>
                <p className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-headline font-bold break-all">{stat.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-5 h-5 text-primary" />
              <h2 className="font-headline font-semibold text-xl">Latest Analysis Summary</h2>
            </div>
            {dashboardData.latestAnalysis && (
              <Button size="sm" variant="outline" onClick={() => onOpenResult(dashboardData.latestAnalysis as AnalysisRecord)}>
                Open Result
              </Button>
            )}
          </div>

          {!dashboardData.latestAnalysis ? (
            <div className="p-8 rounded-xl bg-surface-bright border border-white/5 text-sm text-on-surface-variant">
              No analysis found yet. Start your first analysis to generate dashboard metrics.
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant">
                <span className="font-bold text-on-surface">Score:</span> {dashboardData.latestAnalysis.result.score}%
              </p>
              <p className="text-sm text-on-surface-variant">
                <span className="font-bold text-on-surface">Created:</span> {formatDate(dashboardData.latestAnalysis.createdAt)}
              </p>
              <p className="text-sm text-on-surface-variant line-clamp-3">{dashboardData.latestAnalysis.result.reasoning}</p>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-secondary" />
              <h2 className="font-headline font-semibold text-xl">Recent History</h2>
            </div>
            <button className="text-xs font-headline font-medium text-primary hover:underline" onClick={onOpenHistory}>
              View All
            </button>
          </div>

          <div className="space-y-6">
            {recentItems.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No history available.</p>
            ) : (
              recentItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between group cursor-pointer" onClick={() => onOpenResult(item)}>
                  <div>
                    <p className="text-sm font-headline font-semibold group-hover:text-primary transition-colors">Match Score {item.result.score}%</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{formatDate(item.createdAt)}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
