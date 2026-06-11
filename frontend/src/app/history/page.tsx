'use client';

import { useEffect, useState, useCallback } from 'react';
import { History, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EventSearch, Pagination } from '@/types';
import { eventsApi } from '@/lib/api';
import ProposalCard from '@/components/ProposalCard';
import Navbar from '@/components/Navbar';

export default function HistoryPage() {
  const [events, setEvents] = useState<EventSearch[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const { events, pagination } = await eventsApi.getHistory(p, 6);
      setEvents(events);
      setPagination(pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(page);
  }, [page, fetchHistory]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="btn-ghost p-2">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <History size={20} className="text-brand-400" />
              <h1 className="text-2xl font-bold">Search History</h1>
            </div>
            {pagination && (
              <p className="text-sm text-gray-500 mt-1">
                {pagination.total} event{pagination.total !== 1 ? 's' : ''} planned
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-brand-400 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="card p-8 text-center">
            <p className="text-accent-rose mb-3">{error}</p>
            <button onClick={() => fetchHistory(page)} className="btn-primary">
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && events.length === 0 && (
          <div className="card p-12 text-center">
            <History size={40} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No searches yet</h3>
            <p className="text-gray-600 text-sm mb-6">
              Start by describing your event on the home page.
            </p>
            <Link href="/" className="btn-primary inline-flex">
              Plan an Event
            </Link>
          </div>
        )}

        {/* Results */}
        {!loading && !error && events.length > 0 && (
          <>
            <div className="space-y-6 mb-8">
              {events.map((event) => (
                <ProposalCard
                  key={event._id}
                  event={event}
                  compact
                  onDelete={() => fetchHistory(page)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="btn-ghost flex items-center gap-2 disabled:opacity-30"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={!pagination.hasNextPage}
                  className="btn-ghost flex items-center gap-2 disabled:opacity-30"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
