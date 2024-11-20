'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface Persona {
  id: string
  name: string
  description: string
  characteristics: string[]
  pain_points: string[]
  goals: string[]
  product_id: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

interface UpdatePersonaParams {
  id: string
  data: Partial<Persona>
}

export function usePersonas() {
  const queryClient = useQueryClient()

  // Buscar personas
  const { data: personas = [], isLoading } = useQuery({
    queryKey: ['personas'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')

        const { data, error } = await supabase
          .from('personas')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
      } catch (error) {
        console.error('Erro ao carregar personas:', error)
        return []
      }
    },
    retry: false
  })

  // Criar persona
  const createPersona = useMutation({
    mutationFn: async (data: Partial<Persona>) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Garantir que owner_id seja preenchido
      const personaData = {
        name: data.name || '',
        description: data.description || '',
        characteristics: data.characteristics || [],
        pain_points: data.pain_points || [],
        goals: data.goals || [],
        product_id: data.product_id || null,
        owner_id: user.id, // Sempre incluir owner_id
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: newPersona, error } = await supabase
        .from('personas')
        .insert([personaData])
        .select()
        .single()

      if (error) throw error
      return newPersona
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
    }
  })

  // Atualizar persona
  const updatePersona = useMutation({
    mutationFn: async ({ id, data }: UpdatePersonaParams) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Não permitir alteração do owner_id
      const { owner_id, ...updateData } = data
      
      const { data: updatedPersona, error } = await supabase
        .from('personas')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('owner_id', user.id)
        .select()
        .single()

      if (error) throw error
      return updatedPersona
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
    }
  })

  // Deletar persona
  const deletePersona = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('personas')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
    }
  })

  return {
    personas,
    isLoading,
    createPersona,
    updatePersona,
    deletePersona
  }
} 