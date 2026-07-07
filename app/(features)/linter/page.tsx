'use client';

import React, { useState } from 'react';
import { TextInput } from '@/components/linter/text-input';
import { LintResults } from '@/components/linter/lint-results';
import { AutoFixButton } from '@/components/linter/auto-fix-button';
import { lintGermanText } from '@/app/actions/lint-text';
import { LintResult } from '@/lib/types';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { useXp } from '@/components/providers/xp-context';

export default function LinterPage() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LintResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { addXp } = useXp();

  const handleLint = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await lintGermanText(text);
      setResult(res);
      // Reward user for practicing!
      if (res.isValid) {
        addXp(10, 'Perfect Grammar');
      } else {
        addXp(5, 'Grammar Practice');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFix = () => {
    if (result?.correctedText) {
      setText(result.correctedText);
      setResult(null); // Clear results after fixing
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:mb-8">
        <div className="p-3 bg-amber-500/20 rounded-xl w-fit">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Grammar Linter</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1 sm:mt-0">Powered by Gemini 2.5 Flash. Write in German and get instant feedback.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-rose-400 text-sm sm:text-base">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Your Text</h2>
          <TextInput 
            text={text} 
            onChange={(val) => {
              setText(val);
              setResult(null); // Clear results when typing
            }} 
            onSubmit={handleLint} 
            isLoading={isLoading} 
          />
          
          <div className="flex justify-end mt-4">
            <AutoFixButton 
              isVisible={!!result && !result.isValid} 
              onFix={handleAutoFix} 
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Analysis</h2>
          {isLoading ? (
            <div className="glass-card p-6 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-800 rounded w-1/3"></div>
              <div className="h-24 bg-slate-800 rounded w-full"></div>
              <div className="h-24 bg-slate-800 rounded w-full"></div>
            </div>
          ) : (
            <div className="h-full">
              {!result && !isLoading && (
                <div className="glass-card h-full min-h-[200px] flex items-center justify-center p-8 border-dashed border-2 border-slate-700/50 bg-slate-800/20">
                  <p className="text-slate-500 text-center">
                    Submit your text to see grammar, capitalization, and article corrections here.
                  </p>
                </div>
              )}
              {result && (
                <LintResults 
                  errors={result.errors} 
                  isValid={result.isValid} 
                  hasChecked={true} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
