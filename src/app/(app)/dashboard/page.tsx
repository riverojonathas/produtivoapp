'use client'

import { useProducts } from '@/hooks/use-products'
import { useFeatures } from '@/hooks/use-features'
import { usePersonas } from '@/hooks/use-personas'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Feature } from '@/types/product'
import {
  BarChart3,
  Users,
  Package,
  GitBranch,
  Plus,
  ArrowRight,
  Target
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { products } = useProducts()
  const { features } = useFeatures()
  const { personas } = usePersonas()

  // Calcular estatísticas
  const completedFeatures = features.filter((feature: Feature) => feature.status === 'done').length
  const totalFeatures = features.length
  const progress = totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Dashboard
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Visão geral do seu produto
        </p>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Produtos</p>
              <p className="text-2xl font-semibold">{products?.length || 0}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
          <Link href="/products" className="text-sm text-[var(--color-primary)] hover:underline inline-flex items-center gap-1">
            Ver produtos <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Features</p>
              <p className="text-2xl font-semibold">{features?.length || 0}</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <GitBranch className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
          <Link href="/features" className="text-sm text-[var(--color-primary)] hover:underline inline-flex items-center gap-1">
            Ver features <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Personas</p>
              <p className="text-2xl font-semibold">{personas?.length || 0}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-5 h-5 text-green-500 dark:text-green-400" />
            </div>
          </div>
          <Link href="/personas" className="text-sm text-[var(--color-primary)] hover:underline inline-flex items-center gap-1">
            Ver personas <ArrowRight className="w-4 h-4" />
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">Progresso</p>
              <p className="text-2xl font-semibold">{Math.round(progress)}%</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Target className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>
      </div>

      {/* Seções Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Features Recentes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Features Recentes</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/features">
                Ver todas
              </Link>
            </Button>
          </div>
          <div className="space-y-4">
            {features?.slice(0, 5).map(feature => (
              <div key={feature.id} className="flex items-center justify-between p-4 bg-[var(--color-background-elevated)] rounded-lg">
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {feature.status}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                  feature.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                  feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  {feature.priority}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Ações Rápidas */}
        <Card className="p-6">
          <h2 className="font-semibold mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/products/new">
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/features/new">
                <Plus className="w-4 h-4 mr-2" />
                Nova Feature
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/personas/new">
                <Plus className="w-4 h-4 mr-2" />
                Nova Persona
              </Link>
            </Button>
            <Button className="justify-start" variant="outline" asChild>
              <Link href="/roadmap">
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Roadmap
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 