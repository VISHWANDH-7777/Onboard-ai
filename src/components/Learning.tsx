import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Zap, 
  PlayCircle, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BrainCircuit, 
  Cpu, 
  Database, 
  Network,
  TrendingUp,
  Target,
  Trophy
} from 'lucide-react';
import { GlassCard, Button, cn } from './UI';

export function Learning() {
  const courses = [
    { 
      title: 'AI Governance Frameworks', 
      provider: 'Nebula Academy', 
      duration: '4h 30m', 
      progress: 0, 
      icon: BrainCircuit, 
      color: 'text-tertiary', 
      bg: 'bg-tertiary/10',
      steps: ['Introduction to AI Ethics', 'Regulatory Landscapes', 'Risk Management', 'Governance Implementation']
    },
    { 
      title: 'Advanced Prompt Engineering', 
      provider: 'DeepLearning.ai', 
      duration: '6h 15m', 
      progress: 35, 
      icon: Zap, 
      color: 'text-secondary', 
      bg: 'bg-secondary/10',
      steps: ['Chain of Thought', 'Few-Shot Learning', 'Prompt Optimization', 'System Prompt Design']
    },
    { 
      title: 'Kubernetes for AI Workloads', 
      provider: 'Cloud Native Foundation', 
      duration: '8h 45m', 
      progress: 15, 
      icon: Network, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      steps: ['GPU Scheduling', 'KubeFlow Basics', 'Model Serving', 'Autoscaling AI Clusters']
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Skill Synthesis</h1>
          <p className="text-on-surface-variant font-medium">Adaptive learning recommendations to close identified neural gaps.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Synthesis Progress</p>
            <p className="text-lg font-headline font-bold text-primary">18% Complete</p>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-surface-bright" />
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * (1 - 0.18)} className="text-primary" />
            </svg>
            <Target className="absolute w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {courses.map((course, i) => (
          <motion.div
            key={course.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-0 overflow-hidden flex flex-col h-full group hover:border-white/10 transition-all">
              <div className={cn("p-8 flex flex-col items-center text-center space-y-4", course.bg)}>
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <course.icon className={cn("w-8 h-8", course.color)} />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xl">{course.title}</h3>
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">{course.provider}</p>
                </div>
              </div>

              <div className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    {course.progress}% Complete
                  </div>
                </div>

                <div className="w-full h-1.5 bg-surface-bright rounded-full overflow-hidden">
                  <motion.div 
                    className={cn("h-full", course.color.replace('text-', 'bg-'))}
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>

                <div className="space-y-3 flex-1">
                  {course.steps.map((step, j) => (
                    <div key={j} className="flex items-center gap-3 group/step cursor-pointer">
                      <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                        j < (course.progress / 25) ? "bg-primary border-primary text-surface" : "border-white/10 text-on-surface-variant group-hover/step:border-white/30"
                      )}>
                        {j < (course.progress / 25) ? <CheckCircle2 className="w-3 h-3" /> : <span className="text-[8px] font-bold">{j + 1}</span>}
                      </div>
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        j < (course.progress / 25) ? "text-on-surface" : "text-on-surface-variant group-hover/step:text-on-surface"
                      )}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-6 flex items-center justify-center gap-2 group/btn">
                  {course.progress > 0 ? 'Continue Synthesis' : 'Initiate Learning'}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <PlayCircle className="w-5 h-5 text-primary" />
            <h2 className="font-headline font-semibold text-xl">Recommended Resources</h2>
          </div>
          <div className="space-y-4">
            {[
              { title: 'AI Governance: A Practical Guide', type: 'Whitepaper', duration: '15 min read', icon: FileText },
              { title: 'The Future of LLM Architectures', type: 'Video', duration: '45 min', icon: PlayCircle },
              { title: 'Prompt Engineering Masterclass', type: 'Workshop', duration: '2 hours', icon: Zap },
              { title: 'Ethical AI Implementation', type: 'Case Study', duration: '20 min read', icon: FileText },
            ].map((res, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-bright/30 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-bright flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <res.icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-headline font-semibold group-hover:text-primary transition-colors">{res.title}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{res.type} • {res.duration}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
          <div className="flex items-center gap-3 mb-8">
            <BrainCircuit className="w-5 h-5 text-secondary" />
            <h2 className="font-headline font-semibold text-xl">Adaptive Learning Pulse</h2>
          </div>
          <div className="space-y-6">
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Based on your recent progress in <span className="text-primary font-bold">Advanced Prompt Engineering</span>, Nebula AI has identified a strong aptitude for <span className="text-secondary font-bold">Chain of Thought</span> reasoning.
            </p>
            <div className="p-6 rounded-2xl bg-surface/50 border border-white/5 space-y-4">
              <h4 className="text-xs font-headline font-bold text-on-surface-variant uppercase tracking-widest">Next Milestone</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-headline font-bold">Neural Architect Certification</p>
                  <p className="text-xs text-on-surface-variant">Complete 3 more synthesis modules to unlock.</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-surface-bright rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-primary"></div>
              </div>
            </div>
            <Button variant="outline" className="w-full">View Full Curriculum</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
