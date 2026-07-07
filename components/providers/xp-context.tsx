'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { XpState, XpHistoryEntry } from '@/lib/types';
import { getXp, addXpToProfile } from '@/app/actions/xp';

interface XpContextType extends XpState {
  addXp: (amount: number, source: string) => void;
}

const defaultState: XpState = {
  totalXp: 0,
  level: 1,
  history: [],
};

const XpContext = createContext<XpContextType | undefined>(undefined);

export function XpProvider({ children }: { children: ReactNode }) {
  const [xpState, setXpState] = useState<XpState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Supabase DB on mount
  useEffect(() => {
    getXp()
      .then((xp) => {
        setXpState({
          totalXp: xp,
          level: Math.floor(xp / 100) + 1,
          history: [], // For simplicity, we omit history persistence for now
        });
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load XP state from DB', err);
        setIsLoaded(true); // Still load to avoid blocking render
      });
  }, []);

  const addXp = async (amount: number, source: string) => {
    // Optimistically update the UI
    setXpState((prev) => {
      const newTotal = prev.totalXp + amount;
      const newLevel = Math.floor(newTotal / 100) + 1;
      
      const newEntry: XpHistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount,
        source,
      };

      return {
        totalXp: newTotal,
        level: newLevel,
        history: [newEntry, ...prev.history].slice(0, 50),
      };
    });

    // Update the database asynchronously
    try {
      await addXpToProfile(amount);
    } catch (e) {
      console.error('Failed to sync XP to database:', e);
      // In a real app, you might want to revert the optimistic update here if the DB fails
    }
  };

  return (
    <XpContext.Provider value={{ ...xpState, addXp }}>
      {children}
    </XpContext.Provider>
  );
}

export function useXp() {
  const context = useContext(XpContext);
  if (context === undefined) {
    throw new Error('useXp must be used within an XpProvider');
  }
  return context;
}
