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
        if (data.dependencies) {
          const { error: deleteError } = await supabase
            .from('feature_dependencies')
            .delete()
            .eq('feature_id', id)

          if (deleteError) throw deleteError

          if (data.dependencies.length > 0) {
            const dependencyRecords = data.dependencies.map(dep => ({
              feature_id: id,
              dependent_id: dep.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }))

            const { error: insertError } = await supabase
              .from('feature_dependencies')
              .insert(dependencyRecords)

            if (insertError) throw insertError
          }

          const { dependencies, ...updateData } = data
          
          const { data: updatedFeature, error } = await supabase
            .from('features')
            .update(updateData)
            .eq('id', id)
            .select(`
              *,
              stories (*),
              feature_dependencies!feature_dependencies_feature_id_fkey (
                dependent:features!feature_dependencies_dependent_id_fkey (
                  id,
                  title,
                  status
                )
              )
            `)
            .single()

          if (error) throw error

          const transformedFeature = {
            ...updatedFeature,
            dependencies: updatedFeature.feature_dependencies?.map(d => d.dependent) || []
          }

          setFeatures(prev => prev.map(f => 
            f.id === id ? transformedFeature : f
          ))

          return transformedFeature
        } else {
          const { dependencies, dependent_features, stories, ...updateData } = data

          const { data: updatedFeature, error } = await supabase
            .from('features')
            .update(updateData)
            .eq('id', id)
            .select(`
              *,
              stories (*),
              feature_dependencies!feature_dependencies_feature_id_fkey (
                dependent:features!feature_dependencies_dependent_id_fkey (
                  id,
                  title,
                  status
                )
              )
            `)
            .single()

          if (error) throw error

          const transformedFeature = {
            ...updatedFeature,
            dependencies: updatedFeature.feature_dependencies?.map(d => d.dependent) || []
          }

          setFeatures(prev => prev.map(f => 
            f.id === id ? transformedFeature : f
          ))

          return transformedFeature
        }
      } catch (error) {
        console.error('Erro ao atualizar feature:', error)
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