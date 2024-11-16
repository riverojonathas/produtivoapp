'use client';

import { ThemeProvider } from '@/contexts/theme-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react';
import './globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 1000,
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Suspense fallback={<div>Carregando...</div>}>
              {children}
            </Suspense>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
} 