'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Feature } from '@/types/product'

interface CreateStoryInput {
  feature_id: string
  title: string
  description: {
    asA: string
    iWant: string
    soThat: string
  }
  acceptance_criteria: string[]
  status: 'open' | 'in-progress' | 'completed' | 'blocked'
  points: number
  assignees: string[]
}

export function useRoadmap(productId?: string) {
  const queryClient = useQueryClient()

  // Query para buscar features
  const query = useQuery<Feature[]>({
    queryKey: ['features', productId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data: features, error } = await supabase
        .from('features')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return features || []
    },
    enabled: !!productId
  })

  // Query para buscar features do roadmap (apenas com datas)
  const roadmapQuery = useQuery<Feature[]>({
    queryKey: ['roadmap', productId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data: features, error } = await supabase
        .from('features')
        .select('*')
        .eq('product_id', productId)
        .not('start_date', 'is', null)
        .not('end_date', 'is', null)
        .order('start_date', { ascending: true })

      if (error) throw error

      return features || []
    },
    enabled: !!productId
  })

  const createFeature = useMutation({
    mutationFn: async (data: CreateFeatureInput) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        const newFeature = {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          start_date: data.start_date || null,
          end_date: data.end_date || null,
          product_id: data.product_id,
          owner_id: session.user.id,
          dependencies: data.dependencies || [],
          assignees: data.assignees || [],
          tags: data.tags || []
        }

        const { data: feature, error } = await supabase
          .from('features')
          .insert([newFeature])
          .select()
          .single()

        if (error) {
          console.error('Erro ao criar feature:', error)
          throw new Error(error.message)
        }

        return feature
      } catch (error) {
        console.error('Erro detalhado:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', productId] })
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  const createStory = useMutation({
    mutationFn: async (data: CreateStoryInput) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        const newStory = {
          feature_id: data.feature_id,
          title: data.title,
          description: data.description,
          acceptance_criteria: data.acceptance_criteria || [],
          status: data.status || 'open',
          points: data.points || 1,
          assignees: data.assignees || [],
          owner_id: session.user.id
        }

        const { data: story, error } = await supabase
          .from('stories')
          .insert([newStory])
          .select()
          .single()

        if (error) {
          console.error('Erro do Supabase:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          throw new Error(`Erro ao criar história: ${error.message}`)
        }

        return story
      } catch (error) {
        console.error('Erro detalhado:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', productId] })
    }
  })

  const updateFeatureStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Feature['status'] }) => {
      const { error } = await supabase
        .from('features')
        .update({ status })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', productId] })
    }
  })

  return {
    features: query.data || [],
    roadmapFeatures: roadmapQuery.data || [],
    isLoading: query.isLoading || roadmapQuery.isLoading,
    error: query.error || roadmapQuery.error,
    createFeature,
    createStory,
    updateFeatureStatus
  }
} 