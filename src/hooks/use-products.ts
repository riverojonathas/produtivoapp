'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { 
  IProduct, 
  IProductRisk,
  IProductMetric,
  ITeamMember,
  ITag,
  RiskCategory,
  ProductStatus 
} from '@/types/product'

export function useProducts(productId?: string) {
  const supabase = createClientComponentClient()
  const queryClient = useQueryClient()

  // Query para buscar produtos
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_metrics (*), product_risks (*), product_tags (*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as IProduct[]
    }
  })

  // Query para buscar produto específico
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null

      const { data, error } = await supabase
        .from('products')
        .select('*, product_metrics (*), product_risks (*), product_tags (*)')
        .eq('id', productId)
        .single()

      if (error) throw error
      return data as IProduct
    },
    enabled: !!productId
  })

  // Query para buscar riscos
  const { data: risks = [], isLoading: isLoadingRisks } = useQuery({
    queryKey: ['product-risks', productId],
    queryFn: async () => {
      if (!productId) return []

      const { data, error } = await supabase
        .from('product_risks')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as IProductRisk[]
    },
    enabled: !!productId
  })

  // Mutation para criar produto
  const createProduct = useMutation({
    mutationFn: async (data: Partial<IProduct>) => {
      try {
        if (!data.name?.trim()) {
          throw new Error('Nome do produto é obrigatório')
        }

        // Buscar o usuário atual
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        if (!user) {
          throw new Error('Usuário não autenticado')
        }

        // Garantir que o status seja válido
        const status: ProductStatus = data.status || 'development'
        if (!['active', 'development', 'archived'].includes(status)) {
          throw new Error('Status inválido')
        }

        const productData = {
          name: data.name.trim(),
          description: data.description || null,
          status,
          owner_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data: product, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single()

        if (error) {
          console.error('Erro do Supabase:', error)
          throw new Error(error.message)
        }

        return product as IProduct
      } catch (error: any) {
        console.error('Erro detalhado:', error)
        throw new Error(error.message || 'Erro ao criar produto')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: Error) => {
      console.error('Erro ao criar produto:', error)
      toast.error(error.message || 'Erro ao criar produto')
    }
  })

  // Mutation para atualizar produto
  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<IProduct> }) => {
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  // Mutation para deletar produto
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

  // Mutation para adicionar risco
  const addRisk = useMutation({
    mutationFn: async ({ 
      productId, 
      data 
    }: { 
      productId: string
      data: Partial<IProductRisk>
    }) => {
      try {
        if (!data.description?.trim() || !data.mitigation?.trim() || !data.category) {
          throw new Error('Campos obrigatórios não preenchidos')
        }

        const riskData = {
          product_id: productId,
          category: data.category,
          description: data.description.trim(),
          mitigation: data.mitigation.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data: risk, error } = await supabase
          .from('product_risks')
          .insert([riskData])
          .select()
          .single()

        if (error) throw error
        return risk
      } catch (error) {
        console.error('Erro ao criar risco:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Risco adicionado com sucesso')
    },
    onError: (error: any) => {
      console.error('Erro ao adicionar risco:', error)
      toast.error(error.message || 'Erro ao adicionar risco')
    }
  })

  // Mutation para atualizar risco
  const updateRisk = useMutation({
    mutationFn: async ({ 
      productId, 
      riskId, 
      data 
    }: { 
      productId: string
      riskId: string
      data: Partial<IProductRisk>
    }) => {
      try {
        if (!data.description?.trim() || !data.mitigation?.trim()) {
          throw new Error('Campos obrigatórios não preenchidos')
        }

        const { error } = await supabase
          .from('product_risks')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', riskId)
          .eq('product_id', productId)

        if (error) throw error
      } catch (error) {
        console.error('Erro ao atualizar risco:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Risco atualizado com sucesso')
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar risco:', error)
      toast.error(error.message || 'Erro ao atualizar risco')
    }
  })

  // Mutation para remover risco
  const removeRisk = useMutation({
    mutationFn: async ({ 
      productId, 
      riskId 
    }: { 
      productId: string
      riskId: string 
    }) => {
      try {
        const { error } = await supabase
          .from('product_risks')
          .delete()
          .eq('id', riskId)
          .eq('product_id', productId)

        if (error) throw error
      } catch (error) {
        console.error('Erro ao remover risco:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Risco removido com sucesso')
    },
    onError: (error: any) => {
      console.error('Erro ao remover risco:', error)
      toast.error(error.message || 'Erro ao remover risco')
    }
  })

  // Mutation para atualizar tags
  const updateProductTags = useMutation({
    mutationFn: async ({ productId, tags }: { productId: string, tags: Partial<ITag>[] }) => {
      const { error } = await supabase
        .from('product_tags')
        .upsert(
          tags.map(tag => ({
            product_id: productId,
            ...tag,
            updated_at: new Date().toISOString()
          }))
        )

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  // Mutation para atualizar métricas
  const updateProductMetrics = useMutation({
    mutationFn: async ({ productId, metrics }: { productId: string, metrics: Partial<IProductMetric>[] }) => {
      const { error } = await supabase
        .from('product_metrics')
        .upsert(
          metrics.map(metric => ({
            product_id: productId,
            ...metric,
            updated_at: new Date().toISOString()
          }))
        )

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  // Mutations para time
  const addTeamMember = useMutation({
    mutationFn: async ({ productId, data }: { productId: string, data: Partial<ITeamMember> }) => {
      const { error } = await supabase
        .from('team_members')
        .insert([{ product_id: productId, ...data }])

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const updateTeamMember = useMutation({
    mutationFn: async ({ productId, memberId, data }: { 
      productId: string, 
      memberId: string, 
      data: Partial<ITeamMember> 
    }) => {
      const { error } = await supabase
        .from('team_members')
        .update(data)
        .eq('id', memberId)
        .eq('product_id', productId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  const removeTeamMember = useMutation({
    mutationFn: async ({ productId, memberId }: { productId: string, memberId: string }) => {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)
        .eq('product_id', productId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  return {
    products,
    isLoading,
    product,
    isLoadingProduct,
    risks,
    isLoadingRisks,
    createProduct,
    updateProduct,
    deleteProduct,
    addRisk,
    updateRisk,
    removeRisk,
    updateProductTags,
    updateProductMetrics,
    addTeamMember,
    updateTeamMember,
    removeTeamMember
  }
} 