'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import { toast } from 'sonner'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, created_at, updated_at')
        .order('name')

      if (error) {
        throw error
      }

      const formattedProducts = data?.map(product => ({
        ...product,
        title: product.name
      })) || []

      setProducts(formattedProducts)
    } catch (error: any) {
      console.error('Erro ao carregar produtos:', error.message || error)
      toast.error('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    refresh: loadProducts
  }
} 