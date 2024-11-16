'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { LogoHorizontal } from '@/components/ui/logo'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: name,
            email: email,
            avatar_url: null
          })

        if (profileError) throw new Error('Erro ao criar perfil')

        const { error: productError } = await supabase
          .from('products')
          .insert({
            name: 'Meu Primeiro Produto',
            description: 'Comece a gerenciar seu produto aqui',
            owner_id: authData.user.id,
            status: 'active'
          })

        if (productError) throw new Error('Erro ao criar produto padrão')

        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      console.error('Erro no signup:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
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
          <div className="flex flex-col items-center gap-6 mb-8">
            <LogoHorizontal />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Criar nova conta
              </h1>
              <p className="text-[var(--color-text-secondary)] mt-2">
                Preencha os dados abaixo para começar
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-6 bg-red-100 border border-red-300 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-[var(--color-background-primary)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-[var(--color-background-primary)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-[var(--color-background-primary)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[var(--color-primary)] hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 