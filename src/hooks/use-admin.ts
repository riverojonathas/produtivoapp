'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }

        // Verificar se o usuário é admin no auth.users
        const { data: user } = await supabase.auth.getUser()
        if (user?.user?.role === 'admin') {
          setIsAdmin(true)
          setIsLoading(false)
          return
        }

        // Se não for admin, verificar na tabela user_roles
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()

        if (userRole?.role === 'admin') {
          setIsAdmin(true)
          setIsLoading(false)
          return
        }

        // Se não for admin em nenhum lugar, redirecionar para dashboard
        router.push('/dashboard')
      } catch (error) {
        console.error('Erro ao verificar permissões:', error)
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  return { isAdmin, isLoading }
} 