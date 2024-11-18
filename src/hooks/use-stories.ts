'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface Story {
  id: string
  feature_id: string
  title: string
  description: {
    asA: string      // Persona/Usuário
    iWant: string    // Ação desejada
    soThat: string   // Benefício esperado
  }
  acceptance_criteria: string[]
  status: 'open' | 'in-progress' | 'completed' | 'blocked'
  points: number
  assignees: string[]
  created_at: string
  updated_at: string
  owner_id: string
}

interface CreateStoryInput {
  title: string
  description: {
    asA: string
    iWant: string
    soThat: string
  }
  acceptance_criteria: string[]
  status: Story['status']
  points: number
  feature_id: string
  assignees?: string[]
  owner_id?: string | null
}

export function useStories(storyId?: string) {
  const queryClient = useQueryClient()

  const query = useQuery<Story[]>({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          feature:features (
            id,
            title,
            status
          )
        `)
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    }
  })

  const createStory = useMutation({
    mutationFn: async (input: CreateStoryInput) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Usuário não autenticado')
        }

        const storyData = {
          ...input,
          owner_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('stories')
          .insert(storyData)
          .select()
          .single()

        if (error) throw error

        return data
      } catch (error) {
        console.error('Erro ao criar história:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
      toast.success('História criada com sucesso')
    }
  })

  const updateStory = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Story> }) => {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      }

      const { data: updatedStory, error } = await supabase
        .from('stories')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updatedStory
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
      toast.success('História atualizada com sucesso')
    }
  })

  const deleteStory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
      toast.success('História excluída com sucesso')
    }
  })

  const getStory = useQuery({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          feature:features (
            id,
            title,
            status
          )
        `)
        .eq('id', storyId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!storyId
  })

  return {
    stories: query.data,
    story: getStory.data,
    isLoading: query.isLoading || (!!storyId && getStory.isLoading),
    error: query.error || getStory.error,
    createStory,
    updateStory,
    deleteStory
  }
} 