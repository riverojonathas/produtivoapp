'use client'

import { createContext, useContext, useEffect } from 'react'
import { usePreferences } from '@/hooks/use-preferences'

const ThemeProviderContext = createContext({
  theme: 'light' as 'light' | 'dark',
  setTheme: (theme: 'light' | 'dark') => {}
})

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme, setTheme } = usePreferences()

  // Aplicar tema inicial
  useEffect(() => {
    const root = document.documentElement
    root.className = theme
  }, [theme])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 