'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { XpState, XpHistoryEntry } from '@/lib/types';

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

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('deutsch_xp_state');
    if (saved) {
      try {
        setXpState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse XP state from localStorage');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('deutsch_xp_state', JSON.stringify(xpState));
    }
  }, [xpState, isLoaded]);

  const addXp = (amount: number, source: string) => {
    setXpState((prev) => {
      const newTotal = prev.totalXp + amount;
      const newLevel = Math.floor(newTotal / 100) + 1; // 100 XP per level
      
      const newEntry: XpHistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount,
        source,
      };

      return {
        totalXp: newTotal,
        level: newLevel,
        history: [newEntry, ...prev.history].slice(0, 50), // Keep last 50 entries
      };
    });
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
