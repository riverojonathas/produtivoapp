import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

// Constantes para labels
export const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente'
} as const

export const STATUS_LABELS = {
  draft: 'Rascunho',
  scheduled: 'Agendado',
  sent: 'Enviado',
  cancelled: 'Cancelado'
} as const

interface AdminAlert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: keyof typeof PRIORITY_LABELS
  status: keyof typeof STATUS_LABELS
  target_type: 'all' | 'specific_users'
  scheduled_for?: string | null
  created_at: string
}

interface CreateAlertInput {
  title: string
  message: string
  type: AdminAlert['type']
  priority: AdminAlert['priority']
  targetType: AdminAlert['target_type']
  targetUsers?: string[]
}

interface UpdateAlertInput {
  id: string
  data: {
    status: keyof typeof STATUS_LABELS
    scheduled_for?: string | null
  }
}

interface UpdateData {
  status: keyof typeof STATUS_LABELS
  scheduled_for?: string | null
}

export function useAdminAlerts() {
  const queryClient = useQueryClient()

  // Query para buscar alertas
  const query = useQuery<AdminAlert[]>({
    queryKey: ['admin-alerts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar alertas:', error)
        throw error
      }

      return data as AdminAlert[]
    }
  })

  // Mutation para criar alerta
  const createAlert = useMutation({
    mutationFn: async (data: CreateAlertInput) => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data: result, error } = await supabase
        .from('admin_alerts')
        .insert([{
          title: data.title,
          message: data.message,
          type: data.type,
          priority: data.priority,
          status: 'draft',
          target_type: data.targetType,
          target_users: data.targetUsers || [],
          created_by: session.user.id,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar alerta:', error)
        throw new Error(error.message)
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alerts'] })
    }
  })

  // Mutation para deletar alerta
  const deleteAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { error } = await supabase
        .from('admin_alerts')
        .delete()
        .eq('id', alertId)

      if (error) {
        console.error('Erro ao deletar alerta:', error)
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alerts'] })
    }
  })

  // Mutation para cancelar alerta
  const cancelAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { error } = await supabase
        .from('admin_alerts')
        .update({ status: 'cancelled' })
        .eq('id', alertId)

      if (error) {
        console.error('Erro ao cancelar alerta:', error)
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alerts'] })
    }
  })

  // Mutation para atualizar alerta
  const updateAlert = useMutation({
    mutationFn: async ({ id, data }: UpdateAlertInput) => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      // Verificar se o usuário é admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (userRole?.role !== 'admin') {
        throw new Error('Permissão negada')
      }

      // Validar status
      if (!Object.keys(STATUS_LABELS).includes(data.status)) {
        throw new Error('Status inválido')
      }

      // Se for agendado, validar data
      if (data.status === 'scheduled' && !data.scheduled_for) {
        throw new Error('Data de agendamento é obrigatória')
      }

      const updateData: UpdateData = {
        status: data.status
      }

      // Adicionar scheduled_for apenas se necessário
      if (data.status === 'scheduled') {
        updateData.scheduled_for = data.scheduled_for
      } else {
        updateData.scheduled_for = null
      }

      const { data: result, error } = await supabase
        .from('admin_alerts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar alerta:', error)
        throw new Error(error.message || 'Erro ao atualizar alerta')
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alerts'] })
    },
    onError: (error: Error) => {
      console.error('Erro na mutation:', error.message)
      throw error
    }
  })

  return {
    alerts: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createAlert,
    cancelAlert,
    deleteAlert,
    updateAlert,
    PRIORITY_LABELS,
    STATUS_LABELS
  }
} 