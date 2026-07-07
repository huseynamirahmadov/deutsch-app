import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { signOut } from '@/app/actions/auth';
import Link from 'next/link';
import { ArrowLeft, LogOut, Mail, Calendar, Trophy, Zap, Clock, User } from 'lucide-react';

export const metadata = {
  title: 'Profile | DeutschApp',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch XP and updated_at from public.profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, updated_at')
    .eq('id', user.id)
    .single();

  const xp = profile?.xp || 0;
  const level = Math.floor(xp / 100) + 1;
  const currentLevelXp = xp % 100;
  const progress = (currentLevelXp / 100) * 100;
  const xpNeeded = 100 - currentLevelXp;

  // Safely format dates
  const joinDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  const lastActiveDate = profile?.updated_at 
    ? new Date(profile.updated_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      })
    : 'Recently';

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* ──── Header & Navigation ──── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 w-fit rounded-lg bg-slate-800/50 hover:bg-slate-700/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-white min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Study Dashboard</span>
        </Link>

        <form action={signOut}>
          <button 
            type="submit" 
            className="inline-flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95 border border-rose-500/20 hover:border-rose-500/40 min-h-[44px]"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </form>
      </div>

      {/* ──── Main Profile Dashboard ──── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        
        {/* ── Left Column: User Info Card ── */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden">
            {/* Decorative Background for Avatar */}
            <div className="absolute top-0 w-full h-32 bg-gradient-to-br from-amber-500/20 via-emerald-500/10 to-sky-500/20 opacity-50 blur-xl" />
            
            {/* Avatar */}
            <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-800 shadow-2xl flex items-center justify-center mb-6">
              <span className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent">
                {userInitial}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 break-all">
              {user.email}
            </h2>
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Level {level} Scholar</span>
            </div>
          </div>
          
          {/* Metadata Card */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Account Details</h3>
            
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
                <Mail className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-slate-500">Email Address</span>
                <span className="text-sm font-medium truncate">{user.email}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Joined</span>
                <span className="text-sm font-medium">{joinDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Last Active</span>
                <span className="text-sm font-medium">{lastActiveDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Gamification & Progress ── */}
        <div className="md:col-span-2 space-y-6 sm:space-y-8">
          
          {/* XP Progress Card */}
          <div className="glass-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Your Progress</h2>
                <p className="text-slate-400 text-sm">Keep studying to reach the next milestone.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium text-amber-500 uppercase tracking-wider">Level {level}</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white">
                    {xp} <span className="text-lg font-normal text-slate-500">Total XP</span>
                  </h3>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                  <p className="text-sm font-medium text-slate-300">{currentLevelXp} / 100 XP</p>
                  <p className="text-xs text-slate-500 mt-1">{xpNeeded} XP to Level {level + 1}</p>
                </div>
              </div>

              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden relative z-10">
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Activity Info Card */}
          <div className="glass-card p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-4">How to earn XP?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:bg-slate-800/60 hover:border-amber-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <span className="text-emerald-400 font-bold">+25 XP</span>
                  </div>
                  <h4 className="font-medium text-slate-200">Pomodoro Session</h4>
                </div>
                <p className="text-sm text-slate-400">Complete a full 25-minute study focus timer without interruptions.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:bg-slate-800/60 hover:border-amber-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-sky-500/10 rounded-lg">
                    <span className="text-sky-400 font-bold">+5 XP</span>
                  </div>
                  <h4 className="font-medium text-slate-200">AI Translation</h4>
                </div>
                <p className="text-sm text-slate-400">Translate a text between Azerbaijani and German using the AI assistant.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
