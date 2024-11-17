import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface AdminAlert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  target_type: 'all' | 'specific_users'
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

      // Buscar todos os alertas ordenados por data de criação
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

      const { error } = await supabase
        .from('admin_alerts')
        .insert([{
          title: data.title,
          message: data.message,
          type: data.type,
          priority: data.priority,
          status: 'sent', // Por padrão, o alerta é enviado imediatamente
          target_type: data.targetType,
          target_users: data.targetUsers || [],
          created_by: session.user.id,
          created_at: new Date().toISOString()
        }])

      if (error) {
        console.error('Erro ao criar alerta:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alerts'] })
    }
  })

  // Mutation para cancelar alerta
  const cancelAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('admin_alerts')
        .update({ status: 'cancelled' })
        .eq('id', alertId)

      if (error) {
        console.error('Erro ao cancelar alerta:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alerts'] })
    }
  })

  return {
    alerts: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createAlert,
    cancelAlert
  }
} 