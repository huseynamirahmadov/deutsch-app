'use client';

import React from 'react';
import { TimerDisplay } from '@/components/timer/timer-display';
import { TimerControls } from '@/components/timer/timer-controls';
import { useTimer } from '@/components/providers/timer-context';
import { Target, Zap } from 'lucide-react';

export default function TimerPage() {
  const { completedSessions } = useTimer();

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">Pomodoro Timer</h1>
        <p className="text-slate-400 max-w-md mx-auto">
          Focus for 25 minutes. If you navigate away, the timer will keep running in the background. Earn 25 XP upon completion!
        </p>
      </div>

      <div className="glass-card p-12 w-full max-w-md relative overflow-hidden flex flex-col items-center">
        <TimerDisplay />
        <TimerControls />
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md">
        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <Target className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Completed</p>
            <p className="text-xl font-bold text-white">{completedSessions} Sessions</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-lg">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Earned Today</p>
            <p className="text-xl font-bold text-white">{completedSessions * 25} XP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
