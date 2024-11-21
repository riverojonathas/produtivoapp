'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IUserStory } from '@/types/story'

interface UseStoriesReturn {
  stories: IUserStory[]
  story?: IUserStory
  isLoading: boolean
  createStory: {
    mutateAsync: (data: Partial<IUserStory>) => Promise<IUserStory>
    isPending: boolean
  }
  updateStory: {
    mutateAsync: (params: { id: string, data: Partial<IUserStory> }) => Promise<IUserStory>
    isPending: boolean
  }
  deleteStory: {
    mutateAsync: (id: string) => Promise<void>
    isPending: boolean
  }
  refresh: () => Promise<void>
}

export function useStories(id?: string): UseStoriesReturn {
  const [stories, setStories] = useState<IUserStory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const supabase = createClientComponentClient()

  const loadStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          feature:features (
            id,
            title
          ),
          story_relationships!story_relationships_story_id_fkey (
            related_story:stories!story_relationships_related_story_id_fkey (
              id,
              title,
              status
            ),
            relationship_type
          ),
          related_to:story_relationships!story_relationships_related_story_id_fkey (
            story:stories!story_relationships_story_id_fkey (
              id,
              title,
              status
            ),
            relationship_type
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar histórias:', error)
        throw error
      }

      const transformedData = data?.map(story => ({
        ...story,
        related_stories: [
          ...(story.story_relationships?.map((rel: { 
            related_story: { 
              id: string;
              title: string;
              status: string;
            };
            relationship_type: string;
          }) => ({
            id: rel.related_story.id,
            title: rel.related_story.title, 
            status: rel.related_story.status,
            relationship_type: rel.relationship_type
          })) || []),
          ...(story.related_to?.map((rel: {
            story: {
              id: string;
              title: string;
              status: string;
            };
            relationship_type: string;
          }) => ({
            id: rel.story.id,
            title: rel.story.title,
            status: rel.story.status, 
            relationship_type: rel.relationship_type === 'blocks' ? 'blocked_by' :
              rel.relationship_type === 'blocked_by' ? 'blocks' :
              rel.relationship_type
          })) || [])
        ]
      })) || []

      console.log('Histórias carregadas:', transformedData)
      setStories(transformedData)
    } catch (error) {
      console.error('Erro ao carregar histórias:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStories()
  }, [])

  const createStory = {
    mutateAsync: async (data: Partial<IUserStory>) => {
      setIsPending(true)
      try {
        const storyData = {
          ...data,
          description: {
            asA: data.description?.asA || '',
            iWant: data.description?.iWant || '',
            soThat: data.description?.soThat || ''
          },
          points: data.points || 1,
          status: data.status || 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        console.log('Dados para criação:', storyData)

        const { data: newStory, error } = await supabase
          .from('stories')
          .insert([storyData])
          .select(`
            *,
            feature:features (
              id,
              title
            )
          `)
          .single()

        if (error) {
          console.error('Erro detalhado do Supabase:', error)
          throw new Error(error.message || 'Erro ao criar história')
        }

        if (!newStory) {
          throw new Error('História não foi criada')
        }

        console.log('História criada com sucesso:', newStory)

        setStories(prev => [newStory, ...prev])
        return newStory
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao criar história'
        console.error('Erro completo ao criar história:', error)
        throw new Error(message)
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const updateStory = {
    mutateAsync: async ({ id, data }: { id: string, data: Partial<IUserStory> }) => {
      setIsPending(true)
      try {
        const updateData = {
          ...data,
          updated_at: new Date().toISOString()
        }

        const { data: updatedStory, error } = await supabase
          .from('stories')
          .update(updateData)
          .eq('id', id)
          .select(`
            *,
            feature:features (
              id,
              title
            )
          `)
          .single()

        if (error) {
          console.error('Erro ao atualizar história:', error)
          throw error
        }

        setStories(prev => prev.map(s => 
          s.id === id ? updatedStory : s
        ))

        return updatedStory
      } catch (error) {
        console.error('Erro ao atualizar história:', error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const deleteStory = {
    mutateAsync: async (id: string) => {
      setIsPending(true)
      try {
        const { error } = await supabase
          .from('stories')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Erro ao excluir história:', error)
          throw error
        }

        setStories(prev => prev.filter(s => s.id !== id))
      } catch (error) {
        console.error('Erro ao excluir história:', error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const story = id ? stories.find(s => s.id === id) : undefined

  return {
    stories,
    story,
    isLoading,
    createStory,
    updateStory,
    deleteStory,
    refresh: loadStories
  }
} 