'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { TimerBadge } from './timer-badge';
import { useXp } from '../providers/xp-context';

export function Sidebar() {
  const pathname = usePathname();
  const { level, totalXp } = useXp();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Timer', href: '/timer', icon: Clock },
    { name: 'Notebook', href: '/notebook', icon: BookOpen },
    { name: 'AI Linter', href: '/linter', icon: CheckCircle },
  ];

  return (
    <aside className="w-64 flex-shrink-0 glass-panel flex flex-col h-full sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-amber-500">D</span>eutschLern
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <TimerBadge />
        
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current Level</p>
              <p className="text-2xl font-bold text-white">{level}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono text-amber-500">{totalXp} XP</p>
            </div>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${(totalXp % 100)}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
