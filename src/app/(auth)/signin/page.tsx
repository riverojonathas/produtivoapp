'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { LogoHorizontal } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (error: unknown) {
      console.error('Erro no login:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Email ou senha inválidos')
      }
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    'Gestão completa de produtos digitais',
    'Frameworks de priorização',
    'Roadmaps interativos',
    'Métricas e KPIs'
  ]

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Form */}
      <div className="w-full lg:w-[480px] flex flex-col p-8 lg:p-12 bg-[#0f172a]">
        <div className="flex flex-col items-start">
          <LogoHorizontal className="h-[42px]" />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="mb-8">
            <Badge 
              variant="secondary" 
              className="mb-4 bg-blue-900/50 text-blue-400"
            >
              Área do Cliente
            </Badge>
            <h1 className="text-2xl font-semibold text-white mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-400">
              Entre para continuar gerenciando seus produtos
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email</label>
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#1a2744] border-[#2a3754] text-white placeholder-gray-500 h-11"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Senha</label>
              <Input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#1a2744] border-[#2a3754] text-white placeholder-gray-500 h-11"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-950/50 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Ainda não tem uma conta?{' '}
              <Link
                href="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-auto pt-12 text-center">
          <p className="text-xs text-gray-500">
            Ao entrar você concorda com nossos{' '}
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>

      {/* Lado Direito - Marketing */}
      <div className="hidden lg:flex flex-1 bg-[#1a2744] items-center justify-center p-12">
        <div className="max-w-lg">
          <Badge 
            variant="secondary" 
            className="mb-8 bg-blue-600/20 text-blue-400 px-4 py-1.5"
          >
            Plataforma líder em Product Management
          </Badge>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Transforme a maneira como você{' '}
            <span className="text-blue-400">gerencia produtos digitais</span>
          </h2>
          
          <div className="space-y-4 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
            <div>
              <div className="text-3xl font-bold text-white">2.5k+</div>
              <div className="text-sm text-gray-400">Produtos ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">10k+</div>
              <div className="text-sm text-gray-400">Usuários</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-gray-400">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 