import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Target, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Download, 
  Share2,
  BrainCircuit,
  TrendingUp
} from 'lucide-react';
import { GlassCard, Button, cn } from './UI';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { AnalysisResult } from '../types';

interface ResultsProps {
  result: AnalysisResult | null;
}

const defaultResult: AnalysisResult = {
  score: 84,
  skills: [
    { name: 'PyTorch', level: 95, status: 'mastered' },
    { name: 'System Design', level: 82, status: 'developing' },
    { name: 'AI Ethics', level: 45, status: 'gap' },
  ],
  reasoning: "Exceptional technical depth in AI/ML architectures. Strong alignment with leadership requirements. Minor gap identified in ML Ops automation.",
  distribution: [
    { subject: 'Technical Depth', A: 120, B: 110, fullMark: 150 },
    { subject: 'System Design', A: 98, B: 130, fullMark: 150 },
    { subject: 'Leadership', A: 86, B: 130, fullMark: 150 },
    { subject: 'Problem Solving', A: 99, B: 100, fullMark: 150 },
    { subject: 'Communication', A: 85, B: 90, fullMark: 150 },
    { subject: 'AI/ML Ethics', A: 65, B: 85, fullMark: 150 },
  ],
  benchmarking: [
    { name: 'Python', current: 95, target: 80 },
    { name: 'PyTorch', current: 88, target: 75 },
    { name: 'System Arch', current: 82, target: 85 },
    { name: 'NLP', current: 92, target: 70 },
    { name: 'Cloud Ops', current: 75, target: 82 },
  ]
};

export function Results({ result }: ResultsProps) {
  const data = result || defaultResult;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-headline font-bold text-primary uppercase tracking-widest">Synthesis Complete</div>
            <span className="text-xs text-on-surface-variant font-medium">Neural synthesis finalized successfully</span>
          </div>
          <h1 className="font-headline font-bold text-4xl tracking-tight">Neural Synthesis Results</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Artifact
          </Button>
          <Button className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-1 p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
          
          <div className="relative mb-8">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-surface-bright"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={552.92}
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 * (1 - data.score / 100) }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="text-primary shadow-[0_0_20px_rgba(143,245,255,0.5)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-headline font-bold">{data.score}</span>
              <span className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Match Score</span>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div className="p-4 rounded-xl bg-surface-bright border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-secondary" />
                <span className="text-sm font-headline font-semibold">Role Alignment</span>
              </div>
              <span className="text-sm font-headline font-bold text-secondary">
                {data.score > 80 ? 'High' : data.score > 60 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-surface-bright border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-headline font-semibold">Capability Pulse</span>
              </div>
              <span className="text-sm font-headline font-bold text-primary">
                {data.score > 75 ? 'Strong' : 'Developing'}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 w-full text-left">
            <h3 className="font-headline font-bold text-lg mb-4">Neural Insights</h3>
            <div className="text-xs text-on-surface-variant leading-relaxed space-y-4">
              {data.reasoning.split('. ').map((insight, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <p>{insight}.</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <BrainCircuit className="w-5 h-5 text-primary" />
                <h2 className="font-headline font-semibold text-xl">Capability Map</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.distribution}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#adaaab', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar
                      name="User Profile"
                      dataKey="A"
                      stroke="#8ff5ff"
                      fill="#8ff5ff"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="Role Benchmark"
                      dataKey="B"
                      stroke="#d575ff"
                      fill="#d575ff"
                      fillOpacity={0.3}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#131314', 
                        border: '1px solid #ffffff10',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <h2 className="font-headline font-semibold text-xl">Skill Benchmarking</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.benchmarking} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#adaaab', fontSize: 11 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#ffffff05' }}
                      contentStyle={{ 
                        backgroundColor: '#131314', 
                        border: '1px solid #ffffff10',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="current" fill="#8ff5ff" radius={[0, 4, 4, 0]} barSize={12} />
                    <Bar dataKey="target" fill="#ffffff10" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-tertiary" />
                <h2 className="font-headline font-semibold text-xl">Evolutionary Path</h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-headline font-medium text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Current State
                <span className="w-2 h-2 rounded-full bg-secondary ml-4"></span>
                Target State
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.skills.map((skill, i) => (
                <div key={i} className="p-6 rounded-2xl bg-surface-bright border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-surface flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                    skill.status === 'mastered' ? 'text-primary' : skill.status === 'developing' ? 'text-secondary' : 'text-tertiary'
                  )}>
                    {skill.status === 'mastered' ? <CheckCircle2 className="w-5 h-5" /> : 
                     skill.status === 'developing' ? <Zap className="w-5 h-5" /> : 
                     <AlertCircle className="w-5 h-5" />}
                  </div>
                  <h4 className="font-headline font-bold text-sm mb-2 group-hover:text-primary transition-colors">{skill.name}</h4>
                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase tracking-widest">
                    <span>Level: {skill.level}%</span>
                    <span className="capitalize">{skill.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="flex items-center gap-2 group">
                View Detailed Learning Roadmap
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
