'use client';

import { useState } from 'react';
import {
  MapPin, DollarSign, Users, Building2, CheckCircle,
  ChevronDown, ChevronUp, Trash2, Clock, Cpu, Star
} from 'lucide-react';
import { EventSearch, VenueProposal } from '@/types';
import { eventsApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface ProposalCardProps {
  event: EventSearch;
  isNew?: boolean;
  onDelete?: () => void;
  compact?: boolean;
}

export default function ProposalCard({ event, isNew, onDelete, compact }: ProposalCardProps) {
  const [expanded, setExpanded] = useState(!compact);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Remove this search from history?')) return;
    setDeleting(true);
    try {
      await eventsApi.delete(event._id);
      toast.success('Removed from history');
      onDelete?.();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        'card overflow-hidden transition-all duration-300',
        isNew && 'animate-slide-up border-brand-800 glow-brand'
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-surface-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isNew && (
                <span className="badge bg-brand-950 text-brand-300 border border-brand-800">
                  <Star size={10} /> New proposal
                </span>
              )}
              <span className="badge bg-surface text-gray-500">
                <Clock size={10} />
                {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
              </span>
              {event.processingTimeMs > 0 && (
                <span className="badge bg-surface text-gray-600">
                  <Cpu size={10} />
                  {(event.processingTimeMs / 1000).toFixed(1)}s
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 line-clamp-2 italic">{event.userQuery}</p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="btn-ghost p-2"
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-ghost p-2 hover:text-accent-rose"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Parsed intent pills */}
      {expanded && event.parsedIntent && (
        <div className="px-5 pt-4 flex flex-wrap gap-2">
          {event.parsedIntent.attendees && (
            <IntentPill icon={Users} label={event.parsedIntent.attendees} color="brand" />
          )}
          {event.parsedIntent.budget && (
            <IntentPill icon={DollarSign} label={event.parsedIntent.budget} color="teal" />
          )}
          {event.parsedIntent.duration && (
            <IntentPill icon={Clock} label={event.parsedIntent.duration} color="gold" />
          )}
          {event.parsedIntent.eventType && (
            <IntentPill icon={Building2} label={event.parsedIntent.eventType} color="brand" />
          )}
        </div>
      )}

      {/* Main proposal */}
      {expanded && (
        <div className="p-5 space-y-5">
          <VenueBlock venue={event.proposal} isPrimary />

          {/* Alternatives */}
          {event.alternativeVenues?.length > 0 && (
            <div>
              <button
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="w-full flex items-center justify-between px-4 py-3
                           rounded-xl bg-surface border border-surface-border
                           text-sm text-gray-400 hover:text-white hover:border-brand-700
                           transition-all duration-200"
              >
                <span>
                  {event.alternativeVenues.length} alternative venue{event.alternativeVenues.length !== 1 ? 's' : ''}
                </span>
                {showAlternatives ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showAlternatives && (
                <div className="mt-3 space-y-3 animate-fade-in">
                  {event.alternativeVenues.map((venue, i) => (
                    <VenueBlock key={i} venue={venue} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IntentPill({
  icon: Icon, label, color,
}: {
  icon: React.ElementType; label: string; color: 'brand' | 'teal' | 'gold';
}) {
  const colors = {
    brand: 'bg-brand-950 border-brand-800 text-brand-300',
    teal:  'bg-teal-950 border-teal-800 text-teal-300',
    gold:  'bg-yellow-950 border-yellow-800 text-yellow-300',
  };

  return (
    <span className={cn('badge border', colors[color])}>
      <Icon size={11} />
      {label}
    </span>
  );
}

function VenueBlock({ venue, isPrimary }: { venue: VenueProposal; isPrimary?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 space-y-4',
        isPrimary
          ? 'bg-brand-950/30 border-brand-900'
          : 'bg-surface border-surface-border'
      )}
    >
      {/* Venue header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isPrimary && (
              <span className="badge bg-brand-600 text-white text-[10px]">
                ★ Top Pick
              </span>
            )}
            {venue.venueType && (
              <span className="text-xs text-gray-500">{venue.venueType}</span>
            )}
          </div>
          <h3 className={cn('font-bold text-lg', isPrimary ? 'text-white' : 'text-gray-200')}>
            {venue.venueName}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
            <MapPin size={12} />
            {venue.location}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className={cn('font-bold text-base', isPrimary ? 'text-accent-teal' : 'text-gray-300')}>
            {venue.estimatedCost}
          </div>
          {venue.capacity && (
            <div className="flex items-center gap-1 text-xs text-gray-500 justify-end mt-1">
              <Users size={10} />
              {venue.capacity}
            </div>
          )}
        </div>
      </div>

      {/* Why it fits */}
      <p className="text-sm text-gray-400 leading-relaxed">{venue.whyItFits}</p>

      {/* Amenities */}
      {venue.amenities?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {venue.amenities.map((amenity) => (
            <span key={amenity} className="flex items-center gap-1.5 text-xs text-gray-400 bg-surface px-2.5 py-1 rounded-lg border border-surface-border">
              <CheckCircle size={11} className="text-accent-teal" />
              {amenity}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
