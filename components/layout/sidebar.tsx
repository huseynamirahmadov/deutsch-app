'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, CheckCircle, Clock, Languages, Menu, X, User } from 'lucide-react';
import { TimerBadge } from './timer-badge';
import { useXp } from '../providers/xp-context';

export function Sidebar() {
  const pathname = usePathname();
  const { level, totalXp } = useXp();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Timer', href: '/timer', icon: Clock },
    { name: 'Notebook', href: '/notebook', icon: BookOpen },
    { name: 'AI Linter', href: '/linter', icon: CheckCircle },
    { name: 'Translation', href: '/translation', icon: Languages },
  ];

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  if (isAuthRoute) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 glass-panel border-b border-slate-800 sticky top-0 z-40 w-full">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-amber-500">D</span>eutschLern
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer hover:bg-opacity-80 transition-all duration-200 active:scale-95"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        w-64 flex-shrink-0 glass-panel flex flex-col h-full
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-amber-500">D</span>eutschLern
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all duration-200 active:scale-95 min-h-[44px] ${
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

          <button
            onClick={async () => {
              const { signOut } = await import('@/app/actions/auth');
              await signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer transition-all duration-200 active:scale-95 min-h-[44px] border border-slate-700/50 hover:bg-opacity-80"
          >
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
