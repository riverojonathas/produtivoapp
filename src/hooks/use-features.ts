'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Feature } from '@/types/product'

interface CreateFeatureInput {
  title: string
  description: {
    what: string
    why: string
    how: string
    who: string
  }
  status: 'backlog' | 'doing' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  start_date?: string | null
  end_date?: string | null
  product_id: string
  owner_id?: string | null
  dependencies?: string[]
  assignees?: string[]
  tags?: string[]
  progress?: number
}

export function useFeatures(featureId?: string) {
  const queryClient = useQueryClient()

  // Query para listar features
  const query = useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        const { data, error } = await supabase
          .from('features')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erro ao listar features:', error)
          throw error
        }

        return data || []
      } catch (error) {
        console.error('Erro na query:', error)
        throw error
      }
    }
  })

  // Mutation para criar feature
  const createFeature = useMutation({
    mutationFn: async (input: CreateFeatureInput) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Usuário não autenticado')
        }

        // Validações
        if (!input.title?.trim()) {
          throw new Error('Título é obrigatório')
        }

        if (!input.product_id) {
          throw new Error('ID do produto é obrigatório')
        }

        // Preparar dados
        const featureData = {
          title: input.title.trim(),
          description: input.description,
          status: input.status,
          priority: input.priority,
          start_date: input.start_date || null,
          end_date: input.end_date || null,
          product_id: input.product_id,
          owner_id: session.user.id,
          dependencies: input.dependencies || [],
          assignees: input.assignees || [],
          tags: input.tags || [],
          progress: input.progress || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('Dados para inserção:', featureData)

        // Inserir feature
        const { data, error } = await supabase
          .from('features')
          .insert([featureData])
          .select()
          .single()

        if (error) {
          console.error('Erro do Supabase:', error)
          throw new Error(error.message)
        }

        if (!data) {
          throw new Error('Feature não foi criada')
        }

        return data
      } catch (error) {
        console.error('Erro ao criar feature:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
      toast.success('Feature criada com sucesso')
    },
    onError: (error: Error) => {
      console.error('Erro na mutação:', error)
      toast.error(error.message || 'Erro ao criar feature')
    }
  })

  // Query para buscar uma feature específica
  const getFeature = useQuery({
    queryKey: ['feature', featureId],
    queryFn: async () => {
      if (!featureId) return null

      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('id', featureId)
        .single()

      if (error) {
        console.error('Erro ao buscar feature:', error)
        throw error
      }

      return data
    },
    enabled: !!featureId
  })

  // Mutation para atualizar feature
  const updateFeature = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Feature> }) => {
      const { data: updatedFeature, error } = await supabase
        .from('features')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updatedFeature
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
      toast.success('Feature atualizada com sucesso')
    }
  })

  // Mutation para excluir feature
  const deleteFeature = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
      toast.success('Feature excluída com sucesso')
    }
  })

  return {
    features: query.data,
    feature: getFeature.data,
    isLoading: query.isLoading || (!!featureId && getFeature.isLoading),
    error: query.error || getFeature.error,
    createFeature,
    updateFeature,
    deleteFeature
  }
} 