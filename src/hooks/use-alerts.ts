import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Alert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'unread' | 'read' | 'archived'
  category: 'story' | 'feature' | 'report' | 'announcement'
  reference_id?: string
  created_at: string
  read_at?: string
  owner_id: string
}

export function useAlerts() {
  const queryClient = useQueryClient()

  const query = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    }
  })

  const createAlert = useMutation({
    mutationFn: async (data: Omit<Alert, 'id' | 'created_at' | 'owner_id' | 'status'>) => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        throw new Error('Não autenticado')
      }

      const { data: alert, error } = await supabase
        .from('alerts')
        .insert([{
          ...data,
          owner_id: session.user.id,
          status: 'unread'
        }])
        .select()
        .single()

      if (error) throw error

      return alert
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    }
  })

  const markAsRead = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('alerts')
        .update({
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', alertId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    }
  })

  const archiveAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from('alerts')
        .update({
          status: 'archived'
        })
        .eq('id', alertId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    }
  })

  return {
    alerts: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createAlert,
    markAsRead,
    archiveAlert
  }
} 