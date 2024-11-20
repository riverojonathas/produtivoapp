'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IStoryTemplate } from '@/types/story-template'

interface UseStoryTemplatesReturn {
  templates: IStoryTemplate[]
  template?: IStoryTemplate
  isLoading: boolean
  createTemplate: {
    mutateAsync: (data: Partial<IStoryTemplate>) => Promise<IStoryTemplate>
    isPending: boolean
  }
  updateTemplate: {
    mutateAsync: (params: { id: string, data: Partial<IStoryTemplate> }) => Promise<IStoryTemplate>
    isPending: boolean
  }
  deleteTemplate: {
    mutateAsync: (id: string) => Promise<void>
    isPending: boolean
  }
  refresh: () => Promise<void>
}

export function useStoryTemplates(id?: string): UseStoryTemplatesReturn {
  const [templates, setTemplates] = useState<IStoryTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const supabase = createClientComponentClient()

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('story_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro detalhado:', error)
        throw error
      }

      setTemplates(data || [])
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  const createTemplate = {
    mutateAsync: async (data: Partial<IStoryTemplate>) => {
      setIsPending(true)
      try {
        const templateData = {
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data: newTemplate, error } = await supabase
          .from('story_templates')
          .insert([templateData])
          .select('*')
          .single()

        if (error) {
          console.error('Erro detalhado:', error)
          throw error
        }

        setTemplates(prev => [newTemplate, ...prev])
        return newTemplate
      } catch (error) {
        console.error('Erro ao criar template:', error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const updateTemplate = {
    mutateAsync: async ({ id, data }: { id: string, data: Partial<IStoryTemplate> }) => {
      setIsPending(true)
      try {
        const updateData = {
          ...data,
          updated_at: new Date().toISOString()
        }

        const { data: updatedTemplate, error } = await supabase
          .from('story_templates')
          .update(updateData)
          .eq('id', id)
          .select('*')
          .single()

        if (error) {
          console.error('Erro detalhado:', error)
          throw error
        }

        setTemplates(prev => prev.map(t => 
          t.id === id ? updatedTemplate : t
        ))

        return updatedTemplate
      } catch (error) {
        console.error('Erro ao atualizar template:', error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const deleteTemplate = {
    mutateAsync: async (id: string) => {
      setIsPending(true)
      try {
        const { error } = await supabase
          .from('story_templates')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Erro detalhado:', error)
          throw error
        }

        setTemplates(prev => prev.filter(t => t.id !== id))
      } catch (error) {
        console.error('Erro ao excluir template:', error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const template = id ? templates.find(t => t.id === id) : undefined

  return {
    templates,
    template,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refresh: loadTemplates
  }
} 