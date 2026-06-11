'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface BackendLoadingScreenProps {
  isVisible: boolean;
  onBackendReady: () => void;
}

export default function BackendLoadingScreen({ isVisible, onBackendReady }: BackendLoadingScreenProps) {
  const [checkAttempts, setCheckAttempts] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const checkBackend = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${apiUrl}/health`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          onBackendReady();
          return;
        }
      } catch (error) {
        // Backend not ready yet
      }

      setCheckAttempts((prev) => prev + 1);
    };

    // Check immediately
    checkBackend();

    // Check every 2 seconds
    const interval = setInterval(checkBackend, 2000);

    return () => clearInterval(interval);
  }, [isVisible, onBackendReady]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-surface bg-gradient-mesh flex flex-col items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-400 rounded-full opacity-20 blur-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">EventIQ</h1>
          <p className="text-gray-400 text-lg">Waking up your AI concierge...</p>
          <p className="text-gray-500 text-sm">
            {checkAttempts > 0 && `Attempt ${checkAttempts}`}
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <div className="text-gray-500 text-sm">
            <p>Please wait while we initialize your event planning assistant.</p>
          </div>

          {/* Loading bars animation */}
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-8 bg-brand-500 rounded-full opacity-60"
                style={{
                  animation: `pulse 1.4s infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scaleY(0.5);
          }
          50% {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}
