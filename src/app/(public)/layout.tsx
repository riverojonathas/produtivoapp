'use client'

import { ThemeProvider } from '@/providers/theme-provider'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
} 