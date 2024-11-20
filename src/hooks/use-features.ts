'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IFeature } from '@/types/feature'

interface UseFeatureReturn {
  features: IFeature[]
  feature?: IFeature
  isLoading: boolean
  createFeature: {
    mutateAsync: (data: Partial<IFeature>) => Promise<IFeature>
    isPending: boolean
  }
  updateFeature: {
    mutateAsync: (params: { id: string, data: Partial<IFeature> }) => Promise<IFeature>
    isPending: boolean
  }
  deleteFeature: {
    mutateAsync: (id: string) => Promise<void>
    isPending: boolean
  }
  refresh: () => Promise<void>
}

export function useFeatures(id?: string): UseFeatureReturn {
  const [features, setFeatures] = useState<IFeature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const supabase = createClientComponentClient()

  const loadFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('features')
        .select(`
          *,
          stories (*),
          feature_dependencies!feature_dependencies_feature_id_fkey (
            dependent:features!feature_dependencies_dependent_id_fkey (
              id,
              title,
              status
            )
          ),
          dependent_features:feature_dependencies!feature_dependencies_dependent_id_fkey (
            feature:features!feature_dependencies_feature_id_fkey (
              id,
              title,
              status
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro detalhado:', error)
        throw error
      }

      const transformedData = data?.map(feature => ({
        ...feature,
        dependencies: feature.feature_dependencies?.map(d => d.dependent) || [],
        dependent_features: feature.dependent_features?.map(d => d.feature) || []
      }))

      setFeatures(transformedData || [])
    } catch (error) {
      console.error('Erro ao carregar features:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFeatures()
  }, [])

  const updateFeature = {
    mutateAsync: async ({ id, data }: { id: string, data: Partial<IFeature> }) => {
      setIsPending(true)
      try {
        const updateData: Partial<IFeature> = {
          ...data,
          updated_at: new Date().toISOString()
        }

        if (updateData.status && !['backlog', 'doing', 'done', 'blocked'].includes(updateData.status)) {
          console.error('Status inválido:', updateData.status)
          throw new Error(`Status inválido: ${updateData.status}. Use: backlog, doing, done ou blocked`)
        }

        const {
          dependencies,
          dependent_features,
          stories,
          created_at,
          id: featureId,
          ...cleanData
        } = updateData

        console.log('Dados para atualização:', cleanData)

        const { data: updatedFeature, error } = await supabase
          .from('features')
          .update(cleanData)
          .eq('id', id)
          .select(`
            *,
            stories (*)
          `)
          .single()

        if (error) {
          console.error('Erro detalhado:', error)
          throw error
        }

        setFeatures(prev => prev.map(f => 
          f.id === id ? {
            ...f,
            ...updatedFeature,
            dependencies: f.dependencies,
            dependent_features: f.dependent_features,
            stories: updatedFeature.stories
          } : f
        ))

        return {
          ...updatedFeature,
          dependencies: updatedFeature.dependencies || [],
          dependent_features: updatedFeature.dependent_features || [],
          stories: updatedFeature.stories || []
        }
      } catch (error) {
        console.error('Erro detalhado ao atualizar feature:', error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const createFeature = {
    mutateAsync: async (data: Partial<IFeature>) => {
      setIsPending(true)
      try {
        const { dependencies, dependent_features, stories, ...createData } = data

        const { data: newFeature, error } = await supabase
          .from('features')
          .insert([createData])
          .select(`
            *,
            stories (*)
          `)
          .single()

        if (error) {
          console.error('Erro detalhado:', error)
          throw error
        }

        setFeatures(prev => [newFeature, ...prev])
        return newFeature
      } catch (error) {
        console.error('Erro ao criar feature:', error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const deleteFeature = {
    mutateAsync: async (id: string) => {
      setIsPending(true)
      try {
        const { error } = await supabase
          .from('features')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Erro detalhado:', error)
          throw error
        }

        setFeatures(prev => prev.filter(f => f.id !== id))
      } catch (error) {
        console.error('Erro ao excluir feature:', error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const feature = id ? features.find(f => f.id === id) : undefined

  return {
    features,
    feature,
    isLoading,
    createFeature,
    updateFeature,
    deleteFeature,
    refresh: loadFeatures
  }
} 