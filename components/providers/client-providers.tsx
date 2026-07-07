'use client';

import React, { ReactNode } from 'react';
import { XpProvider } from './xp-context';
import { TimerProvider } from './timer-context';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <XpProvider>
      <TimerProvider>
        {children}
      </TimerProvider>
    </XpProvider>
  );
}
