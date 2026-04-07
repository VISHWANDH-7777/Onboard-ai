import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Mail, Key, Chrome, UserPlus, ArrowRight, User } from 'lucide-react';
import { GlassCard, Button } from './UI';
import { AuthSession } from '../types';
import { loginWithGoogle, loginWithPassword, signup } from '../services/apiService';

type AuthMode = 'login' | 'signup';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
        };
      };
    };
  }
}

interface LoginProps {
  onLogin: (session: AuthSession) => Promise<void>;
}

function loadGoogleScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[data-google-identity]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity script')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity script'));
    document.head.appendChild(script);
  });
}

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleClientId = useMemo(() => {
    const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
    return env?.VITE_GOOGLE_CLIENT_ID || '';
  }, []);

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    loadGoogleScript().catch((scriptError) => {
      console.error(scriptError);
    });
  }, [googleClientId]);

  const submitAuth = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setError('Name is required for signup.');
      return;
    }

    setIsLoading(true);

    try {
      const session =
        mode === 'signup'
          ? await signup({
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password,
            })
          : await loginWithPassword({
              email: email.trim().toLowerCase(),
              password,
            });

      await onLogin(session);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const startGoogleAuth = async () => {
    setError(null);

    if (!googleClientId) {
      setError('Google auth is not configured. Add VITE_GOOGLE_CLIENT_ID.');
      return;
    }

    setIsGoogleLoading(true);

    try {
      await loadGoogleScript();

      if (!window.google?.accounts?.id) {
        throw new Error('Google Identity API is unavailable.');
      }

      await new Promise<void>((resolve, reject) => {
        window.google?.accounts?.id?.initialize({
          client_id: googleClientId,
          callback: async (response: { credential: string }) => {
            try {
              const session = await loginWithGoogle(response.credential);
              await onLogin(session);
              resolve();
            } catch (googleError) {
              reject(googleError);
            }
          },
        });

        window.google?.accounts?.id?.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            reject(new Error('Google sign-in was blocked or closed.'));
          }
        });
      });
    } catch (googleError) {
      setError(googleError instanceof Error ? googleError.message : 'Google authentication failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
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
          <div className="flex items-center rounded-xl bg-surface-bright/40 border border-white/5 p-1">
            <button
              type="button"
              className={`flex-1 rounded-lg py-2 text-xs font-headline font-semibold uppercase tracking-widest transition-all ${
                mode === 'login' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant'
              }`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={`flex-1 rounded-lg py-2 text-xs font-headline font-semibold uppercase tracking-widest transition-all ${
                mode === 'signup' ? 'bg-secondary/20 text-secondary' : 'text-on-surface-variant'
              }`}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-2">
            <h2 className="font-headline font-semibold text-xl">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-sm text-on-surface-variant">
              {mode === 'login' ? 'Sign in with your secure credentials' : 'Create a secure profile to start onboarding'}
            </p>
          </div>

          <div className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-surface-bright transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-surface-bright transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-headline font-medium text-on-surface-variant uppercase tracking-widest">Password</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-surface-bright/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary/50 focus:bg-surface-bright transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-xs text-tertiary">{error}</p>}

          <Button className="w-full py-4 flex items-center justify-center gap-2 group" onClick={submitAuth} disabled={isLoading || isGoogleLoading}>
            {mode === 'login' ? 'Login Securely' : 'Create Secure Account'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-surface-high px-4 text-on-surface-variant">Google OAuth</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs font-headline font-medium disabled:opacity-50"
              disabled={isGoogleLoading || isLoading}
              onClick={startGoogleAuth}
            >
              <Chrome className="w-4 h-4 text-primary" />
              Google Auth
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs font-headline font-medium"
              onClick={() => setMode((current) => (current === 'login' ? 'signup' : 'login'))}
            >
              <UserPlus className="w-4 h-4 text-secondary" />
              {mode === 'login' ? 'Create Profile' : 'Have Account'}
            </button>
          </div>
        </GlassCard>

        <p className="mt-8 text-center text-xs text-on-surface-variant/50 font-medium">Adaptive Intelligence Protocol v3.0.0</p>
      </motion.div>
    </div>
  );
}
