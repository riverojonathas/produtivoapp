'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowRightIcon,
  Package,
  Users,
  ListTodo,
  Target,
  GitBranch,
  BarChart3,
  Lightbulb,
  LineChart,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogoHorizontal } from '@/components/logo'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header Minimalista */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoHorizontal className="h-[42px]" inverted />
          <div className="flex items-center gap-4">
            <Link 
              href="/signin"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
            >
              <Link href="/signup">
                Começar Grátis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section Moderna */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge 
            variant="secondary" 
            className="mb-6 bg-blue-500/10 text-blue-400 px-4 py-1.5 border border-blue-500/20"
          >
            Gerencie produtos digitais com excelência
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Transforme ideias em
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"> produtos incríveis</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Uma plataforma completa para Product Managers que querem criar, 
            priorizar e acompanhar a evolução dos seus produtos digitais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 h-14"
            >
              <Link href="/signup" className="flex items-center gap-2">
                Começar Agora
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 rounded-full px-8 h-14"
            >
              <Link href="#features">
                Ver Recursos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Decisões Baseadas em Dados',
                description: 'Use frameworks comprovados como RICE e MoSCoW para tomar decisões estratégicas.',
                icon: BarChart3
              },
              {
                title: 'Visão Clara do Produto',
                description: 'Mantenha todos alinhados com roadmaps visuais e KPIs importantes.',
                icon: Target
              },
              {
                title: 'Priorização Eficiente',
                description: 'Priorize features de forma eficiente usando metodologias ágeis.',
                icon: GitBranch
              }
            ].map((benefit, index) => (
              <div key={index} className="p-6 rounded-2xl bg-slate-800/50 border border-white/5 hover:border-blue-500/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge 
              variant="secondary" 
              className="mb-4 bg-blue-500/10 text-blue-400 px-4 py-1.5 border border-blue-500/20"
            >
              Recursos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Uma suite completa de ferramentas para gerenciar seu produto digital
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Gestão de Produtos',
                description: 'Organize e acompanhe todos os seus produtos em um só lugar.',
                icon: Package,
                features: ['Visão geral do produto', 'Métricas importantes', 'Time do produto']
              },
              {
                title: 'User Stories',
                description: 'Crie e gerencie histórias de usuário de forma eficiente.',
                icon: Users,
                features: ['Templates prontos', 'Critérios de aceitação', 'Estimativas']
              },
              {
                title: 'Roadmap',
                description: 'Visualize e planeje a evolução do seu produto.',
                icon: GitBranch,
                features: ['Timeline interativa', 'Marcos importantes', 'Dependências']
              },
              {
                title: 'Priorização',
                description: 'Use frameworks modernos para priorizar features.',
                icon: Target,
                features: ['RICE Score', 'MoSCoW', 'Impact Mapping']
              },
              {
                title: 'Analytics',
                description: 'Acompanhe métricas e KPIs importantes.',
                icon: LineChart,
                features: ['Dashboard personalizável', 'Relatórios', 'Insights']
              },
              {
                title: 'Colaboração',
                description: 'Trabalhe em equipe de forma eficiente.',
                icon: Users,
                features: ['Comentários', 'Notificações', 'Compartilhamento']
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-slate-800/50 hover:bg-slate-700/50 border-white/5 hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para transformar seu produto?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Comece agora mesmo a usar o Produtivo e leve seu produto digital ao próximo nível.
          </p>
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 h-14"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Criar Conta Gratuita
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-8 px-6 border-t border-white/5 bg-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400">
            © 2024 Produtivo. Todos os direitos reservados.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Termos
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 