import React from 'react';
import { motion } from 'motion/react';
import { 
  Share2, 
  Download, 
  FileText, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  BrainCircuit, 
  Network, 
  Database,
  TrendingUp,
  Target,
  Trophy,
  Activity,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Star,
  Search,
  User,
  Bell,
  LogOut,
  Trash2,
  Settings,
  Eye,
  Shield,
  Globe,
  Briefcase,
  AlertCircle,
  HelpCircle,
  PlayCircle,
  X,
  Upload,
  Loader2,
  Chrome,
  UserPlus,
  Mail,
  Key
} from 'lucide-react';
import { GlassCard, Button, cn } from './UI';

export function Export() {
  const exportOptions = [
    { 
      title: 'Neural PDF Artifact', 
      description: 'High-fidelity document with full neural trace and skill matrix.', 
      icon: FileText, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      format: 'PDF (2.4 MB)'
    },
    { 
      title: 'Adaptive Share Link', 
      description: 'Dynamic link with real-time neural synchronization for recruiters.', 
      icon: Share2, 
      color: 'text-secondary', 
      bg: 'bg-secondary/10',
      format: 'URL Protocol'
    },
    { 
      title: 'Neural History Sync', 
      description: 'Save current synthesis to your neural profile history.', 
      icon: Database, 
      color: 'text-tertiary', 
      bg: 'bg-tertiary/10',
      format: 'Cloud Sync'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Finalize Neural Profile</h1>
          <p className="text-on-surface-variant font-medium">Export your synthesized profile artifact for external synchronization.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            Preview Artifact
          </Button>
          <Button className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Finalize Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-0 overflow-hidden border-primary/20 relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-surface-bright/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                  <Cpu className="text-surface w-7 h-7" />
                </div>
                <div>
                  <h2 className="font-headline font-bold text-xl tracking-tight text-gradient">NEBULA AI ARTIFACT</h2>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Neural Profile v2.5.4</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-headline font-bold">Vishwa Star</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Senior AI Architect</p>
              </div>
            </div>

            <div className="p-12 space-y-10 bg-surface/50 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Neural Summary</h3>
                    <p className="text-sm text-on-surface leading-relaxed">Highly specialized AI Architect with deep expertise in LLM fine-tuning, vector databases, and distributed systems. Demonstrated ability to synthesize complex neural requirements into scalable architectures.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Match Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-headline font-bold text-primary">84%</div>
                      <div className="flex-1 h-2 bg-surface-bright rounded-full overflow-hidden">
                        <div className="h-full w-[84%] bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Core Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {['PyTorch', 'TensorFlow', 'Vector DBs', 'RAG', 'ML Ops', 'Distributed Systems'].map((s) => (
                        <span key={s} className="text-[10px] font-headline font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Neural Gaps</h3>
                    <div className="flex flex-wrap gap-2">
                      {['AI Governance', 'Prompt Engineering', 'Kubernetes'].map((s) => (
                        <span key={s} className="text-[10px] font-headline font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-tertiary/10 text-tertiary border border-tertiary/20">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-6">
                <h3 className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Evolution Trajectory</h3>
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-surface-bright"></div>
                  {[
                    { label: 'Junior Dev', status: 'completed' },
                    { label: 'ML Engineer', status: 'completed' },
                    { label: 'Senior AI Eng', status: 'current' },
                    { label: 'AI Architect', status: 'upcoming' },
                    { label: 'Senior AI Arch', status: 'upcoming' },
                  ].map((step, i) => (
                    <div key={i} className="relative flex flex-col items-center gap-2">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-4 border-surface z-10",
                        step.status === 'completed' ? "bg-primary" : 
                        step.status === 'current' ? "bg-secondary scale-125" : 
                        "bg-surface-bright"
                      )}></div>
                      <span className={cn(
                        "text-[8px] font-headline font-bold uppercase tracking-widest text-center w-16",
                        step.status === 'current' ? "text-secondary" : "text-on-surface-variant"
                      )}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-surface-bright/30 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-surface-bright flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-on-surface-variant font-medium">Neural Integrity Verified • AES-256 Encrypted</p>
              </div>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Nebula AI Protocol v2.5.4</p>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Export Options</h2>
            {exportOptions.map((opt, i) => (
              <motion.div
                key={opt.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 flex items-center gap-4 hover:border-white/10 transition-all cursor-pointer group">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", opt.bg)}>
                    <opt.icon className={cn("w-6 h-6", opt.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline font-bold text-sm group-hover:text-primary transition-colors">{opt.title}</h3>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed mt-1">{opt.description}</p>
                    <p className="text-[8px] font-headline font-bold text-primary uppercase tracking-widest mt-2">{opt.format}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-primary" />
              <h2 className="font-headline font-semibold text-xl">Neural Pulse</h2>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Your neural profile has been optimized for the <span className="text-primary font-bold">Senior AI Architect</span> role. Exporting this artifact will provide a comprehensive overview of your capabilities and future growth potential.
            </p>
            <Button className="w-full flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download Artifact
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

