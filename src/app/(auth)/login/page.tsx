'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/ui/logo'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Fazer login e persistir sessão
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: true // Garantir que a sessão seja persistida
        }
      })

      if (error) throw error

      if (!data.session) {
        throw new Error('Sessão não criada')
      }

      // 2. Verificar role do usuário
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user?.id)
        .single()

      // Se não tem role, criar como usuário normal
      if (!userRole) {
        await supabase
          .from('user_roles')
          .insert({
            user_id: data.user?.id,
            role: 'user'
          })
      }

      // 3. Redirecionar baseado no role
      toast.success('Login realizado com sucesso!')
      
      // Aguardar o toast e forçar refresh da página
      setTimeout(() => {
        const route = userRole?.role === 'admin' ? '/admin/alerts' : '/dashboard'
        window.location.href = route
      }, 1000)

    } catch (error) {
      console.error('Erro ao fazer login:', error)
      toast.error('Email ou senha incorretos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-background">
      <div className="auth-background-pattern" />
      <div className="auth-background-circles">
        <div className="auth-background-circle auth-background-circle-1" />
        <div className="auth-background-circle auth-background-circle-2" />
        <div className="auth-background-circle auth-background-circle-3" />
      </div>

      <div className="auth-container">
        <div className="auth-card auth-animate">
          <div className="flex flex-col items-center space-y-2">
            <Logo />
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Entre para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[var(--color-background-elevated)]"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[var(--color-background-elevated)]"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Ainda não tem uma conta?{' '}
              <Link
                href="/signup"
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 