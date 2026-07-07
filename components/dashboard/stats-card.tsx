import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="glass-card p-6 border border-slate-800 bg-slate-800/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className="p-2 bg-slate-800/80 rounded-lg">
          <Icon className="w-5 h-5 text-amber-500" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-emerald-400' : 'text-slate-500'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
