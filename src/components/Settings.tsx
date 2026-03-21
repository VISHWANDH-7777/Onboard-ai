import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  User, 
  Cpu, 
  Eye, 
  Shield, 
  Bell, 
  Globe, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  LogOut,
  Trash2
} from 'lucide-react';
import { GlassCard, Button, cn } from './UI';

export function SettingsScreen() {
  const sections = [
    { 
      id: 'profile', 
      title: 'Profile Identity', 
      icon: User, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      fields: [
        { label: 'Neural ID', value: 'vishwastar2005@gmail.com', type: 'text' },
        { label: 'Display Name', value: 'Vishwa Star', type: 'text' },
        { label: 'Adaptive Role', value: 'Senior AI Architect', type: 'select', options: ['Junior AI Dev', 'ML Engineer', 'Senior AI Engineer', 'AI Architect'] },
      ]
    },
    { 
      id: 'interface', 
      title: 'Interface Preferences', 
      icon: Eye, 
      color: 'text-secondary', 
      bg: 'bg-secondary/10',
      fields: [
        { label: 'Visual Mode', value: 'Adaptive Nebula', type: 'select', options: ['Adaptive Nebula', 'Neural Dark', 'Deep Space', 'Light Pulse'] },
        { label: 'Intelligence Pulse', value: 'Deep Synthesis', type: 'select', options: ['Standard Match', 'Deep Synthesis', 'Evolutionary Path'] },
        { label: 'Motion Intensity', value: 'Standard', type: 'select', options: ['None', 'Reduced', 'Standard', 'High'] },
      ]
    },
    { 
      id: 'security', 
      title: 'Neural Security', 
      icon: Shield, 
      color: 'text-tertiary', 
      bg: 'bg-tertiary/10',
      fields: [
        { label: 'Encryption Protocol', value: 'AES-256-GCM', type: 'text', disabled: true },
        { label: 'Two-Factor Auth', value: 'Enabled', type: 'toggle' },
        { label: 'Data Retention', value: '30 Days', type: 'select', options: ['7 Days', '30 Days', '90 Days', 'Indefinite'] },
      ]
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">Neural Config</h1>
          <p className="text-on-surface-variant font-medium">Configure your adaptive intelligence profile and interface.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            Reset Config
          </Button>
          <Button className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                section.id === 'profile' ? "bg-primary/10 text-primary border border-primary/20" : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              )}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-headline text-sm font-medium">{section.title}</span>
            </button>
          ))}
          <div className="pt-6 mt-6 border-t border-white/5 space-y-2">
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:text-tertiary hover:bg-tertiary/5 transition-all duration-200 group">
              <Bell className="w-5 h-5" />
              <span className="font-headline text-sm font-medium">Notifications</span>
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all duration-200 group">
              <Globe className="w-5 h-5" />
              <span className="font-headline text-sm font-medium">Language</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-3 space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", section.bg)}>
                    <section.icon className={cn("w-6 h-6", section.color)} />
                  </div>
                  <h2 className="font-headline font-semibold text-xl">{section.title}</h2>
                </div>

                <div className="space-y-6">
                  {section.fields.map((field, j) => (
                    <div key={j} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">
                        {field.label}
                      </label>
                      <div className="md:col-span-2">
                        {field.type === 'text' && (
                          <input 
                            type="text" 
                            defaultValue={field.value} 
                            disabled={field.disabled}
                            className={cn(
                              "w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-primary/50 focus:bg-surface-bright transition-all text-sm",
                              field.disabled ? "opacity-50 cursor-not-allowed" : ""
                            )}
                          />
                        )}
                        {field.type === 'select' && (
                          <select 
                            defaultValue={field.value}
                            className="w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 px-4 outline-none focus:border-primary/50 focus:bg-surface-bright transition-all text-sm"
                          >
                            {field.options?.map((opt) => (
                              <option key={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                        {field.type === 'toggle' && (
                          <div className="flex items-center gap-3">
                            <button className="w-12 h-6 rounded-full bg-primary/20 border border-primary/30 relative p-1 transition-all">
                              <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(143,245,255,0.5)] translate-x-6"></div>
                            </button>
                            <span className="text-sm font-headline font-medium text-primary">{field.value}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}

          <div className="pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-tertiary hover:bg-tertiary/5 transition-all text-sm font-headline font-medium">
                <Trash2 className="w-4 h-4" />
                Delete Profile
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all text-sm font-headline font-medium">
                <LogOut className="w-4 h-4" />
                Deactivate Session
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Protocol v2.5.4-beta</p>
          </div>
        </div>
      </div>
    </div>
  );
}

