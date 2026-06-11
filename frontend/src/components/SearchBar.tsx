'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Search, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (trimmed.length < 10 || isLoading) return;
    onSearch(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClear = () => {
    setQuery('');
    textareaRef.current?.focus();
  };

  const charCount = query.length;
  const isValid = charCount >= 10 && charCount <= 1000;

  return (
    <div className="relative max-w-3xl mx-auto">
      <div
        className={cn(
          'card p-1 transition-all duration-300',
          isLoading && 'shimmer',
          !isLoading && 'hover:border-brand-700 focus-within:border-brand-600 glow-brand'
        )}
      >
        {/* Search icon */}
        <div className="absolute left-4 top-4 text-gray-500 pointer-events-none">
          <Search size={18} />
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your event... e.g. 'A 20-person product launch in Austin for 2 days with a $8k budget'"
          disabled={isLoading}
          rows={3}
          maxLength={1000}
          className={cn(
            'w-full bg-transparent text-white placeholder-gray-500',
            'resize-none pl-11 pr-16 py-3.5',
            'text-sm leading-relaxed',
            'focus:outline-none',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          )}
        />

        {/* Actions row */}
        <div className="flex items-center justify-between px-3 pb-2">
          <span className={cn(
            'text-xs transition-colors',
            charCount > 900 ? 'text-accent-rose' : charCount > 0 ? 'text-gray-500' : 'text-transparent'
          )}>
            {charCount}/1000
          </span>

          <div className="flex items-center gap-2">
            {query && (
              <button
                onClick={handleClear}
                className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded"
                title="Clear"
              >
                <X size={14} />
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm',
                'transition-all duration-200',
                isValid && !isLoading
                  ? 'bg-brand-600 hover:bg-brand-500 text-white'
                  : 'bg-surface-border text-gray-600 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
                  Planning...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-600 mt-2">
        Press <kbd className="px-1.5 py-0.5 bg-surface-card border border-surface-border rounded text-gray-500">Enter</kbd> to submit · <kbd className="px-1.5 py-0.5 bg-surface-card border border-surface-border rounded text-gray-500">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
