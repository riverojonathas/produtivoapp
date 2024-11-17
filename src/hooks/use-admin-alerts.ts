import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface AdminAlert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  target_type: 'all' | 'specific_users'
  target_users: string[]
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  scheduled_for: string | null
  sent_at: string | null
  created_at: string
  created_by: string
  metadata: Record<string, any>
}

interface CreateAlertInput {
  title: string
  message: string
  type: AdminAlert['type']
  priority: AdminAlert['priority']
  targetType: AdminAlert['target_type']
  scheduledFor?: Date | null
  targetUsers?: string[]
}

export function useAdminAlerts() {
  const queryClient = useQueryClient()

  const query = useQuery<AdminAlert[]>({
    queryKey: ['admin-alerts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      // Verificar se o usuário é admin
      const { data: user } = await supabase.auth.getUser()
      if (user?.user?.user_metadata?.role !== 'admin') {
        throw new Error('Acesso não autorizado')
      }

      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data
    }
  })

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
          target_type: data.targetType,
          target_users: data.targetUsers || [],
          status: data.scheduledFor ? 'scheduled' : 'sent',
          scheduled_for: data.scheduledFor?.toISOString() || null,
          sent_at: data.scheduledFor ? null : new Date().toISOString(),
          created_by: session.user.id
        }])

      if (error) throw error

      // Se não for agendado, criar os recibos de entrega
      if (!data.scheduledFor) {
        if (data.targetType === 'all') {
          const { data: users } = await supabase
            .from('users')
            .select('id')

          if (users) {
            await supabase
              .from('admin_alert_receipts')
              .insert(users.map(user => ({
                user_id: user.id,
                status: 'delivered'
              })))
          }
        } else if (data.targetUsers?.length) {
          await supabase
            .from('admin_alert_receipts')
            .insert(data.targetUsers.map(userId => ({
              user_id: userId,
              status: 'delivered'
            })))
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-alerts'] })
    }
  })

  const scheduleAlert = useMutation({
    mutationFn: async (data: CreateAlertInput) => {
      if (!data.scheduledFor) {
        throw new Error('Data de agendamento é obrigatória')
      }

      return createAlert.mutateAsync(data)
    }
  })

  const cancelAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('admin_alerts')
        .update({ status: 'cancelled' })
        .eq('id', alertId)

      if (error) throw error
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
    scheduleAlert,
    cancelAlert
  }
} 