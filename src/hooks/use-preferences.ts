'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

interface PreferencesStore {
  theme: 'light' | 'dark'
  density: 'compact' | 'comfortable' | 'spacious'
  setTheme: (theme: 'light' | 'dark') => Promise<void>
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => Promise<void>
  syncPreferences: () => Promise<void>
}

const updateThemeClass = (theme: 'light' | 'dark') => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
    // Persistir no localStorage também
    localStorage.setItem('theme', theme)
  }
}

// Função para detectar tema inicial
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark'

  // Primeiro verificar localStorage direto
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  // Depois verificar preferências do Zustand
  const savedPreferences = localStorage.getItem('preferences')
  if (savedPreferences) {
    try {
      const preferences = JSON.parse(savedPreferences)
      if (preferences.state?.theme === 'light' || preferences.state?.theme === 'dark') {
        return preferences.state.theme
      }
    } catch (e) {
      console.error('Erro ao ler preferências:', e)
    }
  }

  // Padrão é dark
  return 'dark'
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      density: 'comfortable',

      setTheme: async (theme) => {
        try {
          // Atualizar estado local e DOM
          set({ theme })
          updateThemeClass(theme)

          // Salvar no Supabase se autenticado
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            await supabase
              .from('user_settings')
              .upsert({
                user_id: session.user.id,
                theme,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              })
          }
        } catch (error) {
          console.error('Erro ao atualizar tema:', error)
          throw error
        }
      },

      setDensity: async (density) => {
        try {
          // Atualizar estado imediatamente
          set({ density })

          // Tentar salvar no banco se estiver autenticado
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const { error } = await supabase
              .from('user_settings')
              .upsert({
                user_id: session.user.id,
                density,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              })

            if (error) throw error
          }
        } catch (error) {
          console.error('Erro ao atualizar densidade:', error)
          throw error
        }
      },

      syncPreferences: async () => {
        try {
          // Primeiro aplicar tema do localStorage
          const storedTheme = localStorage.getItem('theme')
          if (storedTheme === 'light' || storedTheme === 'dark') {
            set({ theme: storedTheme })
            updateThemeClass(storedTheme)
          }

          // Depois tentar sincronizar com o banco
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) return

          const { data, error } = await supabase
            .from('user_settings')
            .select('theme, density')
            .eq('user_id', session.user.id)
            .single()

          if (error && error.code !== 'PGRST116') throw error

          if (data) {
            const theme = data.theme as 'light' | 'dark'
            const density = data.density as 'compact' | 'comfortable' | 'spacious'
            
            set({ theme, density })
            updateThemeClass(theme)
          } else {
            // Se não houver dados no banco, usar tema atual
            const currentTheme = getInitialTheme()
            await supabase
              .from('user_settings')
              .insert({
                user_id: session.user.id,
                theme: currentTheme,
                density: 'comfortable',
                updated_at: new Date().toISOString()
              })
          }
        } catch (error) {
          console.error('Erro ao sincronizar preferências:', error)
          // Em caso de erro, manter tema atual
          const currentTheme = getInitialTheme()
          set({ theme: currentTheme })
          updateThemeClass(currentTheme)
        }
      }
    }),
    {
      name: 'preferences',
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            const theme = state.theme || getInitialTheme()
            updateThemeClass(theme)
          }
        }
      }
    }
  )
) 