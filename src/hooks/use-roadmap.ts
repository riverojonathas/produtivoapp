'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Feature } from '@/types/product'

interface RoadmapFeature extends Feature {
  start_date: string | null
  end_date: string | null
  progress: number
  dependencies: string[]
}

export function useRoadmap() {
  const queryClient = useQueryClient()

  const query = useQuery<RoadmapFeature[]>({
    queryKey: ['roadmap-features'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('features')
        .select(`
          *,
          product:products (
            id,
            name,
            status
          )
        `)
        .order('start_date', { ascending: true })

      if (error) throw error

      return data || []
    }
  })

  const updateFeatureDate = useMutation({
    mutationFn: async ({ 
      id, 
      start_date, 
      end_date 
    }: { 
      id: string
      start_date?: string | null
      end_date?: string | null
    }) => {
      const { data, error } = await supabase
        .from('features')
        .update({ 
          start_date, 
          end_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-features'] })
      toast.success('Datas atualizadas com sucesso')
    },
    onError: (error) => {
      console.error('Erro ao atualizar datas:', error)
      toast.error('Erro ao atualizar datas')
    }
  })

  const updateFeatureProgress = useMutation({
    mutationFn: async ({ 
      id, 
      progress 
    }: { 
      id: string
      progress: number
    }) => {
      const { data, error } = await supabase
        .from('features')
        .update({ 
          progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-features'] })
      toast.success('Progresso atualizado com sucesso')
    }
  })

  return {
    features: query.data,
    isLoading: query.isLoading,
    error: query.error,
    updateFeatureDate,
    updateFeatureProgress
  }
} 