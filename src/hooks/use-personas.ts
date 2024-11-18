'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Persona } from '@/types/product'

interface CreatePersonaInput {
  name: string
  description: string
  characteristics: string[]
  pain_points: string[]
  goals: string[]
  product_id?: string | null
  owner_id: string | null
}

export function usePersonas(personaId?: string) {
  const queryClient = useQueryClient()

  const query = useQuery<Persona[]>({
    queryKey: ['personas'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('personas')
        .select(`
          *,
          product:products (
            id,
            name,
            status
          )
        `)
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    }
  })

  const createPersona = useMutation({
    mutationFn: async (input: CreatePersonaInput) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Usuário não autenticado')
        }

        const personaData = {
          name: input.name.trim(),
          description: input.description?.trim() || '',
          characteristics: input.characteristics || [],
          pain_points: input.pain_points || [],
          goals: input.goals || [],
          product_id: input.product_id || null,
          owner_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('personas')
          .insert(personaData)
          .select(`
            *,
            product:products (
              id,
              name,
              status
            )
          `)
          .single()

        if (error) {
          console.error('Erro do Supabase:', error)
          throw new Error(error.message)
        }

        if (!data) {
          throw new Error('Persona não foi criada')
        }

        return data
      } catch (error) {
        console.error('Erro completo:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
      toast.success('Persona criada com sucesso')
    },
    onError: (error) => {
      console.error('Erro na mutação:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar persona')
    }
  })

  const updatePersona = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Persona> }) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        const updateData = {
          ...data,
          updated_at: new Date().toISOString()
        }

        const { data: updatedPersona, error } = await supabase
          .from('personas')
          .update(updateData)
          .eq('id', id)
          .select(`
            *,
            product:products (
              id,
              name,
              status
            )
          `)
          .single()

        if (error) throw error

        return updatedPersona
      } catch (error) {
        console.error('Erro ao atualizar persona:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] })
      toast.success('Persona atualizada com sucesso')
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
      queryClient.invalidateQueries({ queryKey: ['personas'] })
      toast.success('Persona excluída com sucesso')
    },
    onError: (error) => {
      console.error('Erro ao excluir persona:', error)
      toast.error('Erro ao excluir persona')
    }
  })

  const getPersona = useQuery({
    queryKey: ['persona', personaId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('personas')
        .select(`
          *,
          product:products (
            id,
            name,
            status
          )
        `)
        .eq('id', personaId)
        .single()

      if (error) throw error

      return data
    },
    enabled: !!personaId
  })

  return {
    personas: query.data,
    persona: getPersona.data,
    isLoading: query.isLoading || (!!personaId && getPersona.isLoading),
    error: query.error || getPersona.error,
    createPersona,
    updatePersona,
    deletePersona
  }
} 