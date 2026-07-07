'use client';

import React from 'react';
import { TimerDisplay } from '@/components/timer/timer-display';
import { TimerControls } from '@/components/timer/timer-controls';
import { useTimer } from '@/components/providers/timer-context';
import { Target, Zap } from 'lucide-react';

export default function TimerPage() {
  const { completedSessions } = useTimer();

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-2 sm:px-0">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Pomodoro Timer</h1>
        <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">
          Focus for 25 minutes. If you navigate away, the timer will keep running in the background. Earn 25 XP upon completion!
        </p>
      </div>

      <div className="glass-card p-6 sm:p-12 w-full max-w-md relative overflow-hidden flex flex-col items-center">
        <TimerDisplay />
        <TimerControls />
      </div>

      <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-md">
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-lg shrink-0">
            <Target className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-slate-400">Completed</p>
            <p className="text-lg sm:text-xl font-bold text-white">{completedSessions} Sessions</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-lg shrink-0">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-xs sm:text-sm text-slate-400">Earned Today</p>
            <p className="text-lg sm:text-xl font-bold text-white">{completedSessions * 25} XP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
