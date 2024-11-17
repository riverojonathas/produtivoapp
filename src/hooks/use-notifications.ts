import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface Alert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
}

interface AlertNotification {
  id: string
  alert_id: string
  alert: Alert
  read: boolean
  created_at: string
}

export function useNotifications() {
  const queryClient = useQueryClient()

  const query = useQuery<AlertNotification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      // Buscar alertas enviados para todos os usuários ou específicos para este usuário
      const { data: alerts, error } = await supabase
        .from('admin_alerts')
        .select(`
          id,
          title,
          message,
          type,
          priority,
          status,
          target_type,
          target_users,
          created_at
        `)
        .eq('status', 'sent')
        .or(`target_type.eq.all,and(target_type.eq.specific_users,target_users.cs.{${session.user.id}})`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Buscar status de leitura
      const { data: notifications, error: notifError } = await supabase
        .from('user_notifications')
        .select('id, alert_id, read, created_at')
        .eq('user_id', session.user.id)

      if (notifError) throw notifError

      // Combinar alertas com status de leitura
      const notificationsMap = new Map(
        notifications?.map(n => [n.alert_id, n]) || []
      )

      const formattedAlerts = alerts?.map(alert => ({
        id: notificationsMap.get(alert.id)?.id || alert.id,
        alert_id: alert.id,
        alert: {
          id: alert.id,
          title: alert.title,
          message: alert.message,
          type: alert.type,
          priority: alert.priority,
          created_at: alert.created_at
        },
        read: notificationsMap.get(alert.id)?.read || false,
        created_at: notificationsMap.get(alert.id)?.created_at || alert.created_at
      })) as AlertNotification[]

      return formattedAlerts || []
    },
    refetchInterval: 30000
  })

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      // Verificar se já existe uma notificação
      const { data: existing } = await supabase
        .from('user_notifications')
        .select('id')
        .eq('id', notificationId)
        .single()

      if (existing) {
        // Atualizar notificação existente
        const { error } = await supabase
          .from('user_notifications')
          .update({ read: true })
          .eq('id', notificationId)

        if (error) throw error
      } else {
        // Criar nova notificação como lida
        const { error } = await supabase
          .from('user_notifications')
          .insert({
            id: notificationId,
            user_id: session.user.id,
            alert_id: notificationId,
            read: true
          })

        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
    }
  })

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('user_id', session.user.id)
        .eq('read', false)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
    }
  })

  return {
    notifications: query.data || [],
    isLoading: query.isLoading,
    unreadCount: query.data?.filter(n => !n.read).length || 0,
    markAsRead,
    markAllAsRead
  }
} 