'use client';

import React from 'react';
import { useTimer } from '../providers/timer-context';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function TimerControls() {
  const { isRunning, startTimer, pauseTimer, resetTimer, remainingSeconds } = useTimer();

  const isCompleted = remainingSeconds === 0;

  return (
    <div className="flex items-center justify-center gap-6 mt-12">
      <button
        onClick={resetTimer}
        className="p-4 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all border border-slate-700 hover:border-slate-500"
        aria-label="Reset Timer"
      >
        <RotateCcw className="w-6 h-6" />
      </button>

      {isRunning ? (
        <button
          onClick={pauseTimer}
          className="p-6 rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          aria-label="Pause Timer"
        >
          <Pause className="w-8 h-8 fill-current" />
        </button>
      ) : (
        <button
          onClick={startTimer}
          className="p-6 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 transition-all border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
          aria-label="Start Timer"
        >
          {isCompleted ? <RotateCcw className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current translate-x-0.5" />}
        </button>
      )}
    </div>
  );
}
