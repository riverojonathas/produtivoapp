'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { toast } from 'sonner'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Verificar se o email já existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.trim().toLowerCase())
        .single()

      if (existingUser) {
        toast.error('Este email já está registrado')
        return
      }

      // 2. Criar usuário
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password
      })

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          toast.error('Este email já está registrado')
        } else {
          toast.error('Erro ao criar conta')
        }
        return
      }

      if (!data.user) {
        throw new Error('Erro ao criar usuário')
      }

      // 3. Criar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email.trim().toLowerCase()
          }
        ])

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        throw new Error('Erro ao configurar perfil')
      }

      toast.success('Conta criada com sucesso! Por favor, verifique seu email.')
      router.push('/login')

    } catch (error) {
      console.error('Erro detalhado:', error)
      toast.error('Erro ao criar conta. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-primary)]">
      <div className="w-full max-w-md p-8 bg-[var(--color-background-elevated)] rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <Logo />
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Criar Conta
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Preencha os dados abaixo para começar
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4 mt-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
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
              className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
              autoComplete="new-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
} 