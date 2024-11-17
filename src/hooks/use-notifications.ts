import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useNotifications() {
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-notifications'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { count, error } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', session.user.id)
        .eq('status', 'unread')

      if (error) throw error

      return count || 0
    }
  })

  const markAllAsRead = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('Não autenticado')
    }

    const { error } = await supabase
      .from('alerts')
      .update({ status: 'read' })
      .eq('owner_id', session.user.id)
      .eq('status', 'unread')

    if (error) throw error
  }

  return {
    unreadCount,
    markAllAsRead
  }
} 