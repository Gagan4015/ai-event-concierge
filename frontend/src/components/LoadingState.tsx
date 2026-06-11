'use client';

import { useEffect, useState } from 'react';
import { Brain, MapPin, DollarSign, CheckCircle } from 'lucide-react';

const STEPS = [
  { icon: Brain,       text: 'Analyzing your event requirements...',  delay: 0    },
  { icon: MapPin,      text: 'Searching for matching venues...',      delay: 1200 },
  { icon: DollarSign,  text: 'Calculating cost estimates...',         delay: 2400 },
  { icon: CheckCircle, text: 'Preparing your proposal...',            delay: 3600 },
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((step, index) =>
      setTimeout(() => setActiveStep(index), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="card p-8 animate-fade-in">
      {/* Spinner */}
      <div className="flex justify-center mb-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-brand-900" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent-teal animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
        </div>
      </div>

      <h3 className="text-center font-semibold text-lg mb-2">AI is planning your event</h3>
      <p className="text-center text-gray-500 text-sm mb-8">
        This usually takes 5–15 seconds
      </p>

      {/* Steps */}
      <div className="space-y-3 max-w-sm mx-auto">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isDone = index < activeStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                isActive
                  ? 'bg-brand-950 border border-brand-800 text-white'
                  : isDone
                  ? 'text-gray-500'
                  : 'text-gray-700'
              }`}
            >
              <Icon
                size={16}
                className={
                  isActive
                    ? 'text-brand-400 animate-pulse'
                    : isDone
                    ? 'text-accent-teal'
                    : 'text-gray-700'
                }
              />
              <span className="text-sm">{step.text}</span>
              {isDone && (
                <CheckCircle size={14} className="text-accent-teal ml-auto" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
