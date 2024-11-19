'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Plus,
  Calendar,
  Users,
  Target,
  ArrowUp,
  BarChart3,
  Bell,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { WelcomeGuide } from '@/components/onboarding/welcome-guide'
import { ProductInsights } from '@/components/dashboard/product-insights'

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Métricas rápidas
  const metrics = [
    {
      label: 'Produtos Ativos',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: Target,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8'
    },
    {
      label: 'Sprints Ativos',
      value: '3',
      change: '0',
      trend: 'neutral',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8'
    },
    {
      label: 'Time',
      value: '8',
      change: '+1',
      trend: 'up',
      icon: Users,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8'
    },
    {
      label: 'Métricas',
      value: '24',
      change: '+5',
      trend: 'up',
      icon: BarChart3,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/8'
    }
  ]

  return (
    <div className="flex-1 space-y-6">
      {/* Cabeçalho Moderno */}
      <div className="flex flex-col gap-6">
        {/* Linha Superior */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Título e Data */}
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                Dashboard
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {format(new Date(), "EEEE',' dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>

            {/* Separador */}
            <div className="h-8 w-px bg-[var(--color-border)]" />

            {/* Ações Rápidas */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Novo Produto
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Nova Métrica
              </Button>
            </div>
          </div>

          {/* Notificações e Busca */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 w-[200px] bg-transparent"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 p-0"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </Button>
          </div>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.label} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {metric.label}
                  </p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold">
                      {metric.value}
                    </span>
                    {metric.change !== '0' && (
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          metric.trend === 'up' ? "text-emerald-500" : "text-red-500"
                        )}
                      >
                        {metric.change}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className={cn(
                  "p-2 rounded-lg",
                  metric.bgColor
                )}>
                  <metric.icon className={cn("w-5 h-5", metric.color)} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Guia de Boas-vindas */}
      <WelcomeGuide />

      <div className="grid grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="col-span-2 space-y-6">
          {/* Resto do conteúdo do dashboard */}
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Insights do Product Oversee */}
          <ProductInsights />
        </div>
      </div>
    </div>
  )
} 