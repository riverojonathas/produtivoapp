'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Sidebar } from '@/components/sidebar';
import { Loading } from '@/components/ui/loading';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Algo deu errado</h2>
        <p className="text-[var(--color-text-secondary)]">
          {error.message}
        </p>
      </div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex h-screen">
        <Suspense fallback={<Loading />}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
} 