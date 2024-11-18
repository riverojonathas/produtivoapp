'use client'

import React from 'react'
import { ThemeProvider } from '@/providers/theme-provider'

export default function AuthLayout({
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