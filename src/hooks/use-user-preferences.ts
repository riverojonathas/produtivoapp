'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface UseUserPreferencesReturn<T> {
  preferences: T | null
  isLoading: boolean
  updatePreferences: (newPreferences: T) => Promise<void>
}

interface UserSettings {
  id?: string
  user_id: string
  settings: Record<string, unknown>
  created_at?: string
  updated_at?: string
}

export function useUserPreferences<T>(
  type: string,
  defaultValue: T
): UseUserPreferencesReturn<T> {
  const [preferences, setPreferences] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')

        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        if (!data) {
          // Criar configurações iniciais
          const initialSettings: UserSettings = {
            user_id: user.id,
            settings: { [type]: defaultValue }
          }

          const { error: insertError } = await supabase
            .from('user_settings')
            .insert(initialSettings)

          if (insertError) throw insertError

          setPreferences(defaultValue)
        } else {
          // Usar configurações existentes ou valor padrão
          const settings = data.settings || {}
          setPreferences(settings[type] || defaultValue)

          // Se não existir configuração para este tipo, atualizar com o valor padrão
          if (!settings[type]) {
            const { error: updateError } = await supabase
              .from('user_settings')
              .update({
                settings: { ...settings, [type]: defaultValue }
              })
              .eq('user_id', user.id)

            if (updateError) throw updateError
          }
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error)
        setPreferences(defaultValue)
      } finally {
        setIsLoading(false)
      }
    }

    loadPreferences()
  }, [type, defaultValue, supabase])

  const updatePreferences = async (newPreferences: T) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Buscar configurações atuais
      const { data: currentData } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single()

      // Preparar dados para atualização
      const updatedSettings = {
        user_id: user.id,
        settings: {
          ...(currentData?.settings || {}),
          [type]: newPreferences
        },
        updated_at: new Date().toISOString()
      }

      // Atualizar ou inserir configurações
      const { error } = await supabase
        .from('user_settings')
        .upsert(updatedSettings, {
          onConflict: 'user_id'
        })

      if (error) {
        console.error('Erro detalhado:', error)
        throw error
      }

      setPreferences(newPreferences)
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error)
      throw error
    }
  }

  return {
    preferences,
    isLoading,
    updatePreferences
  }
} 