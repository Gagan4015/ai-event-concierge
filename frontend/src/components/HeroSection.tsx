'use client';

import { MapPin, Users, DollarSign, Clock } from 'lucide-react';

const FEATURES = [
  { icon: MapPin,       label: 'Smart Location Matching' },
  { icon: Users,        label: 'Group Size Optimization' },
  { icon: DollarSign,   label: 'Budget-Aware Planning'   },
  { icon: Clock,        label: 'Instant Proposals'        },
];

export default function HeroSection() {
  return (
    <div className="pt-16 pb-10 text-center animate-fade-in">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                      bg-brand-950 border border-brand-800 text-brand-300
                      text-xs font-medium mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse-slow" />
        AI-Powered Event Planning
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-none">
        Plan your perfect
        <br />
        <span className="text-gradient">corporate event</span>
      </h1>

      <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
        Describe your event in plain English. Our AI instantly generates
        venue proposals tailored to your group, budget, and goals.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-3 py-2 rounded-lg
                       bg-surface-card border border-surface-border
                       text-sm text-gray-400"
          >
            <Icon size={14} className="text-brand-400" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
