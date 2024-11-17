'use client'

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verificar preferência salva
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme
      if (saved) return saved

      // Verificar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark'
  }
} 