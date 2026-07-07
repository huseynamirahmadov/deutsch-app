'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Category } from '@/lib/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
  onAddCategory: (categoryName: string) => void;
  onUpdateCategory: (categoryId: string, oldName: string, newName: string) => void;
  onDeleteCategory: (categoryId: string, name: string) => void;
}

export function CategoryTabs({ 
  categories, 
  activeCategory, 
  onSelectCategory, 
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}: CategoryTabsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim() && !categories.some(c => c.name === newCat.trim())) {
      onAddCategory(newCat.trim());
      setNewCat('');
      setIsAdding(false);
    }
  };

  const submitEdit = () => {
    if (editingId && editName.trim()) {
      const cat = categories.find(c => c.id === editingId);
      if (cat && cat.name !== editName.trim() && !categories.some(c => c.name === editName.trim())) {
        onUpdateCategory(editingId, cat.name, editName.trim());
      }
    }
    setEditingId(null);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitEdit();
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide min-h-[56px] py-1">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.name;
        const isEditing = editingId === cat.id;

        if (isEditing) {
          return (
            <form key={cat.id} onSubmit={handleEditSubmit} className="flex items-center gap-1 shrink-0">
              <input
                ref={editInputRef}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={submitEdit}
                className="px-3 py-1.5 rounded-full bg-slate-900 border border-amber-500 text-white text-sm outline-none w-32 min-h-[44px]"
              />
            </form>
          );
        }

        return (
          <div key={cat.id} className="relative group flex items-center shrink-0">
            <button
              onClick={() => onSelectCategory(cat.name)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium cursor-pointer transition-all duration-200 min-h-[44px] flex items-center gap-2 group-hover:pr-14 ${
                isActive
                  ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {cat.name}
            </button>
            
            {/* Hover Actions */}
            <div className="absolute right-1.5 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(cat.id);
                  setEditName(cat.name);
                }}
                className={`p-1.5 rounded-full hover:bg-white/20 transition-colors ${isActive ? 'text-black/70 hover:text-black' : 'text-slate-400 hover:text-white'}`}
                aria-label="Edit category"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteCategory(cat.id, cat.name);
                }}
                className={`p-1.5 rounded-full hover:bg-rose-500/20 hover:text-rose-500 transition-colors ${isActive ? 'text-black/70' : 'text-slate-400'}`}
                aria-label="Delete category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}

      {isAdding ? (
        <form onSubmit={handleAdd} className="flex items-center shrink-0">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New Category..."
            autoFocus
            onBlur={() => setIsAdding(false)}
            className="px-4 py-2 rounded-full bg-slate-900 border border-amber-500 text-white text-sm outline-none w-36 min-h-[44px]"
          />
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700 shrink-0 cursor-pointer transition-all duration-200 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-opacity-80"
          aria-label="Add Category"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
