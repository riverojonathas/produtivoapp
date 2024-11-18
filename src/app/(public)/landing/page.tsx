'use client';

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
  LineChart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LogoHorizontal } from '@/components/logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header/Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex flex-col items-start justify-center">
            <LogoHorizontal className="h-[42px]" />
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/signin"
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6"
            >
              <Link href="/signup">
                Começar Grátis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <Badge 
            variant="secondary" 
            className="mb-6 bg-blue-600/20 text-blue-400 px-4 py-1.5"
          >
            Gerencie produtos digitais com excelência
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Transforme ideias em
            <span className="text-blue-400"> produtos de sucesso</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Plataforma completa para Product Managers que querem criar, 
            priorizar e acompanhar a evolução dos seus produtos digitais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Link href="/signup" className="flex items-center gap-2">
                Começar Agora
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              <Link href="#features">
                Ver Recursos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-[#1a2744]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge 
              variant="secondary" 
              className="mb-4 bg-blue-950 text-blue-400"
            >
              Recursos
            </Badge>
            <h2 className="text-3xl font-bold text-white">
              Tudo que você precisa em um só lugar
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Package,
                title: 'Gestão de Produtos',
                description: 'Organize e acompanhe todos os seus produtos em um só lugar.',
                badge: 'Core'
              },
              {
                icon: Users,
                title: 'Personas',
                description: 'Crie e gerencie personas para entender melhor seus usuários.',
                badge: 'Discovery'
              },
              {
                icon: ListTodo,
                title: 'Features',
                description: 'Defina e organize as funcionalidades do seu produto.',
                badge: 'Planejamento'
              },
              {
                icon: Target,
                title: 'Priorização',
                description: 'Use frameworks como RICE e MoSCoW para priorizar features.',
                badge: 'Estratégia'
              },
              {
                icon: GitBranch,
                title: 'Roadmap',
                description: 'Visualize e planeje a evolução do seu produto.',
                badge: 'Timeline'
              },
              {
                icon: BarChart3,
                title: 'Métricas',
                description: 'Acompanhe KPIs e métricas importantes do produto.',
                badge: 'Analytics'
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-[#18181B] hover:shadow-lg transition-all duration-300 group cursor-pointer border-white/10"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <Badge variant="secondary" className="text-[10px] bg-[#27272A] text-gray-300">
                    {feature.badge}
                  </Badge>
                </div>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Section */}
      <section className="py-24 px-6 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge 
              variant="secondary" 
              className="mb-4 bg-blue-950 text-blue-400"
            >
              Frameworks
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-4">
              Metodologias comprovadas
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Use frameworks reconhecidos pelo mercado para tomar melhores decisões
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'RICE Score',
                description: 'Priorize features baseado em Reach, Impact, Confidence e Effort',
                metrics: ['Reach', 'Impact', 'Confidence', 'Effort']
              },
              {
                icon: Lightbulb,
                title: 'MoSCoW',
                description: 'Classifique features por Must, Should, Could e Won\'t have',
                metrics: ['Must', 'Should', 'Could', 'Won\'t']
              },
              {
                icon: LineChart,
                title: 'HEART',
                description: 'Meça o sucesso do produto com métricas centradas no usuário',
                metrics: ['Happiness', 'Engagement', 'Adoption', 'Retention']
              }
            ].map((framework, index) => (
              <Card
                key={index}
                className="p-6 bg-[#18181B] hover:shadow-lg transition-all duration-300 group cursor-pointer border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center">
                    <framework.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {framework.title}
                  </h3>
                </div>
                <p className="text-gray-400 mb-4">
                  {framework.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {framework.metrics.map((metric, i) => (
                    <Badge 
                      key={i}
                      variant="secondary" 
                      className="bg-[#27272A] text-gray-300"
                    >
                      {metric}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#1a2744]">
        <div className="max-w-7xl mx-auto text-center">
          <Badge 
            variant="secondary" 
            className="mb-6 bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
          >
            Comece Agora
          </Badge>
          <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
            Pronto para transformar seu produto?
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de Product Managers que já estão usando o Produtivo 
            para criar produtos de sucesso.
          </p>
          <Button
            size="lg"
            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Criar Conta Gratuita
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400">
            © 
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-white">
              Termos
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              Privacidade
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 