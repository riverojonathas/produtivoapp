'use client';

import { Sidebar } from '@/components/sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-6 max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  )
} 