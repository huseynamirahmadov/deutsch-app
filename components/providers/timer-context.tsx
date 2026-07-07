'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { TimerState, TimerStateDB } from '@/lib/types';
import { useXp } from './xp-context';
import { getOrInitTimerState, updateTimerState } from '@/app/actions/timer';
import { createClient } from '@/utils/supabase/client';

interface TimerContextType extends TimerState {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

const POMODORO_SECONDS = 25 * 60; // 25 minutes

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  // Splitting state to perfectly match precise sync algorithm
  const [remainingSeconds, setRemainingSeconds] = useState(POMODORO_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const totalSeconds = POMODORO_SECONDS;
  const { addXp } = useXp();
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // 1. Initial Load (Hydration) & Subscription
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      try {
        // Fetch current row for the logged-in user
        const dbState = await getOrInitTimerState();
        
        // Run exact same calculation for hydration
        if (dbState.is_running && dbState.start_time) {
          const now = new Date().getTime();
          const startTime = new Date(dbState.start_time).getTime();
          const elapsed = Math.floor((now - startTime) / 1000);
          setRemainingSeconds(Math.max(0, dbState.duration_seconds - elapsed));
          setIsRunning(true);
        } else {
          setIsRunning(false);
          setRemainingSeconds(dbState.duration_seconds);
        }
        
        setIsLoaded(true);

        // Real-Time Subscription
        channel = supabase
          .channel('timer-sync')
          .on(
            'postgres_changes', 
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'timer_states',
              filter: `user_id=eq.${dbState.user_id}`
            }, 
            (payload) => {
              const newRecord = payload.new as TimerStateDB;
              
              // Synchronization Algorithm
              if (newRecord.is_running && newRecord.start_time) {
                const now = new Date().getTime();
                const startTime = new Date(newRecord.start_time).getTime();
                const elapsed = Math.floor((now - startTime) / 1000);
                
                setRemainingSeconds(Math.max(0, newRecord.duration_seconds - elapsed));
                setIsRunning(true);
              } else {
                setIsRunning(false);
                setRemainingSeconds(newRecord.duration_seconds);
              }
            }
          )
          .subscribe();

      } catch (error) {
        console.error('Failed to init timer state:', error);
        setIsLoaded(true); 
      }
    }

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase]);

  // 2. Local Timer Tick Logic (Runs when isRunning is true)
  useEffect(() => {
    if (!isLoaded) return;

    if (isRunning && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Timer finished!
            addXp(25, 'Pomodoro Session');
            setIsRunning(false);
            setCompletedSessions(c => c + 1);
            
            // Push final state to database
            updateTimerState(false, 0, null).catch(console.error);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, remainingSeconds, isLoaded, addXp]);

  // 3. User Actions
  const startTimer = async () => {
    // Determine starting duration based on current remaining
    const startingDuration = remainingSeconds > 0 ? remainingSeconds : totalSeconds;
    const startTimeStr = new Date().toISOString();
    
    // Optimistic local update
    setRemainingSeconds(startingDuration);
    setIsRunning(true);

    try {
      await updateTimerState(true, startingDuration, startTimeStr);
    } catch (e) {
      console.error('Failed to sync timer start', e);
    }
  };

  const pauseTimer = async () => {
    // Capture current locally ticking duration to persist
    const currentRemaining = remainingSeconds;
    
    // Optimistic local update
    setIsRunning(false);

    try {
      await updateTimerState(false, currentRemaining, null);
    } catch (e) {
      console.error('Failed to sync timer pause', e);
    }
  };
  
  const resetTimer = async () => {
    // Optimistic local update
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);

    try {
      await updateTimerState(false, totalSeconds, null);
    } catch (e) {
      console.error('Failed to sync timer reset', e);
    }
  };

  const contextValue: TimerContextType = {
    totalSeconds,
    remainingSeconds,
    isRunning,
    completedSessions,
    startTimer,
    pauseTimer,
    resetTimer
  };

  return (
    <TimerContext.Provider value={contextValue}>
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
