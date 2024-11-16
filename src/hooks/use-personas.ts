'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Persona } from '@/types/product'

export function usePersonas(productId?: string) {
  const queryClient = useQueryClient()

  const query = useQuery<Persona[]>({
    queryKey: ['personas', productId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(persona => ({
        ...persona,
        characteristics: persona.characteristics || [],
        painPoints: persona.pain_points || [],
        goals: persona.goals || [],
        createdAt: new Date(persona.created_at),
        updatedAt: new Date(persona.updated_at)
      }))
    },
    enabled: !!productId
  })

  const createPersona = useMutation({
    mutationFn: async (newPersona: Omit<Persona, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('personas')
        .insert({
          name: newPersona.name,
          description: newPersona.description,
          characteristics: newPersona.characteristics,
          pain_points: newPersona.painPoints,
          goals: newPersona.goals,
          product_id: productId
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas', productId] })
    }
  })

  const updatePersona = useMutation({
    mutationFn: async (persona: Persona) => {
      const { data, error } = await supabase
        .from('personas')
        .update({
          name: persona.name,
          description: persona.description,
          characteristics: persona.characteristics,
          pain_points: persona.painPoints,
          goals: persona.goals
        })
        .eq('id', persona.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas', productId] })
    }
  })

  const deletePersona = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas', productId] })
    }
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createPersona,
    updatePersona,
    deletePersona
  }
} 