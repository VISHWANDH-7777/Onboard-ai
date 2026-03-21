import React from 'react';
import { Download, Link2, Save } from 'lucide-react';
import { Button, GlassCard } from './UI';

interface ExportProps {
  analysisId: string;
  exportState: {
    message?: string;
    fileName?: string;
    reportPath?: string;
    shareLink?: string;
    saved?: boolean;
  } | null;
  onExport: () => void;
}

export function Export({ analysisId, exportState, onExport }: ExportProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl">Export Profile</h1>
          <p className="text-on-surface-variant">Generate PDF, create share link, and save report.</p>
        </div>
        <Button onClick={onExport}>Generate Export</Button>
      </div>

      <GlassCard className="p-6 space-y-4">
        <p className="text-sm">Analysis ID: {analysisId || '-'}</p>
        <div className="flex items-center gap-3 text-sm"><Download className="w-4 h-4" /> PDF generation supported</div>
        <div className="flex items-center gap-3 text-sm"><Link2 className="w-4 h-4" /> Share link supported</div>
        <div className="flex items-center gap-3 text-sm"><Save className="w-4 h-4" /> Report persistence supported</div>
      </GlassCard>

      {exportState && (
        <GlassCard className="p-6 space-y-2">
          <p className="text-sm">{exportState.message}</p>
          <p className="text-sm">File: {exportState.fileName}</p>
          <p className="text-sm">Saved Path: {exportState.reportPath}</p>
          <p className="text-sm">Share Link: {exportState.shareLink}</p>
        </GlassCard>
      )}
    </div>
  );
}
