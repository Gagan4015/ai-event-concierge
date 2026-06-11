'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, History, Zap } from 'lucide-react';
import { eventsApi } from '@/lib/api';

export default function Navbar() {
  const [stats, setStats] = useState<{ totalSearches: number; searchesToday: number } | null>(null);

  useEffect(() => {
    eventsApi.getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center
                            group-hover:bg-brand-500 transition-colors">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Event<span className="text-gradient">IQ</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="btn-ghost text-sm flex items-center gap-2">
              <Zap size={14} />
              New Search
            </Link>
            <Link href="/history" className="btn-ghost text-sm flex items-center gap-2">
              <History size={14} />
              History
            </Link>
          </nav>

          {/* Stats */}
          {stats && (
            <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
              <span>
                <span className="text-brand-400 font-semibold">{stats.totalSearches}</span> total searches
              </span>
              <span>
                <span className="text-accent-teal font-semibold">{stats.searchesToday}</span> today
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
