import React from 'react';
import { GlassCard, Button } from './UI';
import { AnalysisRecord } from '../types';

interface HistoryProps {
  items: AnalysisRecord[];
  loading: boolean;
  error: string | null;
  onOpenResult: (item: AnalysisRecord) => void;
  onStartAnalysis: () => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function History({ items, loading, error, onOpenResult, onStartAnalysis }: HistoryProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">History</h1>
          <p className="text-on-surface-variant font-medium">All analyses persisted for the authenticated user.</p>
        </div>
        <Button onClick={onStartAnalysis}>New Analysis</Button>
      </div>

      {loading && <p className="text-sm text-on-surface-variant">Loading history...</p>}
      {error && <p className="text-sm text-tertiary">{error}</p>}

      {items.length === 0 && !loading ? (
        <GlassCard className="p-8 text-center space-y-3">
          <h2 className="font-headline font-bold text-2xl">No Saved Analyses</h2>
          <p className="text-sm text-on-surface-variant">Your history is empty. Create an analysis to persist data in MongoDB.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id}>
              <GlassCard className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-headline font-bold">Match Score: {item.result.score}%</p>
                  <p className="text-xs text-on-surface-variant">Created: {formatDate(item.createdAt)}</p>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{item.jobDescription}</p>
                </div>
                <Button variant="outline" onClick={() => onOpenResult(item)}>View Result</Button>
              </GlassCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
