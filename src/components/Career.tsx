import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Zap, 
  Target, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BrainCircuit, 
  Cpu, 
  Database, 
  Network,
  ChevronRight,
  Star
} from 'lucide-react';
import { GlassCard, Button, cn } from './UI';

export function Career() {
  const timeline = [
    { 
      title: 'Junior AI Developer', 
      status: 'completed', 
      date: '2022 - 2023', 
      icon: Cpu, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      skills: ['Python', 'SQL', 'Basic ML', 'Git']
    },
    { 
      title: 'ML Engineer', 
      status: 'completed', 
      date: '2023 - 2024', 
      icon: Database, 
      color: 'text-secondary', 
      bg: 'bg-secondary/10',
      skills: ['PyTorch', 'Scikit-Learn', 'Feature Eng', 'Data Pipelines']
    },
    { 
      title: 'Senior AI Engineer', 
      status: 'current', 
      date: '2024 - Present', 
      icon: BrainCircuit, 
      color: 'text-tertiary', 
      bg: 'bg-tertiary/10',
      skills: ['LLM Fine-tuning', 'Vector DBs', 'Distributed Systems', 'RAG']
    },
    { 
      title: 'AI Architect', 
      status: 'upcoming', 
      date: 'Next 12-18 Months', 
      icon: Network, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      skills: ['System Design', 'AI Governance', 'ML Ops', 'Enterprise AI']
    },
    { 
      title: 'Senior AI Architect', 
      status: 'upcoming', 
      date: 'Target 2027', 
      icon: Zap, 
      color: 'text-secondary', 
      bg: 'bg-secondary/10',
      skills: ['Strategic AI', 'Innovation Lead', 'Ethical AI', 'Global Scale']
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Evolution Trajectory</h1>
          <p className="text-on-surface-variant font-medium">Neural projection of your career path and future milestones.</p>
        </div>
        <Button className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Update Trajectory
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="flex items-center gap-3 mb-12">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-headline font-semibold text-xl">Career Timeline</h2>
          </div>

          <div className="relative space-y-0">
            {/* Timeline line */}
            <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-surface-bright"></div>
            
            {timeline.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-20 pb-12 last:pb-0 group"
              >
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-[30px] top-2 w-4 h-4 rounded-full border-4 border-surface z-10 transition-all duration-500",
                  item.status === 'completed' ? "bg-primary shadow-[0_0_10px_rgba(143,245,255,0.5)]" : 
                  item.status === 'current' ? "bg-secondary shadow-[0_0_15px_rgba(213,117,255,0.5)] scale-125" : 
                  "bg-surface-bright"
                )}></div>

                <div className={cn(
                  "p-6 rounded-2xl border transition-all group-hover:bg-white/5",
                  item.status === 'current' ? "bg-secondary/5 border-secondary/20 shadow-xl shadow-secondary/5" : "bg-surface-bright/30 border-white/5"
                )}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg)}>
                        <item.icon className={cn("w-5 h-5", item.color)} />
                      </div>
                      <div>
                        <h3 className="font-headline font-bold text-lg">{item.title}</h3>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{item.date}</p>
                      </div>
                    </div>
                    {item.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-primary" />}
                    {item.status === 'current' && <span className="text-[8px] font-headline font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-secondary text-surface">Current Neural State</span>}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill, j) => (
                      <span key={j} className="text-[10px] font-headline font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-surface-bright/50 border border-white/5 text-on-surface-variant group-hover:text-on-surface group-hover:border-white/10 transition-all">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <Target className="w-5 h-5 text-secondary" />
              <h2 className="font-headline font-semibold text-xl">Neural Milestones</h2>
            </div>
            <div className="space-y-6">
              {[
                { title: 'AI Governance Certification', status: 'In Progress', progress: 65, icon: BrainCircuit, color: 'text-primary' },
                { title: 'System Design Mastery', status: 'Upcoming', progress: 0, icon: Network, color: 'text-secondary' },
                { title: 'Ethical AI Frameworks', status: 'Upcoming', progress: 0, icon: Zap, color: 'text-tertiary' },
              ].map((milestone, i) => (
                <div key={i} className="space-y-3 group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <milestone.icon className={cn("w-4 h-4", milestone.color)} />
                      <span className="text-sm font-headline font-semibold group-hover:text-primary transition-colors">{milestone.title}</span>
                    </div>
                    <span className="text-[10px] font-headline font-bold text-on-surface-variant uppercase tracking-widest">{milestone.status}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-bright rounded-full overflow-hidden">
                    <motion.div 
                      className={cn("h-full", milestone.color.replace('text-', 'bg-'))}
                      initial={{ width: 0 }}
                      animate={{ width: `${milestone.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-8 flex items-center justify-center gap-2">
              View All Milestones
              <ChevronRight className="w-4 h-4" />
            </Button>
          </GlassCard>

          <GlassCard className="p-8 bg-gradient-to-br from-secondary/10 to-tertiary/10 border-secondary/20">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-5 h-5 text-secondary fill-secondary" />
              <h2 className="font-headline font-semibold text-xl">Market Value</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-on-surface-variant font-medium">Current Percentile</p>
                <p className="text-xl font-headline font-bold text-secondary">Top 8%</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-on-surface-variant font-medium">Projected Growth</p>
                <p className="text-xl font-headline font-bold text-primary">+24%</p>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed pt-4 border-t border-white/10">
                Your neural profile is highly competitive in the <span className="text-secondary font-bold">Generative AI</span> and <span className="text-primary font-bold">ML Ops</span> sectors.
              </p>
              <Button className="w-full mt-4">Analyze Market Trends</Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
