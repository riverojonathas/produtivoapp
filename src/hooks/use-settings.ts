'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type Density = 'comfortable' | 'compact'
export type Language = 'pt-BR' | 'en-US' | 'es-ES'
export type TimeZone = string
export type AccentColor = 'green' | 'blue' | 'purple' | 'pink' | 'orange' | 'red' | 'indigo'

interface Settings {
  density: Density
  language: Language
  timezone: TimeZone
  accentColor: AccentColor
  setDensity: (newDensity: Density) => Promise<void>
  setLanguage: (language: Language) => Promise<void>
  setTimezone: (timezone: TimeZone) => Promise<void>
  setAccentColor: (color: AccentColor) => Promise<void>
  loadSettings: () => Promise<void>
}

export const ACCENT_COLORS: Record<AccentColor, { value: string, label: string, primary: string, light: string, dark: string }> = {
  green: {
    value: 'green',
    label: 'Verde',
    primary: '#10B981',
    light: '#D1FAE5',
    dark: '#059669'
  },
  blue: {
    value: 'blue',
    label: 'Azul',
    primary: '#3B82F6',
    light: '#DBEAFE',
    dark: '#2563EB'
  },
  purple: {
    value: 'purple',
    label: 'Roxo',
    primary: '#8B5CF6',
    light: '#EDE9FE',
    dark: '#7C3AED'
  },
  pink: {
    value: 'pink',
    label: 'Rosa',
    primary: '#EC4899',
    light: '#FCE7F3',
    dark: '#DB2777'
  },
  orange: {
    value: 'orange',
    label: 'Laranja',
    primary: '#F97316',
    light: '#FFEDD5',
    dark: '#EA580C'
  },
  red: {
    value: 'red',
    label: 'Vermelho',
    primary: '#EF4444',
    light: '#FEE2E2',
    dark: '#DC2626'
  },
  indigo: {
    value: 'indigo',
    label: 'Índigo',
    primary: '#6366F1',
    light: '#E0E7FF',
    dark: '#4F46E5'
  }
}

