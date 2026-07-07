'use client';

import { WelcomeHero } from '@/components/dashboard/welcome-hero';
import { StatsCard } from '@/components/dashboard/stats-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { Trophy, Target, Zap } from 'lucide-react';
import { useXp } from '@/components/providers/xp-context';
import { useTimer } from '@/components/providers/timer-context';

export default function Home() {
  const { totalXp, level } = useXp();
  const { completedSessions } = useTimer();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto px-2 sm:px-0">
      <WelcomeHero />
      
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <StatsCard 
            title="Total XP" 
            value={totalXp.toString()} 
            icon={Zap} 
            trend="+25 this week" 
            trendUp={true} 
          />
          <StatsCard 
            title="Study Sessions" 
            value={completedSessions.toString()} 
            icon={Target} 
          />
          <StatsCard 
            title="Current Level" 
            value={level.toString()} 
            icon={Trophy} 
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Quick Actions</h2>
        <QuickActions />
      </div>
    </div>
  );
}
