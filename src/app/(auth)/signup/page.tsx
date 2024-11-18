'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { LogoHorizontal } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const supabase = createClientComponentClient()
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

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      })

      if (signUpError) throw signUpError

      if (data?.user) {
        await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'user'
          })

        toast.success('Conta criada com sucesso! Bem-vindo!')
        window.location.href = '/dashboard'
      }

    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  const benefits = [
    'Gestão completa de produtos digitais',
    'Frameworks de priorização RICE e MoSCoW',
    'Roadmaps interativos e colaborativos',
    'Métricas e KPIs em tempo real',
    'Gestão de backlog e features',
    'Colaboração em tempo real'
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
              14 dias grátis
            </Badge>
            <h1 className="text-2xl font-semibold text-white">
              Crie sua conta
            </h1>
            <p className="text-gray-400 mt-2">
              Comece agora mesmo a transformar suas ideias em produtos de sucesso
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Nome completo</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="bg-[#1a2744] border-[#2a3754] text-white placeholder-gray-500 h-11"
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email profissional</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="bg-[#1a2744] border-[#2a3754] text-white placeholder-gray-500 h-11"
                placeholder="Seu melhor email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Senha</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                className="bg-[#1a2744] border-[#2a3754] text-white placeholder-gray-500 h-11"
                placeholder="Escolha uma senha segura"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Confirme sua senha</label>
              <div className="relative">
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  className={cn(
                    "bg-[#1a2744] border-[#2a3754] text-white placeholder-gray-500 h-11 pr-10",
                    formData.confirmPassword && (
                      passwordsMatch 
                        ? "border-green-500 focus-visible:ring-green-500" 
                        : "border-red-500 focus-visible:ring-red-500"
                    )
                  )}
                  placeholder="Digite sua senha novamente"
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
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
              disabled={isLoading || !passwordsMatch}
            >
              {isLoading ? 'Criando conta...' : 'Criar conta gratuita'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Já tem uma conta?{' '}
              <Link
                href="/signin"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-auto pt-12 text-center">
          <p className="text-xs text-gray-500">
            Ao criar uma conta você concorda com nossos{' '}
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
            Transforme suas ideias em{' '}
            <span className="text-blue-400">produtos de sucesso</span>
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