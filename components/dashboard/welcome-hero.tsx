'use client';

import React from 'react';
import { useXp } from '../providers/xp-context';

export function WelcomeHero() {
  const { level, totalXp } = useXp();
  
  const xpForNextLevel = level * 100;
  const currentLevelXp = totalXp % 100;
  const progress = (currentLevelXp / 100) * 100;

  return (
    <div className="glass-card p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Willkommen zurück! 👋</h2>
          <p className="text-slate-400 max-w-xl">
            You're doing great. Continue your German learning journey and earn more XP by completing Pomodoro sessions or practicing your writing.
          </p>
        </div>
        
        <div className="glass-panel p-4 rounded-2xl w-full md:w-64 border border-slate-700/50 bg-slate-800/40">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Level {level}</p>
              <p className="text-lg font-bold text-white">{currentLevelXp} <span className="text-sm font-normal text-slate-400">/ 100 XP</span></p>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-right">{100 - currentLevelXp} XP to Level {level + 1}</p>
        </div>
      </div>
    </div>
  );
}
