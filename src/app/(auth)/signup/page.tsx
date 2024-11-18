'use client';

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Logo } from '@/components/ui/logo'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const passwordsMatch = formData.password && formData.confirmPassword && 
    formData.password === formData.confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordsMatch) {
      toast.error('As senhas não conferem')
      return
    }
    
    try {
      setIsLoading(true)

      // 1. Criar conta
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      // 2. Criar role do usuário
      if (data?.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'user'
          })

        if (roleError) {
          throw new Error('Erro ao criar perfil de usuário')
        }

        // 3. Fazer login automático
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (signInError) {
          throw new Error('Erro ao realizar login automático')
        }

        // 4. Feedback e redirecionamento
        toast.success('Conta criada com sucesso! Bem-vindo!')
        
        // Redirecionar para o dashboard
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        throw new Error('Erro ao criar usuário')
      }

    } catch (error) {
      let errorMessage = 'Erro ao criar conta'
      
      if (error instanceof Error) {
        // Tratamento de mensagens de erro específicas
        switch (error.message) {
          case 'User already registered':
            errorMessage = 'Este email já está cadastrado'
            break
          case 'Password should be at least 6 characters':
            errorMessage = 'A senha deve ter no mínimo 6 caracteres'
            break
          default:
            errorMessage = error.message
        }
      }
      
      toast.error(errorMessage)
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
            Criar nova conta
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Preencha os dados abaixo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <Input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
              autoComplete="name"
            />
          </div>
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
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
                autoComplete="new-password"
              />
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className={cn(
                  "bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]",
                  formData.confirmPassword && (
                    passwordsMatch 
                      ? "border-green-500 focus-visible:ring-green-500" 
                      : "border-red-500 focus-visible:ring-red-500"
                  )
                )}
                autoComplete="new-password"
              />
              {formData.confirmPassword && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {passwordsMatch ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
              )}
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">
                  As senhas não conferem
                </p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !passwordsMatch}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
          Já tem uma conta?{' '}
          <Link
            href="/signin"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
} 