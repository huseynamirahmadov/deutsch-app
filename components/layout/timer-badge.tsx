'use client';

import React from 'react';
import { useTimer } from '../providers/timer-context';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export function TimerBadge() {
  const { remainingSeconds, isRunning } = useTimer();
  
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  return (
    <Link 
      href="/timer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700 hover:border-amber-500/50"
    >
      <div className="relative">
        <Clock className="w-4 h-4 text-slate-300" />
        {isRunning && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
        )}
      </div>
      <span className={`font-mono text-sm font-medium ${isRunning ? 'text-amber-400' : 'text-slate-300'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </Link>
  );
}
