'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { ProductStatus } from '@/types/product'

interface Product {
  id: string
  name: string
  description: string
  avatar_url?: string | null
  vision?: string | null
  target_audience?: string | null
  status?: ProductStatus
  team?: string[]
  created_at: string
  owner_id: string
}

interface CreateProductInput {
  name: string
  description: string
  owner_id: string | null
  team: string[]
  vision?: string | null
  target_audience?: string | null
  status?: ProductStatus
}

interface CreateProductRiskInput {
  product_id: string
  category: string
  description: string
  mitigation: string
}

interface CreateProductMetricInput {
  product_id: string
  type: 'heart' | 'north_star'
  name: string
  value: string
}

interface UpdateProductInput {
  name?: string
  description?: string
  status?: ProductStatus
  team?: string[]
  vision?: string | null
  target_audience?: string | null
  updated_at?: string
}

interface Tag {
  id: string
  name: string
  type: 'priority' | 'phase' | 'category' | 'custom'
  color?: string
  product_id: string
}

export function useProducts(productId?: string) {
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
        .select(`
          *,
          product_risks (
            id,
            category,
            description,
            mitigation
          ),
          product_metrics (
            id,
            type,
            name,
            value
          ),
          product_tags (
            id,
            name,
            type,
            color
          )
        `)
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const productsWithCounts = data?.map(product => ({
        ...product,
        risks_count: product.product_risks?.length || 0,
        metrics_count: product.product_metrics?.length || 0,
        tags: product.product_tags || []
      })) || []

      return productsWithCounts
    }
  })

  const createProduct = useMutation({
    mutationFn: async (input: CreateProductInput) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Usuário não autenticado')
        }

        const productData = {
          name: input.name.trim(),
          description: input.description?.trim() || '',
          owner_id: session.user.id,
          team: input.team || [],
          status: 'active',
          created_at: new Date().toISOString()
        }

        if (input.vision) {
          productData['vision'] = input.vision
        }
        
        if (input.target_audience) {
          productData['target_audience'] = input.target_audience
        }

        console.log('Dados para inserção:', productData)

        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select('*')
          .single()

        if (error) {
          console.error('Erro do Supabase:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          throw new Error(error.message)
        }

        if (!data) {
          throw new Error('Produto não foi criado')
        }

        return data
      } catch (error) {
        console.error('Erro completo:', error)
        throw error
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Produto criado com sucesso')
    },
    onError: (error) => {
      console.error('Erro na mutação:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar produto')
    }
  })

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: UpdateProductInput }) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        if (data.status && !['active', 'development', 'archived'].includes(data.status)) {
          throw new Error('Status inválido')
        }

        const updateData = {
          ...data,
          updated_at: new Date().toISOString()
        }

        console.log('Atualizando produto:', { id, data: updateData })

        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Erro ao atualizar:', error)
          throw error
        }

        return updatedProduct
      } catch (error) {
        console.error('Erro ao atualizar produto:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Status atualizado com sucesso')
    },
    onError: (error: any) => {
      console.error('Erro na atualização:', error)
      const message = error?.message || 'Erro ao atualizar status'
      toast.error(message)
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

  const createProductRisk = useMutation({
    mutationFn: async (input: CreateProductRiskInput) => {
      const { error } = await supabase
        .from('product_risks')
        .insert(input)

      if (error) throw error
    }
  })

  const createProductMetric = useMutation({
    mutationFn: async (input: CreateProductMetricInput) => {
      const { error } = await supabase
        .from('product_metrics')
        .insert(input)

      if (error) throw error
    }
  })

  const getProduct = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_risks (
            id,
            category,
            description,
            mitigation
          ),
          product_metrics (
            id,
            type,
            name,
            value
          ),
          product_tags (
            id,
            name,
            type,
            color
          )
        `)
        .eq('id', productId)
        .single()

      if (error) throw error

      return {
        ...data,
        risks_count: data.product_risks?.length || 0,
        metrics_count: data.product_metrics?.length || 0,
        tags: data.product_tags || []
      }
    },
    enabled: !!productId
  })

  const updateProductTags = useMutation({
    mutationFn: async ({ productId, tags }: { productId: string, tags: Omit<Tag, 'id' | 'product_id'>[] }) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        // Primeiro, remove todas as tags existentes
        const { error: deleteError } = await supabase
          .from('product_tags')
          .delete()
          .eq('product_id', productId)

        if (deleteError) throw deleteError

        // Se não há novas tags, retorna
        if (!tags.length) return

        // Insere as novas tags
        const { data, error } = await supabase
          .from('product_tags')
          .insert(
            tags.map(tag => ({
              ...tag,
              product_id: productId
            }))
          )
          .select()

        if (error) throw error

        return data
      } catch (error) {
        console.error('Erro ao atualizar tags:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Tags atualizadas com sucesso')
    },
    onError: (error) => {
      console.error('Erro ao atualizar tags:', error)
      toast.error('Erro ao atualizar tags')
    }
  })

  return {
    products: query.data,
    product: getProduct.data,
    isLoading: query.isLoading || (!!productId && getProduct.isLoading),
    error: query.error || getProduct.error,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductRisk,
    createProductMetric,
    updateProductTags
  }
} 