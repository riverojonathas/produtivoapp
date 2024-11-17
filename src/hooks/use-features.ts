import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Feature } from '@/types/product'
import { useAuth } from './use-auth'

export function useFeatures() {
  const { session, isAuthenticated } = useAuth()

  const query = useQuery<Feature[]>({
    queryKey: ['features'],
    queryFn: async () => {
      if (!session?.user) {
        return []
      }

      const { data, error } = await supabase
        .from('features')
        .select(`
          *,
          stories (*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar features:', error)
        throw error
      }

      return data || []
    },
    enabled: isAuthenticated
  })

  return {
    features: query.data || [],
    isLoading: query.isLoading,
    error: query.error
  }
} 