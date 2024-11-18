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
  owner_id: string | null
  dependencies?: string[]
  assignees?: string[]
  tags?: string[]
  progress?: number
}

interface CreateFeaturePrioritizationInput {
  feature_id: string
  method: 'rice' | 'moscow'
  reach?: number
  impact?: number
  confidence?: number
  effort?: number
  moscow_priority?: 'must' | 'should' | 'could' | 'wont'
  notes?: string
}

export function useFeatures(featureId?: string) {
  const queryClient = useQueryClient()

  const query = useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('features')
        .select(`
          *,
          prioritization:feature_prioritizations (
            id,
            method,
            reach,
            impact,
            confidence,
            effort,
            moscow_priority,
            notes
          ),
          personas:feature_personas (
            id,
            persona:personas (
              id,
              name
            )
          ),
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

  const createFeature = useMutation({
    mutationFn: async (input: CreateFeatureInput) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Usuário não autenticado')
        }

        const featureData = {
          ...input,
          owner_id: session.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('features')
          .insert(featureData)
          .select()
          .single()

        if (error) throw error

        return data
      } catch (error) {
        console.error('Erro ao criar feature:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
      toast.success('Feature criada com sucesso')
    }
  })

  const createFeaturePrioritization = useMutation({
    mutationFn: async (input: CreateFeaturePrioritizationInput) => {
      const { data, error } = await supabase
        .from('feature_prioritizations')
        .insert({
          ...input,
          created_at: new Date().toISOString(),
          created_by: (await supabase.auth.getSession()).data.session?.user.id
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] })
    }
  })

  const updateFeature = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Feature> }) => {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      }

      const { data: updatedFeature, error } = await supabase
        .from('features')
        .update(updateData)
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

  const getFeature = useQuery({
    queryKey: ['feature', featureId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('features')
        .select(`
          *,
          prioritization:feature_prioritizations (
            id,
            method,
            reach,
            impact,
            confidence,
            effort,
            moscow_priority,
            notes
          ),
          personas:feature_personas (
            id,
            persona:personas (
              id,
              name
            )
          ),
          product:products (
            id,
            name,
            status
          )
        `)
        .eq('id', featureId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!featureId
  })

  return {
    features: query.data,
    feature: getFeature.data,
    isLoading: query.isLoading || (!!featureId && getFeature.isLoading),
    error: query.error || getFeature.error,
    createFeature,
    updateFeature,
    deleteFeature,
    createFeaturePrioritization
  }
} 