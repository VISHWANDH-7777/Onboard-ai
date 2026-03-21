import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Mail, Key, Chrome, UserPlus, ArrowRight } from 'lucide-react';
import { GlassCard, Button } from './UI';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-tertiary/5 rounded-full blur-[100px] animate-pulse delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30 mb-6">
            <Cpu className="text-surface w-10 h-10" />
          </div>
          <h1 className="font-headline font-bold text-4xl tracking-tight text-gradient mb-2">NEBULA AI</h1>
          <p className="text-on-surface-variant font-medium tracking-wide">Adaptive Onboarding Engine</p>
        </div>

        <GlassCard className="p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="font-headline font-semibold text-xl">Welcome Back</h2>
            <p className="text-sm text-on-surface-variant">Synchronize with your neural profile</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Neural ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="vishwa@nebula.ai" 
                  className="w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-surface-bright transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Access Key</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  className="w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-surface-bright transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <Button 
            className="w-full py-4 flex items-center justify-center gap-2 group"
            onClick={onLogin}
          >
            Authenticate Profile
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface-high px-4 text-on-surface-variant">Neural Gateway</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs font-headline font-medium">
              <Chrome className="w-4 h-4 text-primary" />
              Google Auth
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs font-headline font-medium">
              <UserPlus className="w-4 h-4 text-secondary" />
              Create Profile
            </button>
          </div>
        </GlassCard>

        <p className="mt-8 text-center text-xs text-on-surface-variant/50 font-medium">
          Adaptive Intelligence Protocol v2.5.4-beta
        </p>
      </motion.div>
    </div>
  );
}
