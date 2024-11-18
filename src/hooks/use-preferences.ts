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
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }
}

// Função para detectar tema inicial
const getInitialTheme = (): 'light' | 'dark' => {
  // Sempre retornar dark em SSR
  if (typeof window === 'undefined') return 'dark'
  
  // Verificar preferência salva
  const savedTheme = localStorage.getItem('preferences')
  if (savedTheme) {
    try {
      const preferences = JSON.parse(savedTheme)
      return preferences.state?.theme || 'dark'
    } catch (e) {
      console.error('Erro ao ler tema salvo:', e)
    }
  }

  // Usar dark como padrão
  return 'dark'
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      density: 'comfortable',

      setTheme: async (theme) => {
        try {
          // Atualizar estado e DOM imediatamente
          set({ theme })
          updateThemeClass(theme)

          // Tentar salvar no banco se estiver autenticado
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            const { error } = await supabase
              .from('user_settings')
              .upsert({
                user_id: session.user.id,
                theme,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              })

            if (error) throw error
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
          // Tentar carregar preferências do banco se estiver autenticado
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) {
            const theme = 'dark'
            set({ theme })
            updateThemeClass(theme)
            return
          }

          const { data, error } = await supabase
            .from('user_settings')
            .select('theme, density')
            .eq('user_id', session.user.id)
            .single()

          if (error && error.code !== 'PGRST116') throw error

          // Se não houver dados ou tema não definido, usar dark
          const theme = (data?.theme as 'light' | 'dark') || 'dark'
          const density = data?.density as 'compact' | 'comfortable' | 'spacious' || 'comfortable'

          set({ theme, density })
          updateThemeClass(theme)

          // Se não houver dados, criar com tema dark
          if (!data) {
            await supabase
              .from('user_settings')
              .insert({
                user_id: session.user.id,
                theme: 'dark',
                density: 'comfortable',
                updated_at: new Date().toISOString()
              })
          }
        } catch (error) {
          console.error('Erro ao sincronizar preferências:', error)
          // Em caso de erro, garantir tema dark
          const theme = 'dark'
          set({ theme })
          updateThemeClass(theme)
        }
      }
    }),
    {
      name: 'preferences',
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            const theme = state.theme || 'dark'
            updateThemeClass(theme)
            if (theme !== state.theme) {
              state.theme = theme
            }
          }
        }
      }
    }
  )
) 