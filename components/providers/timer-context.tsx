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
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Helper to sync local state from the DB state
  const syncStateFromDB = (dbState: TimerStateDB) => {
    let remaining = dbState.duration_seconds;
    
    if (dbState.is_running && dbState.start_time) {
      const start = new Date(dbState.start_time).getTime();
      const elapsedSeconds = Math.floor((Date.now() - start) / 1000);
      remaining = Math.max(0, dbState.duration_seconds - elapsedSeconds);
      
      // If timer finished while away
      if (remaining === 0) {
        setState(prev => ({
          ...prev,
          remainingSeconds: 0,
          isRunning: false,
          totalSeconds: POMODORO_SECONDS
        }));
        
        // Push the stopped state back to DB to prevent other devices from re-triggering
        updateTimerState(false, 0, null).catch(console.error);
        return;
      }
    }

    setState(prev => ({
      ...prev,
      remainingSeconds: remaining,
      isRunning: dbState.is_running,
      totalSeconds: POMODORO_SECONDS // Static for now, could be dynamic in future
    }));
  };

  // 1. Initial Load & Realtime Subscription Setup
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function init() {
      try {
        const dbState = await getOrInitTimerState();
        syncStateFromDB(dbState);
        setIsLoaded(true);

        // Subscribe to real-time changes from other devices
        channel = supabase
          .channel('timer_sync')
          .on(
            'postgres_changes', 
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'timer_states',
              filter: `user_id=eq.${dbState.user_id}`
            }, 
            (payload) => {
              // Whenever the DB changes (e.g. from mobile), sync this browser
              syncStateFromDB(payload.new as TimerStateDB);
            }
          )
          .subscribe();

      } catch (error) {
        console.error('Failed to init timer state:', error);
        setIsLoaded(true); // Fallback to local default if offline
      }
    }

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase]);

  // 2. Local Timer Tick Logic (only runs if isRunning is true)
  useEffect(() => {
    if (!isLoaded) return;

    if (state.isRunning && state.remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.remainingSeconds <= 1) {
            // Timer just finished locally on this device!
            addXp(25, 'Pomodoro Session');
            
            // Push final state to database so other devices stop too
            updateTimerState(false, 0, null).catch(console.error);
            
            return { 
              ...prev, 
              remainingSeconds: 0, 
              isRunning: false, 
              completedSessions: prev.completedSessions + 1 
            };
          }
          return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, state.remainingSeconds, isLoaded, addXp]);

  // 3. User Actions
  const startTimer = async () => {
    // If at 0, reset duration before starting
    const startingDuration = state.remainingSeconds > 0 ? state.remainingSeconds : state.totalSeconds;
    const startTime = new Date().toISOString();
    
    // Optimistic UI update
    setState((prev) => ({ 
      ...prev, 
      remainingSeconds: startingDuration, 
      isRunning: true 
    }));

    try {
      await updateTimerState(true, startingDuration, startTime);
    } catch (e) {
      console.error('Failed to sync timer start', e);
    }
  };

  const pauseTimer = async () => {
    // Optimistic UI update
    const currentRemaining = state.remainingSeconds;
    setState((prev) => ({ ...prev, isRunning: false }));

    try {
      await updateTimerState(false, currentRemaining, null);
    } catch (e) {
      console.error('Failed to sync timer pause', e);
    }
  };
  
  const resetTimer = async () => {
    // Optimistic UI update
    setState((prev) => ({ 
      ...prev, 
      remainingSeconds: prev.totalSeconds, 
      isRunning: false 
    }));

    try {
      await updateTimerState(false, POMODORO_SECONDS, null);
    } catch (e) {
      console.error('Failed to sync timer reset', e);
    }
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
