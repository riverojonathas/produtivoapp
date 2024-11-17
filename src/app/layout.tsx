'use client';

import { SupabaseProvider } from '@/providers/supabase-provider'
import { QueryProvider } from '@/providers/query-provider'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </QueryProvider>
      </body>
    </html>
  )
} 