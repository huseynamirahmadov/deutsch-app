'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, CheckCircle, Languages, Heart, ExternalLink } from 'lucide-react';

const footerLinks = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Notebook', href: '/notebook', icon: BookOpen },
  { name: 'AI Linter', href: '/linter', icon: CheckCircle },
  { name: 'Translation', href: '/translation', icon: Languages },
];

export function Footer() {
  const pathname = usePathname();

  // Hide footer on auth routes, matching sidebar behavior
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  if (isAuthRoute) return null;

  return (
    <footer className="relative w-full">
      {/* Gradient separator line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="bg-slate-950/60 backdrop-blur-md py-10 px-6 md:px-10">
        <div className="mx-auto max-w-6xl">
          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

            {/* ── Left: Brand ── */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <Link
                href="/"
                className="group flex items-center gap-1 text-xl font-bold tracking-tight transition-colors"
              >
                <span className="text-amber-500 group-hover:text-amber-400 transition-colors duration-300">
                  Deutsch
                </span>
                <span className="text-white group-hover:text-slate-200 transition-colors duration-300">
                  Lern
                </span>
              </Link>

              <p className="text-sm text-slate-400/80 max-w-[220px] text-center md:text-left leading-relaxed">
                Your focused space for mastering the German language.
              </p>

              <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                Made with
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                for German learners
              </p>
            </div>

            {/* ── Center: Navigation ── */}
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Navigate
              </h3>
              <nav className="grid grid-cols-2 gap-x-8 gap-y-3">
                {footerLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-2 text-sm transition-all duration-300 ${
                        isActive
                          ? 'text-amber-500'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                          isActive ? 'text-amber-500' : 'text-slate-500 group-hover:text-amber-500/70'
                        }`}
                      />
                      <span className="relative">
                        {item.name}
                        {/* Animated underline on hover */}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber-500/60 transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* ── Right: Powered by & Copyright ── */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Powered by
              </h3>
              <div className="flex items-center gap-4">
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors duration-300"
                >
                  {/* Next.js triangle icon */}
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors duration-300" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="a" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                      <circle cx="90" cy="90" r="90" fill="currentColor" />
                    </mask>
                    <g mask="url(#a)">
                      <circle cx="90" cy="90" r="90" fill="currentColor" />
                      <path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#b)" />
                      <path d="M115 54h12v72h-12z" fill="url(#c)" />
                    </g>
                    <defs>
                      <linearGradient id="b" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fff" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="c" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fff" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>Next.js</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                </a>

                <span className="text-slate-700">·</span>

                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  {/* Supabase icon */}
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors duration-300" viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="url(#supa-a)" />
                    <path d="M63.708 110.284c-2.86 3.601-8.658 1.628-8.727-2.97l-1.007-67.251h45.22c8.19 0 12.758 9.46 7.665 15.874l-43.151 54.347z" fill="url(#supa-b)" fillOpacity=".2" />
                    <path d="M45.317 2.071c2.86-3.601 8.657-1.628 8.726 2.97l.442 67.251H9.83c-8.19 0-12.759-9.46-7.665-15.875L45.317 2.072z" fill="currentColor" />
                    <defs>
                      <linearGradient id="supa-a" x1="53.974" y1="54.974" x2="94.163" y2="71.829" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#249361" />
                        <stop offset="1" stopColor="#3ecf8e" />
                      </linearGradient>
                      <linearGradient id="supa-b" x1="36.156" y1="30.578" x2="54.484" y2="65.081" gradientUnits="userSpaceOnUse">
                        <stop />
                        <stop offset="1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span>Supabase</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                </a>
              </div>

              <div className="flex flex-col items-center md:items-end gap-1 mt-2">
                <p className="text-xs text-slate-500">
                  &copy; {new Date().getFullYear()} DeutschLern
                </p>
                <p className="text-[11px] text-slate-600">
                  All rights reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
