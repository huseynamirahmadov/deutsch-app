'use client';

import React from 'react';
import { useTimer } from '../providers/timer-context';

export function TimerDisplay() {
  const { totalSeconds, remainingSeconds } = useTimer();
  
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  
  // Color transition based on progress
  let colorClass = 'stroke-emerald-500';
  if (progress > 50) colorClass = 'stroke-amber-500';
  if (progress > 85) colorClass = 'stroke-rose-500';

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Glow */}
      <div className={`absolute inset-0 m-auto w-[300px] h-[300px] rounded-full blur-3xl opacity-20 ${
        progress > 85 ? 'bg-rose-500' : progress > 50 ? 'bg-amber-500' : 'bg-emerald-500'
      } transition-colors duration-1000`} />

      <svg width="300" height="300" className="transform -rotate-90 relative z-10">
        {/* Background Circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          strokeWidth="12"
          className="stroke-slate-800"
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          strokeWidth="12"
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-1000 ease-linear`}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center z-20">
        <span className="text-6xl font-mono font-bold text-white tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <span className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-widest">
          {remainingSeconds === 0 ? 'Completed' : 'Focus Time'}
        </span>
      </div>
    </div>
  );
}
