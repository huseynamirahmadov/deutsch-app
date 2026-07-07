'use client';

import React from 'react';
import { Note } from '@/lib/types';
import { Edit2, Trash2 } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const date = new Date(note.updatedAt).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-xl border border-slate-700/50 group hover:border-amber-500/30 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-slate-500 font-mono">{date}</span>
        <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-amber-500 hover:bg-slate-700 cursor-pointer transition-all duration-200 active:scale-95 min-h-[32px] min-w-[32px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-md bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-700 cursor-pointer transition-all duration-200 active:scale-95 min-h-[32px] min-w-[32px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <p className="text-slate-300 whitespace-pre-wrap line-clamp-4">
        {note.content}
      </p>
    </div>
  );
}
