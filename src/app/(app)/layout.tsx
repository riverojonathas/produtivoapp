'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Sidebar } from '@/components/sidebar';
import { Loading } from '@/components/ui/loading';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Toaster } from 'sonner';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

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
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-background-primary)]">
        <Loading />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div 
        className={cn(
          "min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)]",
          theme === 'dark' ? 'dark' : ''
        )}
      >
        <div className="flex h-screen">
          <Suspense fallback={<Loading />}>
            <Sidebar />
          </Suspense>
          <main className="flex-1 overflow-auto p-6">
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </main>
        </div>
        <Toaster />
      </div>
    </ErrorBoundary>
  );
} 