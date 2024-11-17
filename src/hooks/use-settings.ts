'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const ACCENT_COLORS = {
  blue: {
    value: 'blue',
    label: 'Azul',
    primary: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB'
  },
  purple: {
    value: 'purple',
    label: 'Roxo',
    primary: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED'
  },
  green: {
    value: 'green',
    label: 'Verde',
    primary: '#10B981',
    light: '#34D399',
    dark: '#059669'
  },
  orange: {
    value: 'orange',
    label: 'Laranja',
    primary: '#F97316',
    light: '#FB923C',
    dark: '#EA580C'
  }
} as const

type AccentColor = keyof typeof ACCENT_COLORS
type Density = 'comfortable' | 'compact'

interface UserSettings {
  id: string
  accent_color: AccentColor
  density: Density
  theme: 'light' | 'dark' | 'system'
}

export function useSettings() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Criar configurações padrão se não existirem
          const defaultSettings = {
            id: session.user.id,
            accent_color: 'blue' as AccentColor,
            density: 'comfortable' as Density,
            theme: 'system' as const
          }

          const { data: newSettings, error: createError } = await supabase
            .from('user_settings')
            .insert([defaultSettings])
            .select()
            .single()

          if (createError) throw createError
          return newSettings
        }
        throw error
      }

      return data
    }
  })

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Usuário não autenticado')
      }

      const { error } = await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('id', session.user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    }
  })

  const setAccentColor = async (color: AccentColor) => {
    try {
      await updateSettings.mutateAsync({ accent_color: color })
      // Disparar evento para atualizar as cores em toda a aplicação
      window.dispatchEvent(new CustomEvent('accent-color-change', { detail: color }))
    } catch (error) {
      console.error('Erro ao salvar cor de destaque:', error instanceof Error ? error.message : 'Erro desconhecido')
      throw error
    }
  }

  const setDensity = (density: Density) => {
    updateSettings.mutate({ density })
  }

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    updateSettings.mutate({ theme })
  }

  return {
    settings,
    isLoading,
    accentColor: settings?.accent_color || 'blue',
    density: settings?.density || 'comfortable',
    theme: settings?.theme || 'system',
    setAccentColor,
    setDensity,
    setTheme
  }
} 