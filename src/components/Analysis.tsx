import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  FileText, 
  Briefcase, 
  Target, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  ArrowRight,
  X
} from 'lucide-react';
import { GlassCard, Button, cn } from './UI';

interface AnalysisProps {
  onStart: (payload: {
    resumeText: string;
    jobDescription: string;
    targetRole: string;
    experienceLevel: string;
  }) => void;
}

export function Analysis({ onStart }: AnalysisProps) {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [roleRequirements, setRoleRequirements] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      // If it's a text file, read it
      if (droppedFile.type === 'text/plain' || droppedFile.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string);
        };
        reader.readAsText(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target?.result as string);
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto shadow-2xl shadow-primary/10">
          <Cpu className="text-primary w-10 h-10" />
        </div>
        <h1 className="font-headline font-bold text-4xl tracking-tight">Neural Engine Onboarding</h1>
        <p className="text-on-surface-variant font-medium max-w-xl mx-auto">Upload your resume artifact and define role requirements for deep neural synthesis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-headline font-semibold text-xl">Resume Artifact</h2>
          </div>
          
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center group cursor-pointer relative overflow-hidden",
              isDragging ? "border-primary bg-primary/5" : "border-white/10 bg-surface-bright/30 hover:bg-surface-bright/50 hover:border-white/20",
              file ? "border-primary/50 bg-primary/5" : ""
            )}
          >
            {file ? (
              <div className="space-y-4 animate-in zoom-in duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="font-headline font-bold text-sm">{file.name}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{(file.size / 1024).toFixed(1)} KB • Ready for Synthesis</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); setResumeText(''); }}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-on-surface-variant hover:text-tertiary transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-surface-bright flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-on-surface-variant w-6 h-6 group-hover:text-primary transition-colors" />
                </div>
                <p className="font-headline font-semibold text-sm mb-2">Drag and drop resume artifact</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Supports PDF, DOCX, JSON (Max 10MB)</p>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Resume Content (Alternative)</label>
            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here if you don't have a file..." 
              className="w-full h-32 bg-surface-bright/50 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-primary/50 focus:bg-surface-bright transition-all text-sm resize-none"
            ></textarea>
          </div>

          <div className="p-4 rounded-xl bg-tertiary/5 border border-tertiary/10 flex gap-4">
            <AlertCircle className="w-5 h-5 text-tertiary shrink-0" />
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="text-tertiary font-bold">Privacy Protocol:</span> Your data is processed locally and encrypted before neural synthesis. No PII is stored permanently.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-5 h-5 text-secondary" />
            <h2 className="font-headline font-semibold text-xl">Role Requirements</h2>
          </div>

          <GlassCard className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Target Role</label>
              <input 
                type="text" 
                placeholder="e.g. Senior AI Architect" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-secondary/50 focus:bg-surface-bright transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Job Description / Context</label>
              <textarea 
                value={roleRequirements}
                onChange={(e) => setRoleRequirements(e.target.value)}
                placeholder="Paste the role context or neural requirements here..." 
                className="w-full h-48 bg-surface-bright/50 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-secondary/50 focus:bg-surface-bright transition-all text-sm resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Experience Threshold</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-secondary/50 focus:bg-surface-bright transition-all text-sm"
                >
                  <option value="Junior">Junior (1-3 yrs)</option>
                  <option value="Intermediate">Mid-Level (3-5 yrs)</option>
                  <option value="Senior">Senior (5-8 yrs)</option>
                  <option value="Principal">Principal (8+ yrs)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Intelligence Pulse</label>
                <select className="w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-secondary/50 focus:bg-surface-bright transition-all text-sm">
                  <option>Standard Match</option>
                  <option value="Deep Synthesis">Deep Synthesis</option>
                  <option>Evolutionary Path</option>
                </select>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="pt-6 flex justify-center">
        <Button 
          size="lg" 
          className="px-12 flex items-center gap-3 group"
          onClick={() =>
            onStart({
              resumeText,
              jobDescription: roleRequirements,
              targetRole,
              experienceLevel,
            })
          }
          disabled={!resumeText || !roleRequirements || !targetRole}
        >
          <Zap className="w-5 h-5 group-hover:animate-pulse" />
          Initiate Neural Synthesis
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
