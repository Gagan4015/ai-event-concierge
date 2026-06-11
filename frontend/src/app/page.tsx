'use client';

import { useState, useCallback } from 'react';
import { EventSearch } from '@/types';
import { eventsApi } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import ProposalCard from '@/components/ProposalCard';
import HistorySidebar from '@/components/HistorySidebar';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import LoadingState from '@/components/LoadingState';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<EventSearch | null>(null);
  const [historyKey, setHistoryKey] = useState(0);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setCurrentResult(null);

    try {
      const result = await eventsApi.search(query);
      setCurrentResult(result);
      setHistoryKey((k) => k + 1); // refresh history
      toast.success('Venue proposal ready!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectHistory = useCallback((event: EventSearch) => {
    setCurrentResult(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-surface bg-gradient-mesh">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Hero */}
        {!currentResult && !isLoading && <HeroSection />}

        {/* Search */}
        <div className={`${currentResult || isLoading ? 'pt-8' : 'pt-0'} transition-all duration-500`}>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Content */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading && <LoadingState />}

            {currentResult && !isLoading && (
              <ProposalCard
                event={currentResult}
                isNew
                onDelete={() => {
                  setCurrentResult(null);
                  setHistoryKey((k) => k + 1);
                }}
              />
            )}

            {!currentResult && !isLoading && (
              <ExampleQueries onSearch={handleSearch} />
            )}
          </div>

          {/* History sidebar */}
          <div className="lg:col-span-1">
            <HistorySidebar
              key={historyKey}
              onSelect={handleSelectHistory}
              currentId={currentResult?._id}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

const EXAMPLE_QUERIES = [
  'A 10-person leadership retreat in the mountains for 3 days with a $4k budget',
  '50-person team offsite near NYC with AV setup and catering, budget $15k',
  'Intimate board dinner for 8 executives in San Francisco, upscale, $3k',
  '200-person annual conference in Chicago with multiple breakout rooms, $50k',
];

function ExampleQueries({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Try an example
      </h3>
      <div className="space-y-3">
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => onSearch(q)}
            className="w-full text-left px-4 py-3 rounded-xl bg-surface hover:bg-surface-hover
                       border border-surface-border hover:border-brand-600
                       text-sm text-gray-300 hover:text-white
                       transition-all duration-200 group"
          >
            <span className="text-brand-400 mr-2 group-hover:text-brand-300">→</span>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
