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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Criar Conta
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Preencha os dados abaixo para começar
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
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
              autoComplete="new-password"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-[var(--color-primary)] hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
} 