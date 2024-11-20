'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { IProduct } from '@/types/product'

interface UseProductsReturn {
  products: IProduct[]
  product?: IProduct
  isLoading: boolean
  createProduct: {
    mutateAsync: (data: Partial<IProduct>) => Promise<IProduct>
    isPending: boolean
  }
  updateProduct: {
    mutateAsync: (params: { id: string, data: Partial<IProduct> }) => Promise<IProduct>
    isPending: boolean
  }
  deleteProduct: {
    mutateAsync: (id: string) => Promise<void>
    isPending: boolean
  }
  refresh: () => Promise<void>
}

export function useProducts(id?: string): UseProductsReturn {
  const [products, setProducts] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, setIsPending] = useState(false)
  const supabase = createClientComponentClient()

  // Função para carregar produtos com a query corrigida
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_metrics (*),
          product_risks (*),
          product_tags (*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao carregar produtos:', error)
        throw error
      }

      // Transformar os dados para manter a estrutura esperada
      const transformedData = data?.map(product => ({
        ...product,
        tags: product.product_tags || []
      }))

      setProducts(transformedData || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const createProduct = {
    mutateAsync: async (data: Partial<IProduct>) => {
      setIsPending(true)
      try {
        // Remover campos que não devem ser enviados para o banco
        const { tags, product_tags, product_metrics, product_risks, ...productData } = data

        const { data: newProduct, error } = await supabase
          .from('products')
          .insert([productData])
          .select(`
            *,
            product_metrics (*),
            product_risks (*),
            product_tags (*)
          `)
          .single()

        if (error) {
          console.error('Erro ao criar produto:', error)
          throw error
        }

        // Transformar os dados do novo produto
        const transformedProduct = {
          ...newProduct,
          tags: newProduct.product_tags || []
        }
        
        setProducts(prev => [transformedProduct, ...prev])
        
        return transformedProduct
      } catch (error) {
        console.error('Erro ao criar produto:', error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const updateProduct = {
    mutateAsync: async ({ id, data }: { id: string, data: Partial<IProduct> }) => {
      setIsPending(true)
      try {
        // Remover campos que não devem ser enviados para o banco
        const { tags, product_tags, product_metrics, product_risks, ...updateData } = data

        const { data: updatedProduct, error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', id)
          .select(`
            *,
            product_metrics (*),
            product_risks (*),
            product_tags (*)
          `)
          .single()

        if (error) {
          console.error('Erro ao atualizar produto:', error)
          throw new Error(error.message || 'Erro ao atualizar produto')
        }

        if (!updatedProduct) {
          throw new Error('Produto não encontrado')
        }

        // Transformar os dados do produto atualizado
        const transformedProduct = {
          ...updatedProduct,
          tags: updatedProduct.product_tags || []
        }

        setProducts(prev => prev.map(p => p.id === id ? transformedProduct : p))
        
        return transformedProduct
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao atualizar produto'
        console.error('Erro ao atualizar produto:', message)
        throw new Error(message)
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const deleteProduct = {
    mutateAsync: async (id: string) => {
      setIsPending(true)
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Erro ao excluir produto:', error)
          throw new Error(error.message || 'Erro ao excluir produto')
        }

        // Remover o produto da lista local
        setProducts(prev => prev.filter(p => p.id !== id))
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao excluir produto'
        console.error('Erro ao excluir produto:', message)
        throw new Error(message)
      } finally {
        setIsPending(false)
      }
    },
    isPending
  }

  const refresh = async () => {
    setIsLoading(true)
    await loadProducts()
  }

  // Se um ID for fornecido, retorna apenas o produto específico
  const product = id ? products.find(p => p.id === id) : undefined

  return {
    products,
    product,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    refresh
  }
} 