import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Feature } from '@/types/product'

export function useFeatures() {
  const {
    data: features = [],
    isLoading,
    error,
  } = useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transformar os dados para o formato correto
      return data.map(feature => ({
        ...feature,
        startDate: feature.start_date,
        endDate: feature.end_date,
        productId: feature.product_id,
        createdAt: new Date(feature.created_at),
        updatedAt: new Date(feature.updated_at),
        dependencies: feature.dependencies || [],
        assignees: feature.assignees || [],
        tags: feature.tags || []
      }))
    },
  })

  return {
    features,
    isLoading,
    error,
  }
} 