export const useSettings = create<Settings>()(
  persist(
    (set, get) => ({
      density: 'comfortable',
      language: 'pt-BR',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      accentColor: 'green',

      setDensity: async (newDensity: Density) => {
        const supabase = createClientComponentClient()
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) throw new Error('Usuário não encontrado')

          // Primeiro, verificar se já existe um registro
          const { data: existingSettings } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

          let error

          if (existingSettings) {
            // Se existe, atualiza
            const { error: updateError } = await supabase
              .from('user_settings')
              .update({ 
                density: newDensity,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', user.id)
            error = updateError
          } else {
            // Se não existe, insere
            const { error: insertError } = await supabase
              .from('user_settings')
              .insert([{ 
                user_id: user.id,
                density: newDensity,
                language: 'pt-BR', // valores padrão
                accent_color: 'green',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                updated_at: new Date().toISOString()
              }])
            error = insertError
          }

          if (error) {
            console.error('Erro do Supabase:', error)
            throw error
          }
          
          // Atualizar o estado
          set({ density: newDensity })
          
          // Aplicar densidade ao documento
          document.documentElement.setAttribute('data-density', newDensity)
          
          // Forçar recálculo do layout
          requestAnimationFrame(() => {
            document.documentElement.style.display = 'none'
            document.documentElement.offsetHeight // Força um reflow
            document.documentElement.style.display = ''
          })
        } catch (error: any) {
          console.error('Erro ao salvar densidade:', error.message || error)
          throw error
        }
      },

      setLanguage: async (language: Language) => {
        const supabase = createClientComponentClient()
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) throw new Error('Usuário não encontrado')

          const { error } = await supabase
            .from('user_settings')
            .upsert({ 
              user_id: user.id,
              language,
              updated_at: new Date().toISOString()
            })

          if (error) throw error
          set({ language })
          
          // Aplicar idioma ao documento
          document.documentElement.setAttribute('lang', language)
        } catch (error) {
          console.error('Erro ao salvar idioma:', error)
        }
      },

      setTimezone: async (timezone: TimeZone) => {
        const supabase = createClientComponentClient()
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) throw new Error('Usuário não encontrado')

          const { error } = await supabase
            .from('user_settings')
            .upsert({ 
              user_id: user.id,
              timezone,
              updated_at: new Date().toISOString()
            })

          if (error) throw error
          set({ timezone })
        } catch (error) {
          console.error('Erro ao salvar fuso horário:', error)
        }
      },

      setAccentColor: async (color: AccentColor) => {
        const supabase = createClientComponentClient()
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) throw new Error('Usuário não encontrado')

          // Primeiro, verificar se já existe um registro
          const { data: existingSettings } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

          const updateData = {
            user_id: user.id,
            accent_color: color,
            updated_at: new Date().toISOString()
          }

          let error

          if (existingSettings) {
            // Se existe, atualiza
            const { error: updateError } = await supabase
              .from('user_settings')
              .update(updateData)
              .eq('user_id', user.id)
            error = updateError
          } else {
            // Se não existe, insere
            const { error: insertError } = await supabase
              .from('user_settings')
              .insert([{ 
                ...updateData,
                density: 'comfortable', // valores padrão
                language: 'pt-BR',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              }])
            error = insertError
          }

          if (error) {
            console.error('Erro do Supabase:', error)
            throw error
          }
          
          set({ accentColor: color })
          
          // Aplicar cor ao documento e forçar atualização do CSS
          const colors = ACCENT_COLORS[color]
          const root = document.documentElement
          root.style.setProperty('--color-primary', colors.primary)
          root.style.setProperty('--color-primary-light', colors.light)
          root.style.setProperty('--color-primary-dark', colors.dark)
          root.style.setProperty('--color-primary-subtle', `${colors.primary}15`) // 15% de opacidade
          
          // Forçar recálculo do CSS
          void root.offsetHeight
          
          // Disparar evento customizado para notificar mudança de cor
          window.dispatchEvent(new CustomEvent('accent-color-change', { detail: color }))
        } catch (error: any) {
          console.error('Erro ao salvar cor de destaque:', error.message || error)
          throw error
        }
      },

      loadSettings: async () => {
        const supabase = createClientComponentClient()
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          const { data: settings, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (error) throw error

          if (settings) {
            const newSettings = {
              density: settings.density || 'comfortable',
              language: settings.language || 'pt-BR',
              timezone: settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
              accentColor: settings.accent_color || 'green'
            }

            set(newSettings)

            // Aplicar configurações ao documento
            document.documentElement.setAttribute('data-density', newSettings.density)
            document.documentElement.setAttribute('lang', newSettings.language)
            
            // Aplicar cor de destaque
            const colors = ACCENT_COLORS[newSettings.accentColor]
            document.documentElement.style.setProperty('--color-primary', colors.primary)
            document.documentElement.style.setProperty('--color-primary-light', colors.light)
            document.documentElement.style.setProperty('--color-primary-dark', colors.dark)
          }
        } catch (error) {
          console.error('Erro ao carregar configurações:', error)
          throw error
        }
      }
    }),
    {
      name: 'user-settings',
      onRehydrateStorage: () => (state) => {
        if (state) {
          requestAnimationFrame(() => {
            const root = document.documentElement
            root.setAttribute('data-density', state.density)
            root.setAttribute('lang', state.language)
            
            const colors = ACCENT_COLORS[state.accentColor]
            root.style.setProperty('--color-primary', colors.primary)
            root.style.setProperty('--color-primary-light', colors.light)
            root.style.setProperty('--color-primary-dark', colors.dark)
            root.style.setProperty('--color-primary-subtle', `${colors.primary}15`)
            
            // Forçar recálculo do CSS
            void root.offsetHeight
          })
        }
      }
    }
  )
) 