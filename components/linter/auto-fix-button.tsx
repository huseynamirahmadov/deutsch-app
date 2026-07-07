'use client';

import React from 'react';
import { Wand2 } from 'lucide-react';

interface AutoFixButtonProps {
  onFix: () => void;
  isVisible: boolean;
}

export function AutoFixButton({ onFix, isVisible }: AutoFixButtonProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onFix}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-[1.02]"
    >
      <Wand2 className="w-5 h-5" />
      <span>Auto-Fix All Errors</span>
    </button>
  );
}
