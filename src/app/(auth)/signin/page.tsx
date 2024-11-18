'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Logo } from '@/components/ui/logo'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Fazer login e persistir sessão
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
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
      console.error('Erro no login:', error)
      toast.error('Email ou senha inválidos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-primary)]">
      <div className="w-full max-w-md p-8 bg-[var(--color-background-elevated)] rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <Logo />
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Bem-vindo de volta
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Entre para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
              autoComplete="email"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
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
  )
} 