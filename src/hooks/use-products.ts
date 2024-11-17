'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'

export function useProducts() {
  const queryClient = useQueryClient()

  const query = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          console.log('Sem sessão ativa')
          return []
        }

        const { data, error } = await supabase
          .from('products')
          .select('id, created_at, name, description, status, owner_id, team')
          .eq('owner_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Erro do Supabase:', {
            message: error.message,
            details: error.details,
            hint: error.hint
          })
          throw new Error(error.message)
        }

        return data || []
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro detalhado:', {
            message: error.message,
            stack: error.stack
          })
        }
        throw error
      }
    }
  })

  const createProduct = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        if (!data.name) {
          throw new Error('Nome do produto é obrigatório')
        }

        const newProduct = {
          name: data.name,
          description: data.description || '',
          status: data.status || 'active',
          owner_id: session.user.id,
          team: data.team || []
        }

        console.log('Tentando criar produto:', newProduct)

        const { data: product, error } = await supabase
          .from('products')
          .insert([newProduct])
          .select('id, created_at, name, description, status, owner_id, team')
          .single()

        if (error) {
          console.error('Erro do Supabase:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          throw new Error(`Erro ao criar produto: ${error.message}`)
        }

        if (!product) {
          throw new Error('Produto não foi criado')
        }

        console.log('Produto criado com sucesso:', product)
        return product
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro detalhado na criação:', {
            message: error.message,
            stack: error.stack
          })
        }
        throw error
      }
    },
    onSuccess: (newProduct) => {
      queryClient.setQueryData<Product[]>(['products'], (old = []) => {
        return [newProduct, ...old]
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateProduct = useMutation({
    mutationFn: async (data: Product) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        const updateFields = {
          name: data.name,
          description: data.description,
          status: data.status,
          team: data.team
        }

        Object.keys(updateFields).forEach(key => {
          if (updateFields[key] === undefined || updateFields[key] === null) {
            delete updateFields[key]
          }
        })

        console.log('Campos para atualizar:', updateFields)

        const { data: product, error } = await supabase
          .from('products')
          .update(updateFields)
          .eq('id', data.id)
          .select('id, created_at, name, description, status, owner_id, team')
          .single()

        if (error) {
          console.error('Erro do Supabase:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          throw new Error(`Erro ao atualizar produto: ${error.message}`)
        }

        return product
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro detalhado na atualização:', {
            message: error.message,
            stack: error.stack
          })
        }
        throw error
      }
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData<Product[]>(['products'], (old = []) => {
        return old.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        )
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          throw new Error('Não autenticado')
        }

        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Erro do Supabase:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          throw new Error(`Erro ao deletar produto: ${error.message}`)
        }

        return id
      } catch (error) {
        if (error instanceof Error) {
          console.error('Erro ao deletar produto:', {
            message: error.message,
            stack: error.stack
          })
        }
        throw error
      }
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Product[]>(['products'], (old = []) => {
        return old.filter(product => product.id !== deletedId)
      })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  return {
    products: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createProduct,
    updateProduct,
    deleteProduct
  }
} 