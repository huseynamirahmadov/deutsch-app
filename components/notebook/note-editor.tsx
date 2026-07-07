'use client';

import React, { useState, useEffect } from 'react';
import { Note } from '@/lib/types';
import { Save, Check } from 'lucide-react';

interface NoteEditorProps {
  note: Note | null;
  category: string;
  onSave: (note: Omit<Note, 'id' | 'updatedAt'> | Note) => void;
}

export function NoteEditor({ note, category, onSave }: NoteEditorProps) {
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Update local state when selected note changes
  useEffect(() => {
    setContent(note ? note.content : '');
    setIsSaved(false);
  }, [note]);

  const handleSave = () => {
    if (!content.trim()) return;
    
    if (note) {
      onSave({ ...note, content });
    } else {
      onSave({ content, category });
      setContent(''); // Clear after creating new
    }
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="glass-card p-6 border-slate-700/50 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          {note ? 'Notiz bearbeiten' : 'Neue Notiz'} <span className="text-slate-500 text-sm font-normal">({category})</span>
        </h3>
        
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            isSaved 
              ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
              : 'bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-400'
          }`}
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Gespeichert' : 'Speichern'}
        </button>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsSaved(false);
        }}
        placeholder="Schreiben Sie hier Ihre Vokabeln, Grammatikregeln oder Beispielsätze..."
        className="flex-1 w-full min-h-[300px] bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-white placeholder-slate-600 resize-none focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
      />
    </div>
  );
}
