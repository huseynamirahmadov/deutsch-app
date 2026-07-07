'use client';

import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface TextInputProps {
  text: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function TextInput({ text, onChange, onSubmit, isLoading }: TextInputProps) {
  return (
    <div className="w-full relative">
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Schreiben Sie hier Ihren deutschen Text..."
        className="w-full min-h-[150px] sm:min-h-[200px] glass-card p-4 sm:p-6 text-base sm:text-lg text-white placeholder-slate-500 resize-none focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all bg-slate-900/50"
        disabled={isLoading}
      />
      <div className="absolute bottom-4 right-4 flex items-center gap-3 sm:gap-4">
        <span className="text-xs sm:text-sm font-mono text-slate-500 hidden sm:inline-block">
          {text.length} characters
        </span>
        <button
          onClick={onSubmit}
          disabled={text.trim().length === 0 || isLoading}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-opacity-80 transition-all duration-200 active:scale-95 min-h-[44px] px-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analysieren...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Prüfen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
