'use client';

import React, { useState, useEffect } from 'react';
import { CategoryTabs } from '@/components/notebook/category-tabs';
import { NoteEditor } from '@/components/notebook/note-editor';
import { NoteCard } from '@/components/notebook/note-card';
import { Note, NotebookState } from '@/lib/types';
import { BookOpen } from 'lucide-react';
import { useXp } from '@/components/providers/xp-context';
import { getNotes, addNote, updateNote, deleteNote } from '@/app/actions/notebook';

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

  // Load from Supabase DB
  useEffect(() => {
    getNotes()
      .then((data) => {
        setState((prev) => ({ ...prev, notes: data }));
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load notebook state from database:', error);
        setIsLoaded(true); // Still set loaded to show empty state/errors
      });
  }, []);

  const handleAddCategory = (newCategory: string) => {
    setState((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    setActiveCategory(newCategory);
  };

  const handleSaveNote = async (noteData: Omit<Note, 'id' | 'updatedAt'> | Note) => {
    try {
      if ('id' in noteData && noteData.id) {
        // Edit existing
        const updated = await updateNote(noteData.id, noteData.category, noteData.content);
        setState((prev) => ({
          ...prev,
          notes: prev.notes.map((n) => (n.id === updated.id ? updated : n)),
        }));
      } else {
        // Create new
        const created = await addNote(noteData.category, noteData.content);
        setState((prev) => ({
          ...prev,
          notes: [created, ...prev.notes],
        }));
        addXp(5, 'Created a Note');
      }
      setEditingNote(null);
    } catch (e) {
      console.error('Failed to save note:', e);
      alert('Error saving note. Please try again.');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setState((prev) => ({
        ...prev,
        notes: prev.notes.filter((n) => n.id !== id),
      }));
      if (editingNote?.id === id) {
        setEditingNote(null);
      }
    } catch (e) {
      console.error('Failed to delete note:', e);
      alert('Error deleting note. Please try again.');
    }
  };

  const filteredNotes = state.notes.filter((n) => n.category === activeCategory);

  if (!isLoaded) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 h-full flex flex-col px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
        <div className="p-3 bg-blue-500/20 rounded-xl w-fit">
          <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dein Notizbuch</h1>
          <p className="text-slate-400 text-sm sm:text-base mt-1 sm:mt-0">Save vocabulary, grammar rules, and example sentences by category.</p>
        </div>
      </div>

      <div className="shrink-0 w-full overflow-x-auto pb-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 flex-1 min-h-0">
        {/* Note List - Left Column */}
        <div className="lg:col-span-5 flex flex-col min-h-[250px] sm:min-h-[400px]">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 shrink-0">Notizen ({filteredNotes.length})</h2>
          
          <div className="overflow-y-auto pr-2 space-y-3 sm:space-y-4 pb-4">
            {filteredNotes.length === 0 ? (
              <div className="glass-panel p-6 sm:p-8 rounded-xl border-dashed border-2 border-slate-700/50 text-center">
                <p className="text-slate-500 text-sm sm:text-base">Noch keine Notizen in dieser Kategorie.</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
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
        <div className="lg:col-span-7 h-full min-h-[300px] sm:min-h-[400px]">
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
