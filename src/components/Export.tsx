import React, { useMemo } from 'react';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { GlassCard, Button } from './UI';
import { AnalysisRecord, AuthSession } from '../types';

interface ExportProps {
  latestAnalysis: AnalysisRecord | null;
  user: AuthSession['user'];
}

function wrapLines(doc: jsPDF, text: string, x: number, startY: number, maxWidth: number) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, startY);
  return startY + lines.length * 6;
}

export function Export({ latestAnalysis, user }: ExportProps) {
  const gapSkills = useMemo(() => {
    if (!latestAnalysis) {
      return [] as string[];
    }

    return latestAnalysis.result.skills.filter((skill) => skill.status === 'gap').map((skill) => skill.name);
  }, [latestAnalysis]);

  const handleExportPdf = () => {
    if (!latestAnalysis) {
      return;
    }

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text('Onboard AI Profile Export', 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.text(`User: ${user.name} (${user.email})`, 14, y);
    y += 7;
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    doc.setFontSize(13);
    doc.text('Match Summary', 14, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`Match score: ${latestAnalysis.result.score}%`, 14, y);
    y += 7;

    y = wrapLines(doc, `Reasoning: ${latestAnalysis.result.reasoning}`, 14, y, 180) + 4;

    doc.setFontSize(13);
    doc.text('Skills', 14, y);
    y += 8;
    doc.setFontSize(11);

    latestAnalysis.result.skills.forEach((skill) => {
      doc.text(`- ${skill.name}: ${skill.level}% (${skill.status})`, 14, y);
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 4;
    doc.setFontSize(13);
    doc.text('Career Path Signal', 14, y);
    y += 8;
    doc.setFontSize(11);

    const careerPath = latestAnalysis.result.score >= 80 ? 'Advanced Role Ready' : 'Growth Path In Progress';
    doc.text(`Current path: ${careerPath}`, 14, y);
    y += 7;
    doc.text(`Gap skills: ${gapSkills.length ? gapSkills.join(', ') : 'None'}`, 14, y);

    doc.save(`onboard-ai-profile-${user.id}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Export Profile</h1>
          <p className="text-on-surface-variant font-medium">Generate a PDF from your latest database-backed analysis.</p>
        </div>
      </div>

      {!latestAnalysis && (
        <GlassCard className="p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-tertiary mx-auto" />
          <h2 className="font-headline font-bold text-xl">No Analysis To Export</h2>
          <p className="text-sm text-on-surface-variant">Run an analysis to export a real profile PDF.</p>
        </GlassCard>
      )}

      {latestAnalysis && (
        <>
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-headline font-semibold text-lg">Latest Analysis Snapshot</h2>
            </div>
            <p className="text-sm text-on-surface-variant">Match score: {latestAnalysis.result.score}%</p>
            <p className="text-sm text-on-surface-variant">Skills evaluated: {latestAnalysis.result.skills.length}</p>
            <p className="text-sm text-on-surface-variant">Created at: {new Date(latestAnalysis.createdAt).toLocaleString()}</p>
          </GlassCard>

          <Button className="w-full flex items-center justify-center gap-2" onClick={handleExportPdf}>
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </>
      )}
    </div>
  );
}
