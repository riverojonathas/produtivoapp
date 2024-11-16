'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Product, ProductCreateInput } from '@/types/product'
import { useRouter } from 'next/navigation'

export function useProducts() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const query = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/login')
        throw new Error('Usuário não autenticado')
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const createProduct = useMutation({
    mutationFn: async (newProduct: ProductCreateInput) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        router.push('/login')
        throw new Error('Usuário não autenticado')
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          description: newProduct.description,
          owner_id: user.id,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateProduct = useMutation({
    mutationFn: async (product: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description
        })
        .eq('id', product.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createProduct,
    updateProduct
  }
} 