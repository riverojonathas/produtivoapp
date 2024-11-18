'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  description: string
  avatar_url?: string | null
  vision?: string | null
  target_audience?: string | null
  status?: string
  team?: string[]
  created_at: string
  owner_id: string
}

interface CreateProductInput {
  name: string
  description: string
  avatar_url?: string | null
  vision?: string | null
  risks?: string | null
  north_star?: string | null
  target_audience?: string | null
}

interface UpdateProductInput {
  name?: string
  description?: string
  status?: string
  team?: string[]
}

export function useProducts() {
  const queryClient = useQueryClient()

  const query = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    }
  })

  const createProduct = useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      // Criar o produto
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
          ...input,
          owner_id: session.user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (productError) throw productError

      // Se tiver público-alvo, criar persona
      if (input.target_audience) {
        const { error: personaError } = await supabase
          .from('personas')
          .insert([{
            name: input.target_audience,
            description: `Persona principal baseada no público-alvo: ${input.target_audience}`,
            product_id: product.id,
            owner_id: session.user.id,
            created_at: new Date().toISOString()
          }])

        if (personaError) throw personaError
      }

      return product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: UpdateProductInput }) => {
      const updateFields: UpdateProductInput = {
        name: data.name,
        description: data.description,
        status: data.status,
        team: data.team
      }

      // Remover campos undefined/null
      Object.entries(updateFields).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          delete updateFields[key as keyof UpdateProductInput]
        }
      })

      const { error } = await supabase
        .from('products')
        .update(updateFields)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  return {
    products: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createProduct,
    updateProduct,
    deleteProduct
  }
} 