'use client';

import React from 'react'
import Link from 'next/link'
import { 
  RocketLaunchIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-primary)]">
      {/* Header/Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[var(--color-text-primary)]">
              Produtivo<span className="text-[var(--color-primary)]">.</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/signup"
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text-primary)] mb-6">
            Gerencie seus produtos com
            <span className="text-[var(--color-primary)]"> excelência</span>
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto">
            Plataforma completa para Product Managers que querem transformar ideias em produtos de sucesso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Começar Agora
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-background-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-elevated)] transition-colors"
            >
              Ver Recursos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-[var(--color-background-secondary)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] text-center mb-12">
            Tudo que você precisa em um só lugar
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <RocketLaunchIcon className="w-6 h-6" />,
                title: 'Roadmap Estratégico',
                description: 'Planeje e execute sua estratégia de produto com clareza e precisão.'
              },
              {
                icon: <ChartBarIcon className="w-6 h-6" />,
                title: 'Métricas e KPIs',
                description: 'Acompanhe o desempenho do seu produto em tempo real.'
              },
              {
                icon: <UserGroupIcon className="w-6 h-6" />,
                title: 'Feedback Loop',
                description: 'Mantenha-se conectado com seus usuários e stakeholders.'
              },
              {
                icon: <SparklesIcon className="w-6 h-6" />,
                title: 'Priorização Inteligente',
                description: 'Tome decisões baseadas em dados e impacto no negócio.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-[var(--color-background-elevated)] hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-light)] text-[var(--color-primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text-secondary)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-8">
            Junte-se a milhares de Product Managers que já estão transformando a maneira de gerir produtos.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            Criar Conta Gratuita
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[var(--color-text-secondary)]">
            © 2024 Produtivo. Todos os direitos reservados.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
              Termos
            </Link>
            <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
              Privacidade
            </Link>
            <Link href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
              Contato
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 