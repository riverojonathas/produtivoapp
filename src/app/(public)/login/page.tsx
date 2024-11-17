'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        // Forçar um refresh completo para recarregar o estado da aplicação
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      toast.error('Email ou senha incorretos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6 p-6">
      <div className="flex flex-col items-center space-y-2">
        <Logo />
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Entre para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="text-center">
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
  )
} 