'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'

export function useCurrentProduct() {
  const query = useQuery<Product>({
    queryKey: ['currentProduct'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Por enquanto vamos pegar o primeiro produto do usuário
      // TODO: Implementar seleção de produto
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', user.id)
        .limit(1)
        .single()

      if (error) throw error
      return products
    }
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error
  }
} 