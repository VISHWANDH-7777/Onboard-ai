import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Target, 
  Trophy, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  ChevronRight,
  Cpu,
  BrainCircuit,
  Network
} from 'lucide-react';
import { GlassCard, Button, cn } from './UI';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1100 },
];

export function Dashboard() {
  const stats = [
    { label: 'Neural Analyses', value: '128', icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Avg Match Score', value: '84%', icon: Target, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Milestones', value: '12', icon: Trophy, color: 'text-tertiary', bg: 'bg-tertiary/10' },
    { label: 'Active Journey', value: 'AI Architect', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Neural Overview</h1>
          <p className="text-on-surface-variant font-medium">Welcome back, your neural profile is synchronized.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-6 flex items-center gap-4 hover:border-white/10 transition-all cursor-default group">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-headline font-bold">{stat.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="lg:col-span-2 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="font-headline font-semibold text-xl">Neural Activity</h2>
            </div>
            <select className="bg-surface-bright border border-white/5 rounded-lg px-3 py-1.5 text-xs font-headline font-medium outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8ff5ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8ff5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#adaaab', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#adaaab', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#131314', 
                    border: '1px solid #ffffff10',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8ff5ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-secondary" />
              <h2 className="font-headline font-semibold text-xl">Recent Syncs</h2>
            </div>
            <button className="text-xs font-headline font-medium text-primary hover:underline">View All</button>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Senior AI Engineer', date: '2 hours ago', score: 92, icon: BrainCircuit, color: 'text-primary' },
              { title: 'ML Ops Specialist', date: 'Yesterday', score: 84, icon: Network, color: 'text-secondary' },
              { title: 'Data Architect', date: '3 days ago', score: 78, icon: Cpu, color: 'text-tertiary' },
            ].map((sync, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-bright flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <sync.icon className={cn("w-5 h-5", sync.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-headline font-semibold group-hover:text-primary transition-colors">{sync.title}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{sync.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-headline font-bold">{sync.score}%</span>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-3xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-1000"></div>
            <h3 className="font-headline font-bold text-lg mb-2 relative z-10">Neural Pulse</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed relative z-10">Your adaptive learning path has been updated based on recent market trends.</p>
            <Button variant="outline" size="sm" className="mt-4 relative z-10">Explore Path</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
