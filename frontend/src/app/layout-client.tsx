'use client';

import { useState, useEffect } from 'react';
import BackendLoadingScreen from '@/components/BackendLoadingScreen';

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [backendReady, setBackendReady] = useState(false);

  // Check if backend is ready on mount
  useEffect(() => {
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
          setBackendReady(true);
        }
      } catch {
        // Backend not ready
      }
    };

    checkBackend();
  }, []);

  return (
    <>
      <BackendLoadingScreen
        isVisible={!backendReady}
        onBackendReady={() => setBackendReady(true)}
      />
      {children}
    </>
  );
}
