import React from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Share2, 
  Bell, 
  Search,
  User,
  Cpu,
  History
} from 'lucide-react';
import { type Screen } from '../types';
import { cn } from './UI';

interface SidebarProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export function Sidebar({ currentScreen, onScreenChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'analysis', icon: Zap, label: 'Neural Analysis' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'learning', icon: BookOpen, label: 'Skill Synthesis' },
    { id: 'career', icon: TrendingUp, label: 'Evolution Path' },
    { id: 'export', icon: Share2, label: 'Export Profile' },
    { id: 'settings', icon: Settings, label: 'Neural Config' },
  ];

  return (
    <aside className="w-64 h-screen bg-surface-low border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <Cpu className="text-surface w-6 h-6" />
        </div>
        <span className="font-headline font-bold text-xl tracking-tight text-gradient">NEBULA AI</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id as Screen)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
              currentScreen === item.id 
                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(143,245,255,0.05)]" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
              currentScreen === item.id ? "text-primary" : "text-on-surface-variant"
            )} />
            <span className="font-headline text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button 
          onClick={() => onScreenChange('login')}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-on-surface-variant hover:text-tertiary hover:bg-tertiary/5 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-headline text-sm font-medium">Deactivate</span>
        </button>
      </div>
    </aside>
  );
}

interface TopbarProps {
  userName: string;
  userEmail: string;
}

export function Topbar({ userName, userEmail }: TopbarProps) {
  return (
    <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-40">
      <div className="flex items-center gap-4 bg-surface-high/50 border border-white/5 rounded-xl px-4 py-2 w-96">
        <Search className="w-4 h-4 text-on-surface-variant" />
        <input 
          type="text" 
          placeholder="Search neural patterns..." 
          className="bg-transparent border-none outline-none text-sm text-on-surface w-full placeholder:text-on-surface-variant/50"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors group">
          <Bell className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full border-2 border-surface"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="text-right">
            <p className="text-sm font-headline font-medium">{userName || 'Guest User'}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{userEmail || 'Authenticated Session'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-bright border border-white/10 flex items-center justify-center overflow-hidden">
            <User className="w-6 h-6 text-on-surface-variant" />
          </div>
        </div>
      </div>
    </header>
  );
}
