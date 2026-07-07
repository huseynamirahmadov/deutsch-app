'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { TimerState } from '@/lib/types';
import { useXp } from './xp-context';

interface TimerContextType extends TimerState {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

const POMODORO_SECONDS = 25 * 60; // 25 minutes

const defaultState: TimerState = {
  totalSeconds: POMODORO_SECONDS,
  remainingSeconds: POMODORO_SECONDS,
  isRunning: false,
  completedSessions: 0,
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TimerState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addXp } = useXp();
  
  const lastTickRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage and calculate missed time if running
  useEffect(() => {
    const saved = localStorage.getItem('deutsch_timer_state');
    const savedLastTick = localStorage.getItem('deutsch_timer_last_tick');
    
    if (saved) {
      try {
        const parsedState = JSON.parse(saved) as TimerState;
        
        // If timer was running, account for time passed while page was closed/reloaded
        if (parsedState.isRunning && savedLastTick) {
          const now = Date.now();
          const lastTick = parseInt(savedLastTick, 10);
          const secondsPassed = Math.floor((now - lastTick) / 1000);
          
          let newRemaining = parsedState.remainingSeconds - secondsPassed;
          
          if (newRemaining <= 0) {
            // Timer finished while away
            parsedState.remainingSeconds = 0;
            parsedState.isRunning = false;
            parsedState.completedSessions += 1;
            // We shouldn't call addXp directly here to avoid side effects during render setup,
            // but in a real app we might handle "away completion" differently.
            // For now, we just mark it finished.
          } else {
            parsedState.remainingSeconds = newRemaining;
          }
        }
        
        setState(parsedState);
      } catch (e) {
        console.error('Failed to parse timer state');
      }
    }
    setIsLoaded(true);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!isLoaded) return;

    if (state.isRunning && state.remainingSeconds > 0) {
      lastTickRef.current = Date.now();
      localStorage.setItem('deutsch_timer_last_tick', lastTickRef.current.toString());
      
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.remainingSeconds <= 1) {
            // Timer just finished!
            addXp(25, 'Pomodoro Session');
            return { ...prev, remainingSeconds: 0, isRunning: false, completedSessions: prev.completedSessions + 1 };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
        
        // Update tick timestamp for persistence
        localStorage.setItem('deutsch_timer_last_tick', Date.now().toString());
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, state.remainingSeconds, isLoaded, addXp]);

  // Persist state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('deutsch_timer_state', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const startTimer = () => {
    if (state.remainingSeconds > 0) {
      setState((prev) => ({ ...prev, isRunning: true }));
    } else {
      // If at 0, reset and start
      setState((prev) => ({ ...prev, remainingSeconds: prev.totalSeconds, isRunning: true }));
    }
  };

  const pauseTimer = () => setState((prev) => ({ ...prev, isRunning: false }));
  
  const resetTimer = () => {
    setState((prev) => ({ ...prev, remainingSeconds: prev.totalSeconds, isRunning: false }));
    localStorage.removeItem('deutsch_timer_last_tick');
  };

  return (
    <TimerContext.Provider value={{ ...state, startTimer, pauseTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
