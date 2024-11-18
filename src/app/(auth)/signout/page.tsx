'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function SignOut() {
  const router = useRouter()

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        
        toast.success('Logout realizado com sucesso')
        router.push('/signin')
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        toast.error('Erro ao fazer logout')
        router.push('/dashboard')
      }
    }

    handleSignOut()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-sm text-[var(--color-text-secondary)]">
          Saindo...
        </div>
      </div>
    </div>
  )
} 