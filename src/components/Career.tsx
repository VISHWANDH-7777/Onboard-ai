import React from 'react';
import { GlassCard } from './UI';
import { CareerPath } from '../types';

interface CareerProps {
  career: CareerPath | null;
}

export function Career({ career }: CareerProps) {
  if (!career) {
    return <div className="text-on-surface-variant">Career path will appear after analysis.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline font-bold text-3xl">Evolution Path</h1>
        <p className="text-on-surface-variant">{career.currentRole}{' -> '}{career.targetRole}</p>
      </div>

      <GlassCard className="p-6">
        <h3 className="font-headline font-bold mb-4">Timeline</h3>
        <div className="space-y-3">
          {career.timeline.map((step) => (
            <p key={step} className="text-sm">{step}</p>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
