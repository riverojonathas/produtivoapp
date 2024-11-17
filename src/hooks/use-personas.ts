'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Persona } from '@/types/product'

export function usePersonas() {
  const queryClient = useQueryClient()

  const query = useQuery<Persona[]>({
    queryKey: ['personas'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log('Sem sessão ativa')
          return []
        }

        const { data, error } = await supabase
          .from('personas')
          .select(`
            id,
            name,
            description,
            characteristics,
            pain_points,
            goals,
            product_id,
            owner_id,
            created_at,
            updated_at
          `)
          .eq('owner_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erro do Supabase:', {
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          throw new Error(error.message)
        }

        return data || []
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro detalhado:', {
            message: error.message,
            stack: error.stack
          })
        }
        throw error
      }
    }
  })

  const createPersona = useMutation({
    mutationFn: async (data: Partial<Persona>) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        const newPersona = {
          name: data.name,
          description: data.description || '',
          characteristics: data.characteristics || [],
          pain_points: data.pain_points || [],
          goals: data.goals || [],
          product_id: data.product_id || null,
          owner_id: session.user.id
        }

        const { data: persona, error } = await supabase
          .from('personas')
          .insert([newPersona])
          .select()
          .single()

        if (error) {
          console.error('Erro do Supabase:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          throw new Error(`Erro ao criar persona: ${error.message}`)
        }

        return persona
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro detalhado na criação:', {
            message: error.message,
            stack: error.stack
          })
        }
        throw error
      }
    },
    onSuccess: (newPersona) => {
      queryClient.setQueryData<Persona[]>(['personas'], (old = []) => {
        return [newPersona, ...old]
      })
      queryClient.invalidateQueries({ queryKey: ['personas'] })
    }
  })

  return {
    personas: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createPersona
  }
} 