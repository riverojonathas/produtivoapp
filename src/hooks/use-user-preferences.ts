'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface UseUserPreferencesReturn<T> {
  preferences: T | null
  isLoading: boolean
  updatePreferences: (newPreferences: T) => Promise<void>
}

export function useUserPreferences<T>(
  key: string,
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

        if (error) {
          console.error('Erro ao carregar preferências:', error)
          throw error
        }

        if (!data) {
          // Criar configurações iniciais
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              density: 'comfortable',
              language: 'pt-BR',
              timezone: 'America/Sao_Paulo',
              theme: 'light',
              accent_color: 'blue',
              sidebar_collapsed: false,
              notifications_enabled: true,
              email_notifications: true,
              date_format: 'dd/MM/yyyy',
              start_page: '/dashboard',
              items_per_page: 10,
              settings: {
                [key]: defaultValue
              }
            })

          if (insertError) throw insertError

          setPreferences(defaultValue)
        } else {
          // Usar configurações existentes ou valor padrão
          const settings = data.settings || {}
          setPreferences(settings[key] || defaultValue)

          // Se não existir configuração para esta chave, atualizar com o valor padrão
          if (!settings[key]) {
            const { error: updateError } = await supabase
              .from('user_settings')
              .update({
                settings: { ...settings, [key]: defaultValue }
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
  }, [key, defaultValue, supabase])

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
        settings: {
          ...(currentData?.settings || {}),
          [key]: newPreferences
        }
      }

      // Atualizar configurações
      const { error } = await supabase
        .from('user_settings')
        .update(updatedSettings)
        .eq('user_id', user.id)

      if (error) throw error

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