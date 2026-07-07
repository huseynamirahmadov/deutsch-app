'use client';

import React, { useState } from 'react';
import { translateText } from '@/app/actions/translate';
import { TranslationResult, TranslationDirection } from '@/lib/types';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Loader2,
  BookOpen,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useXp } from '@/components/providers/xp-context';

export function TranslationModule() {
  const [direction, setDirection] = useState<TranslationDirection>('az-to-de');
  const [sourceText, setSourceText] = useState('');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { addXp } = useXp();

  const isAzToDe = direction === 'az-to-de';
  const sourceLabel = isAzToDe ? 'Azərbaycan dili' : 'Deutsch';
  const targetLabel = isAzToDe ? 'Deutsch' : 'Azərbaycan dili';
  const placeholder = isAzToDe ? 'Mətni daxil edin...' : 'Text eingeben...';

  const handleFlipDirection = () => {
    setDirection((prev) => (prev === 'az-to-de' ? 'de-to-az' : 'az-to-de'));
    setSourceText('');
    setResult(null);
    setErrorMsg(null);
    setCopied(false);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);
    setCopied(false);
    try {
      const res = await translateText(sourceText, direction);
      setResult(res);
      addXp(5, 'Translation Practice');
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.translatedText) return;
    try {
      await navigator.clipboard.writeText(result.translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* ──── Header ──── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:mb-8">
        <div className="p-3 bg-sky-500/20 rounded-xl w-fit">
          <Languages className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Translation</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1 sm:mt-0">
            Powered by Gemini 2.5 Flash. Translate between Azerbaijani and German instantly.
          </p>
        </div>
      </div>

      {/* ──── Error Banner ──── */}
      {errorMsg && (
        <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-rose-400 text-sm sm:text-base">{errorMsg}</p>
        </div>
      )}

      {/* ──── Direction Toggle ──── */}
      <div className="glass-card p-3 sm:p-4 flex items-center justify-center gap-3 sm:gap-4">
        <span
          className={`font-semibold text-sm transition-colors ${
            isAzToDe ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          {isAzToDe ? 'Azərbaycan dili' : 'Deutsch'}
        </span>

        <button
          onClick={handleFlipDirection}
          className="group relative p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-sky-500/40 hover:bg-sky-500/10 cursor-pointer transition-all duration-300 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Flip translation direction"
        >
          <ArrowRightLeft className="w-5 h-5 text-sky-400 transition-transform duration-300 group-hover:rotate-180" />
        </button>

        <span
          className={`font-semibold text-sm transition-colors ${
            !isAzToDe ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          {isAzToDe ? 'Deutsch' : 'Azərbaycan dili'}
        </span>
      </div>

      {/* ──── Main Grid ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* ── Source Panel ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-sky-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              {sourceLabel}
            </h2>
          </div>

          <div className="glass-card p-1">
            <textarea
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                setResult(null);
              }}
              placeholder={placeholder}
              rows={6}
              className="w-full bg-transparent text-white placeholder-slate-600 p-3 sm:p-4 resize-none focus:outline-none text-sm sm:text-base leading-relaxed"
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={isLoading || !sourceText.trim()}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none cursor-pointer transition-all duration-200 active:scale-95 min-h-[44px] hover:bg-opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Translating…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Translate
              </>
            )}
          </button>
        </div>

        {/* ── Target Panel ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                {targetLabel}
              </h2>
            </div>

            {result?.translatedText && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white cursor-pointer transition-all duration-200 active:scale-95 px-2 py-1 rounded-md hover:bg-white/5 min-h-[32px]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          <div className="glass-card min-h-[194px] flex">
            {isLoading ? (
              <div className="flex-1 p-6 space-y-3 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
                <div className="h-4 bg-slate-800 rounded w-5/6" />
              </div>
            ) : result?.translatedText ? (
              <p className="flex-1 p-5 text-white text-base leading-relaxed whitespace-pre-wrap">
                {result.translatedText}
              </p>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 border-dashed border-2 border-slate-700/50 bg-slate-800/20 rounded-2xl">
                <p className="text-slate-500 text-center text-sm">
                  Your translation will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ──── Vocabulary Breakdown ──── */}
      {result && result.vocabularyBreakdown.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-white">Vocabulary Breakdown</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {result.vocabularyBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="glass-card p-5 space-y-3 hover:border-amber-500/30 transition-colors duration-300"
              >
                <div className="flex items-start justify-between">
                  <p className="text-lg font-bold text-white">{item.word}</p>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 bg-slate-800/60 px-2 py-0.5 rounded-full">
                    #{idx + 1}
                  </span>
                </div>
                <p className="text-sm text-sky-300 font-medium">{item.meaning}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{item.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
