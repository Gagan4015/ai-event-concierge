import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EventIQ — AI Event Concierge',
  description: 'Plan your perfect corporate event with AI-powered venue recommendations',
  keywords: ['event planning', 'AI concierge', 'corporate events', 'venue finder'],
  openGraph: {
    title: 'EventIQ — AI Event Concierge',
    description: 'Plan your perfect corporate event with AI-powered venue recommendations',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-surface text-white antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161b27',
              color: '#fff',
              border: '1px solid #1e2535',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#2dd4bf', secondary: '#0f1117' } },
            error:   { iconTheme: { primary: '#f43f5e', secondary: '#0f1117' } },
          }}
        />
      </body>
    </html>
  );
}
