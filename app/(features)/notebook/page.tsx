'use client';

import React, { useState, useEffect } from 'react';
import { CategoryTabs } from '@/components/notebook/category-tabs';
import { NoteEditor } from '@/components/notebook/note-editor';
import { NoteCard } from '@/components/notebook/note-card';
import { Note, NotebookState } from '@/lib/types';
import { BookOpen } from 'lucide-react';
import { useXp } from '@/components/providers/xp-context';

const DEFAULT_CATEGORIES = ['Sich vorstellen', 'Beruf', 'Hobbys', 'Alltag', 'Grammatik'];

const defaultState: NotebookState = {
  notes: [],
  categories: DEFAULT_CATEGORIES,
};

export default function NotebookPage() {
  const [state, setState] = useState<NotebookState>(defaultState);
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addXp } = useXp();

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('deutsch_notebook_state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse notebook state');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('deutsch_notebook_state', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const handleAddCategory = (newCategory: string) => {
    setState(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
    setActiveCategory(newCategory);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'updatedAt'> | Note) => {
    setState(prev => {
      let newNotes = [...prev.notes];
      
      if ('id' in noteData && noteData.id) {
        // Edit existing
        newNotes = newNotes.map(n => 
          n.id === noteData.id ? { ...noteData, updatedAt: new Date().toISOString() } as Note : n
        );
      } else {
        // Create new
        const newNote: Note = {
          id: Date.now().toString(),
          content: noteData.content,
          category: noteData.category,
          updatedAt: new Date().toISOString(),
        };
        newNotes = [newNote, ...newNotes];
        addXp(5, 'Created a Note');
      }
      
      return { ...prev, notes: newNotes };
    });
    setEditingNote(null);
  };

  const handleDeleteNote = (id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
    if (editingNote?.id === id) {
      setEditingNote(null);
    }
  };

  const filteredNotes = state.notes.filter(n => n.category === activeCategory);

  if (!isLoaded) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-3 bg-blue-500/20 rounded-xl">
          <BookOpen className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Dein Notizbuch</h1>
          <p className="text-slate-400">Save vocabulary, grammar rules, and example sentences by category.</p>
        </div>
      </div>

      <div className="shrink-0">
        <CategoryTabs 
          categories={state.categories}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setEditingNote(null); // Clear editor when switching tabs
          }}
          onAddCategory={handleAddCategory}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Note List - Left Column */}
        <div className="lg:col-span-5 flex flex-col min-h-[400px]">
          <h2 className="text-xl font-semibold text-white mb-4 shrink-0">Notizen ({filteredNotes.length})</h2>
          
          <div className="overflow-y-auto pr-2 space-y-4 pb-4">
            {filteredNotes.length === 0 ? (
              <div className="glass-panel p-8 rounded-xl border-dashed border-2 border-slate-700/50 text-center">
                <p className="text-slate-500">Noch keine Notizen in dieser Kategorie.</p>
              </div>
            ) : (
              filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onEdit={setEditingNote}
                  onDelete={handleDeleteNote}
                />
              ))
            )}
          </div>
        </div>

        {/* Note Editor - Right Column */}
        <div className="lg:col-span-7 h-full min-h-[400px]">
          <NoteEditor 
            note={editingNote} 
            category={activeCategory} 
            onSave={handleSaveNote} 
          />
        </div>
      </div>
    </div>
  );
}
