import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

const publicPaths = ['/', '/login', '/signup']

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const isPublicPath = publicPaths.includes(pathname)

  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    },
    staleTime: 1000 * 60 // 1 minuto
  })

  useEffect(() => {
    // Não redirecionar em páginas públicas
    if (isPublicPath) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && !isLoading) {
        router.replace('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router, isLoading, isPublicPath])

  return {
    session,
    isLoading,
    isAuthenticated: !!session
  }
} 