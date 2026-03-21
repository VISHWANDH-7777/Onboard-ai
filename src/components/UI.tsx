import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GlassCardProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "bg-surface-high/60 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-2xl p-6",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-surface hover:bg-primary/90 shadow-[0_0_15px_rgba(143,245,255,0.3)]",
    secondary: "bg-secondary text-surface hover:bg-secondary/90 shadow-[0_0_15px_rgba(213,117,255,0.3)]",
    ghost: "bg-transparent text-on-surface hover:bg-white/5",
    outline: "bg-transparent border border-white/10 text-on-surface hover:bg-white/5"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base font-medium"
  };

  return (
    <button 
      className={cn(
        "rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none font-headline tracking-wide",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
