'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Fazer login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      })

      if (authError) throw authError

      const userId = authData.user?.id
      if (!userId) throw new Error('Usuário não encontrado')

      // 2. Verificar se é admin no auth.users
      if (authData.user.role !== 'admin') {
        throw new Error('Acesso não autorizado')
      }

      // 3. Redirecionar para área admin
      toast.success('Login administrativo realizado com sucesso!')
      router.push('/admin/alerts')

    } catch (error) {
      console.error('Erro:', error)
      if (error instanceof Error && error.message === 'Acesso não autorizado') {
        toast.error('Área restrita para administradores')
      } else {
        toast.error('Email ou senha incorretos')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-primary)]">
      <div className="w-full max-w-md p-8 bg-[var(--color-background-elevated)] rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Acesso Administrativo
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Área restrita para administradores
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email administrativo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Verificando...' : 'Acessar Painel Admin'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Esta é uma área restrita. Se você é um usuário normal,{' '}
          <a href="/login" className="text-[var(--color-primary)] hover:underline">
            clique aqui
          </a>
        </p>
      </div>
    </div>
  )
} 