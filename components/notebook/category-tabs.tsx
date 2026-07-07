'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onAddCategory: (category: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelectCategory, onAddCategory }: CategoryTabsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      onAddCategory(newCat.trim());
      setNewCat('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
            activeCategory === cat
              ? 'bg-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
        >
          {cat}
        </button>
      ))}

      {isAdding ? (
        <form onSubmit={handleAdd} className="flex items-center">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New Category..."
            autoFocus
            onBlur={() => setIsAdding(false)}
            className="px-4 py-2 rounded-full bg-slate-900 border border-amber-500 text-white text-sm outline-none w-36"
          />
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700 shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
