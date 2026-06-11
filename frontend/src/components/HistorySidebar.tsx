'use client';

import { useEffect, useState, useCallback } from 'react';
import { History, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { EventSearch, Pagination } from '@/types';
import { eventsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface HistorySidebarProps {
  onSelect: (event: EventSearch) => void;
  currentId?: string;
}

export default function HistorySidebar({ onSelect, currentId }: HistorySidebarProps) {
  const [events, setEvents] = useState<EventSearch[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const { events, pagination } = await eventsApi.getHistory(p, 8);
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
    <div className="card p-4 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <History size={15} className="text-brand-400" />
          Search History
        </div>
        {pagination && (
          <span className="text-xs text-gray-600">{pagination.total} total</span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="text-brand-400 animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-6">
          <p className="text-xs text-accent-rose mb-2">{error}</p>
          <button onClick={() => fetchHistory(page)} className="text-xs text-brand-400 hover:text-brand-300">
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && events.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-600">No searches yet.</p>
          <p className="text-xs text-gray-700 mt-1">Your history will appear here.</p>
        </div>
      )}

      {/* Event list */}
      {!loading && !error && events.length > 0 && (
        <div className="space-y-2 mb-4">
          {events.map((event) => (
            <button
              key={event._id}
              onClick={() => onSelect(event)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150',
                'border text-sm',
                event._id === currentId
                  ? 'bg-brand-950 border-brand-800 text-white'
                  : 'bg-surface border-surface-border text-gray-400 hover:text-white hover:border-brand-800 hover:bg-surface-hover'
              )}
            >
              <p className="line-clamp-2 leading-snug mb-1 text-xs">
                {event.userQuery}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-brand-400 font-medium truncate">
                  {event.proposal?.venueName}
                </span>
                <span className="text-[10px] text-gray-600 shrink-0 ml-2">
                  {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-surface-border">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrevPage || loading}
            className="btn-ghost p-1.5 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-gray-600">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={!pagination.hasNextPage || loading}
            className="btn-ghost p-1.5 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
