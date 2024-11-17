import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface Alert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  created_at: string
}

export function useNotifications() {
  const queryClient = useQueryClient()

  // Buscar alertas
  const alertsQuery = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          read,
          admin_alerts (
            id,
            title,
            message,
            type,
            priority,
            created_at
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(notification => ({
        id: notification.id,
        ...notification.admin_alerts,
        read: notification.read
      }))
    }
  })

  // Buscar contagem de não lidos
  const unreadQuery = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id)
        .eq('read', false)

      if (error) throw error

      return count || 0
    }
  })

  // Marcar como lido
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
    }
  })

  // Marcar todos como lidos
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', session.user.id)
        .eq('read', false)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
    }
  })

  return {
    alerts: alertsQuery.data,
    isLoading: alertsQuery.isLoading || unreadQuery.isLoading,
    unreadCount: unreadQuery.data || 0,
    markAsRead,
    markAllAsRead
  }
} 