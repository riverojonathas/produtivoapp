'use client'

import { usePreferences } from '@/hooks/use-preferences'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = usePreferences()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      await setTheme(newTheme)
    } catch (error) {
      console.error('Erro ao alternar tema:', error)
    }
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 p-0"
      >
        <span className="sr-only">Carregando tema</span>
        <div className="h-3.5 w-3.5" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleTheme}
      className="h-7 w-7 p-0"
      title={theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
    >
      <span className="sr-only">
        {theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
      </span>
      {theme === 'light' ? (
        <Moon className="h-3.5 w-3.5" />
      ) : (
        <Sun className="h-3.5 w-3.5" />
      )}
    </Button>
  )
} 