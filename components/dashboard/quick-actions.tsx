import React from 'react';
import Link from 'next/link';
import { Clock, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      title: 'Start a Study Session',
      description: '25-minute Pomodoro timer for focused learning. Earn 25 XP.',
      href: '/timer',
      icon: Clock,
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      hoverColor: 'hover:bg-emerald-500/20 hover:border-emerald-500/30'
    },
    {
      title: 'Check Your Grammar',
      description: 'AI-powered text linter to fix capitalization and articles.',
      href: '/linter',
      icon: CheckCircle,
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      hoverColor: 'hover:bg-amber-500/20 hover:border-amber-500/30'
    },
    {
      title: 'Review Vocabulary',
      description: 'Read and update your categorized German notes.',
      href: '/notebook',
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      hoverColor: 'hover:bg-blue-500/20 hover:border-blue-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link 
            key={action.href}
            href={action.href}
            className={`flex flex-col p-6 rounded-2xl border transition-all duration-300 group ${action.color} ${action.hoverColor} backdrop-blur-sm`}
          >
            <div className="p-3 rounded-xl bg-slate-900/50 w-fit mb-4">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              {action.title}
            </h3>
            <p className="text-slate-400 text-sm mb-4 flex-grow">
              {action.description}
            </p>
            <div className="flex items-center text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Go to feature</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
