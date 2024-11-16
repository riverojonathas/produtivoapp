'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Feature, UserStory } from '@/types/product'

interface CreateFeatureInput {
  title: string
  description: {
    what: string
    why: string
    how: string
    who: string
  }
  status: Feature['status']
  priority: Feature['priority']
  start_date: string | null
  end_date: string | null
  product_id: string
  dependencies: string[]
  assignees: string[]
  tags: string[]
}

export function useRoadmap(productId?: string) {
  const queryClient = useQueryClient()

  // Função auxiliar para determinar o status da feature baseado nas histórias
  const determineFeatureStatus = (stories: UserStory[] | undefined, currentStatus: Feature['status']) => {
    if (!stories || stories.length === 0) return currentStatus

    const totalStories = stories.length
    const completedStories = stories.filter(s => s.status === 'completed').length
    const hasBlockedStories = stories.some(s => s.status === 'blocked')
    const hasInProgressStories = stories.some(s => s.status === 'in-progress')

    if (completedStories === totalStories) {
      return 'completed' as Feature['status']
    } else if (currentStatus === 'completed') {
      // Se era completed e não é mais 100%, volta para planned
      return 'planned' as Feature['status']
    } else if (hasBlockedStories) {
      return 'blocked' as Feature['status']
    } else if (hasInProgressStories) {
      return 'in-progress' as Feature['status']
    }

    return currentStatus
  }

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
    mutationFn: async (data: CreateFeatureInput) => {
      // Primeiro, obter o usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) throw new Error('Usuário não autenticado')

      // Log para debug
      console.log('Dados enviados:', { ...data, owner_id: user.id })

      // Criar feature
      const { data: feature, error: featureError } = await supabase
        .from('features')
        .insert([{
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          start_date: data.start_date,
          end_date: data.end_date,
          product_id: data.product_id,
          owner_id: user.id,
          dependencies: data.dependencies || [],
          assignees: data.assignees || [],
          tags: data.tags || []
        }])
        .select('*')
        .single()

      if (featureError) {
        console.error('Erro ao criar feature:', featureError)
        throw new Error(featureError.message)
      }

      return feature
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    }
  })

  // Atualizar feature com histórias
  const updateFeature = useMutation({
    mutationFn: async (updatedFeature: Feature) => {
      // Determinar novo status baseado nas histórias
      const newStatus = determineFeatureStatus(updatedFeature.stories, updatedFeature.status)

      // Log para debug
      console.log('Atualizando feature:', {
        ...updatedFeature,
        status: newStatus
      })

      // Atualizar feature com novo status
      const { data: feature, error: featureError } = await supabase
        .from('features')
        .update({
          title: updatedFeature.title,
          description: updatedFeature.description,
          status: newStatus, // Usar novo status
          priority: updatedFeature.priority,
          start_date: updatedFeature.startDate,
          end_date: updatedFeature.endDate,
          dependencies: updatedFeature.dependencies,
          assignees: updatedFeature.assignees,
          tags: updatedFeature.tags
        })
        .eq('id', updatedFeature.id)
        .select()
        .single()

      if (featureError) {
        console.error('Erro ao atualizar feature:', featureError)
        throw featureError
      }

      // Se houver histórias, criar/atualizar
      if (updatedFeature.stories?.length) {
        const { error: storiesError } = await supabase
          .from('stories')
          .upsert(
            updatedFeature.stories.map(story => ({
              id: story.id,
              title: story.title,
              description: story.description,
              status: story.status,
              points: story.points,
              feature_id: updatedFeature.id,
              acceptance_criteria: story.acceptanceCriteria,
              assignees: story.assignees,
              created_at: story.createdAt,
              updated_at: new Date()
            }))
          )

        if (storiesError) {
          console.error('Erro ao atualizar histórias:', storiesError)
          throw storiesError
        }
      }

      return feature
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
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
      // Log para debug
      console.log('Criando história:', data)

      // Primeiro, obter a feature para atualizar suas histórias
      const { data: feature, error: featureError } = await supabase
        .from('features')
        .select('stories')
        .eq('id', data.featureId)
        .single()

      if (featureError) {
        console.error('Erro ao buscar feature:', featureError)
        throw featureError
      }

      // Criar nova história
      const newStory = {
        id: crypto.randomUUID(),
        feature_id: data.featureId,
        title: data.title,
        description: data.description,
        acceptance_criteria: data.acceptanceCriteria || [],
        status: data.status || 'open',
        points: data.points || 1,
        assignees: data.assignees || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Atualizar feature com a nova história
      const { error: updateError } = await supabase
        .from('features')
        .update({
          stories: [...(feature.stories || []), newStory]
        })
        .eq('id', data.featureId)

      if (updateError) {
        console.error('Erro ao atualizar feature com nova história:', updateError)
        throw updateError
      }

      return newStory
    },
    onSuccess: () => {
      // Invalidar queries para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ['features'] })
      queryClient.invalidateQueries({ queryKey: ['roadmap', productId] })
    },
    onError: (error) => {
      console.error('Erro na mutation createStory:', error)
      throw error
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