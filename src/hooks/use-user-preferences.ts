'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseUserPreferencesReturn<T> {
  preferences: T | null
  updatePreferences: (newPreferences: T) => Promise<void>
  isLoading: boolean
  error: Error | null
}

export function useUserPreferences<T>(
  key: string,
  defaultPreferences: T
): UseUserPreferencesReturn<T> {
  const [preferences, setPreferences] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) return

    const loadPreferences = () => {
      try {
        if (typeof window === 'undefined') return

        const savedPreferences = localStorage.getItem(key)
        
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences))
        } else {
          setPreferences(defaultPreferences)
          localStorage.setItem(key, JSON.stringify(defaultPreferences))
        }
      } catch (err) {
        console.error('Erro ao carregar preferências:', err)
        setError(err instanceof Error ? err : new Error('Erro desconhecido'))
        setPreferences(defaultPreferences)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    loadPreferences()
  }, [key, defaultPreferences, isInitialized])

  const updatePreferences = useCallback(async (newPreferences: T) => {
    try {
      if (typeof window === 'undefined') return

      localStorage.setItem(key, JSON.stringify(newPreferences))
      setPreferences(newPreferences)
    } catch (err) {
      console.error('Erro ao atualizar preferências:', err)
      setError(err instanceof Error ? err : new Error('Erro ao atualizar preferências'))
      throw err
    }
  }, [key])

  return {
    preferences,
    updatePreferences,
    isLoading,
    error
  }
} 