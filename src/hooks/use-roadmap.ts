'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Feature, UserStory } from '@/types/product'

export function useRoadmap(productId?: string) {
  const queryClient = useQueryClient()

  // Buscar features
  const query = useQuery<Feature[]>({
    queryKey: ['roadmap', productId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Buscar features
      const { data: features, error: featuresError } = await supabase
        .from('features')
        .select(`
          *,
          stories:stories(*)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (featuresError) throw featuresError

      // Transformar dados do banco para o formato da aplicação
      return features.map(feature => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        status: feature.status,
        priority: feature.priority,
        startDate: new Date(feature.start_date),
        endDate: new Date(feature.end_date),
        dependencies: feature.dependencies,
        assignees: feature.assignees,
        tags: feature.tags,
        stories: feature.stories.map((story: any) => ({
          id: story.id,
          featureId: story.feature_id,
          title: story.title,
          description: story.description,
          acceptanceCriteria: story.acceptance_criteria,
          status: story.status,
          points: story.points,
          assignees: story.assignees,
          createdAt: new Date(story.created_at),
          updatedAt: new Date(story.updated_at)
        })),
        createdAt: new Date(feature.created_at),
        updatedAt: new Date(feature.updated_at)
      }))
    },
    enabled: !!productId
  })

  // Criar feature
  const createFeature = useMutation({
    mutationFn: async (newFeature: Omit<Feature, 'id'>) => {
      const { data, error } = await supabase
        .from('features')
        .insert({
          product_id: productId,
          title: newFeature.title,
          description: newFeature.description,
          status: newFeature.status,
          priority: newFeature.priority,
          start_date: newFeature.startDate.toISOString(),
          end_date: newFeature.endDate.toISOString(),
          dependencies: newFeature.dependencies,
          assignees: newFeature.assignees,
          tags: newFeature.tags
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  // Atualizar feature
  const updateFeature = useMutation({
    mutationFn: async (updatedFeature: Feature) => {
      const { data, error } = await supabase
        .from('features')
        .update({
          title: updatedFeature.title,
          description: updatedFeature.description,
          status: updatedFeature.status,
          priority: updatedFeature.priority,
          start_date: updatedFeature.startDate.toISOString(),
          end_date: updatedFeature.endDate.toISOString(),
          dependencies: updatedFeature.dependencies,
          assignees: updatedFeature.assignees,
          tags: updatedFeature.tags
        })
        .eq('id', updatedFeature.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  // Atualizar status da feature
  const updateFeatureStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Feature['status'] }) => {
      const { data, error } = await supabase
        .from('features')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  // Deletar feature
  const deleteFeature = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  // Criar story
  const createStory = useMutation({
    mutationFn: async (data: Omit<UserStory, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data: story, error } = await supabase
        .from('stories')
        .insert({
          feature_id: data.featureId,
          title: data.title,
          description: data.description,
          acceptance_criteria: data.acceptanceCriteria,
          status: data.status,
          points: data.points,
          assignees: data.assignees
        })
        .select()
        .single()

      if (error) throw error
      return story
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  // Atualizar story
  const updateStory = useMutation({
    mutationFn: async (data: UserStory) => {
      const { data: story, error } = await supabase
        .from('stories')
        .update({
          title: data.title,
          description: data.description,
          acceptance_criteria: data.acceptanceCriteria,
          status: data.status,
          points: data.points,
          assignees: data.assignees
        })
        .eq('id', data.id)
        .select()
        .single()

      if (error) throw error
      return story
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  // Atualizar status da story
  const updateStoryStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: StoryStatus }) => {
      const { data, error } = await supabase
        .from('stories')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  // Deletar story
  const deleteStory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createFeature,
    updateFeature,
    updateFeatureStatus,
    deleteFeature,
    createStory,
    updateStory,
    updateStoryStatus,
    deleteStory
  }
} 