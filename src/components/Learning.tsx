import React from 'react';
import { BookOpen } from 'lucide-react';
import { GlassCard } from './UI';
import { LearningModule } from '../types';

interface LearningProps {
  modules: LearningModule[];
}

export function Learning({ modules }: LearningProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline font-bold text-3xl">Skill Synthesis</h1>
        <p className="text-on-surface-variant">Adaptive learning roadmap for missing skills.</p>
      </div>

      {modules.length === 0 && <p className="text-on-surface-variant">No modules available yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <div key={module.skill}>
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-headline font-bold">{module.skill}</h3>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">Duration: {module.duration}</p>
              <div className="space-y-2 text-sm">
                {module.steps.map((step) => (
                  <p key={step}>{step}</p>
                ))}
            </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
}
