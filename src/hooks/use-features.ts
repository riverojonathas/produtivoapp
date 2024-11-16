import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Feature } from '@/types/product'
import { useCurrentProduct } from '@/hooks/use-current-product'

export function useFeatures() {
  const { data: currentProduct } = useCurrentProduct()

  const {
    data: features = [],
    isLoading,
    error,
  } = useQuery<Feature[]>({
    queryKey: ['features', currentProduct?.id],
    queryFn: async () => {
      if (!currentProduct?.id) {
        return []
      }

      console.log('Buscando features do produto:', currentProduct.id)

      const { data, error } = await supabase
        .from('features')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          start_date,
          end_date,
          product_id,
          owner_id,
          dependencies,
          assignees,
          tags,
          created_at,
          updated_at,
          stories (
            id,
            title,
            description,
            status,
            points,
            feature_id,
            acceptance_criteria,
            assignees,
            created_at,
            updated_at
          )
        `)
        .eq('product_id', currentProduct.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar features:', error)
        throw error
      }

      console.log('Features encontradas:', data)

      // Transformar os dados do banco para o formato da aplicação
      return data.map(feature => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        status: feature.status || 'backlog',
        priority: feature.priority,
        startDate: feature.start_date,
        endDate: feature.end_date,
        productId: feature.product_id,
        stories: (feature.stories || []).map(story => ({
          id: story.id,
          featureId: story.feature_id,
          title: story.title,
          description: story.description,
          acceptanceCriteria: story.acceptance_criteria || [],
          status: story.status,
          points: story.points,
          assignees: story.assignees || [],
          createdAt: new Date(story.created_at),
          updatedAt: new Date(story.updated_at)
        })),
        dependencies: feature.dependencies || [],
        assignees: feature.assignees || [],
        tags: feature.tags || [],
        createdAt: new Date(feature.created_at),
        updatedAt: new Date(feature.updated_at)
      }))
    },
    enabled: !!currentProduct?.id,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  })

  return {
    features,
    isLoading,
    error,
  }
} 