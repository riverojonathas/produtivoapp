import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error)
      return initialValue
    }
  })

  // Atualizar localStorage quando o valor mudar
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
} 