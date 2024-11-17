'use client'

import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTheme()

  return (
    <div 
      className={cn(
        "min-h-screen flex items-center justify-center bg-[var(--color-background-primary)] text-[var(--color-text-primary)]",
        theme === 'dark' ? 'dark' : ''
      )}
    >
      {children}
    </div>
  )
} 