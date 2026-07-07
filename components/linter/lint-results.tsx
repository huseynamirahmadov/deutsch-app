'use client';

import React from 'react';
import { LintError } from '@/lib/types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface LintResultsProps {
  errors: LintError[];
  isValid: boolean;
  hasChecked: boolean;
}

export function LintResults({ errors, isValid, hasChecked }: LintResultsProps) {
  if (!hasChecked) return null;

  if (isValid) {
    return (
      <div className="glass-card p-4 sm:p-6 border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3 sm:gap-4">
        <div className="p-2 bg-emerald-500/20 rounded-full shrink-0">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">Ausgezeichnet!</h3>
          <p className="text-slate-400 text-sm sm:text-base">Your text has no grammatical or spelling errors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <AlertCircle className="w-5 h-5 text-rose-500" />
        <h3 className="text-base sm:text-lg font-bold text-white">{errors.length} Fehler gefunden</h3>
      </div>

      {errors.map((error, idx) => (
        <div key={idx} className="glass-panel p-4 sm:p-5 rounded-xl border border-slate-700/50">
          <div className="flex justify-between items-start mb-2 sm:mb-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
              {error.type}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4 font-mono text-base sm:text-lg bg-slate-900/50 p-2 sm:p-3 rounded-lg">
            <span className="text-rose-400 line-through decoration-rose-500/50">{error.original}</span>
            <span className="text-slate-500">→</span>
            <span className="text-emerald-400">{error.suggested}</span>
          </div>

          <div className="text-slate-300 text-sm leading-relaxed border-l-2 border-slate-600 pl-3">
            <p className="font-medium text-slate-400 mb-1">Qayda:</p>
            {error.explanationAzerbaijani}
          </div>
        </div>
      ))}
    </div>
  );
}
