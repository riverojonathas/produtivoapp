'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Users,
  Target,
  BarChart3,
  HelpCircle,
  Settings2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { WelcomeGuide } from '@/components/dashboard/welcome-guide'
import { ProductInsights } from '@/components/dashboard/product-insights'
import { UserGuideDialog } from '@/components/guide/user-guide-dialog'
import { DashboardConfig } from '@/components/dashboard/dashboard-config'
import { useUserPreferences } from '@/hooks/use-user-preferences'

interface DashboardPreferences {
  showWelcomeGuide: boolean
  completedSteps: string[]
  enabledWidgets: string[]
}

export default function DashboardPage() {
  const [showGuide, setShowGuide] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  // Preferências do usuário
  const { preferences, updatePreferences } = useUserPreferences<DashboardPreferences>(
    'dashboard-preferences',
    {
      showWelcomeGuide: true,
      completedSteps: [],
      enabledWidgets: [
        'quick-metrics',
        'recent-activities',
        'product-insights',
        'priority-features'
      ]
    }
  )

  // Métricas rápidas
  const metrics = [
    {
      icon: Target,
      label: 'Produtos Ativos',
      value: '12',
      change: '+2',
      trend: 'up',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8'
    },
    {
      icon: Calendar,
      label: 'Sprints Ativos',
      value: '3',
      change: '0',
      trend: 'neutral',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8'
    },
    {
      icon: Users,
      label: 'Time',
      value: '8',
      change: '+1',
      trend: 'up',
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8'
    },
    {
      icon: BarChart3,
      label: 'Métricas',
      value: '24',
      change: '+5',
      trend: 'up',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/8'
    }
  ]

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <h1 className="text-sm font-medium">Dashboard</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfig(true)}
              className="h-8"
            >
              <Settings2 className="w-3.5 h-3.5 mr-2" />
              Configurar Dashboard
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGuide(true)}
              className="h-8"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-2" />
              Guia do Usuário
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Rápidas */}
      {preferences?.enabledWidgets.includes('quick-metrics') && (
        <div className="grid grid-cols-4 gap-4 p-6">
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
      )}

      {/* Guia de Boas-vindas */}
      {preferences?.showWelcomeGuide && (
        <div className="px-6">
          <WelcomeGuide 
            completedSteps={preferences?.completedSteps || []}
            onStepComplete={async (stepId: string) => {
              const newSteps = [...(preferences?.completedSteps || []), stepId]
              await updatePreferences({
                ...preferences,
                completedSteps: newSteps
              })
            }}
            onHide={async () => {
              await updatePreferences({
                ...preferences,
                showWelcomeGuide: false
              })
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Coluna Principal */}
        <div className="col-span-2 space-y-6">
          {/* Widgets habilitados */}
          {preferences?.enabledWidgets.includes('recent-activities') && (
            <Card className="p-4">
              <h2 className="text-sm font-medium mb-4">Atividades Recentes</h2>
              {/* Conteúdo do widget */}
            </Card>
          )}

          {preferences?.enabledWidgets.includes('priority-features') && (
            <Card className="p-4">
              <h2 className="text-sm font-medium mb-4">Features Prioritárias</h2>
              {/* Conteúdo do widget */}
            </Card>
          )}
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Insights do Product Oversee */}
          {preferences?.enabledWidgets.includes('product-insights') && (
            <ProductInsights />
          )}
        </div>
      </div>

      {/* Dialog do Guia */}
      <UserGuideDialog 
        open={showGuide} 
        onOpenChange={setShowGuide} 
      />

      {/* Dialog de Configurações */}
      <DashboardConfig
        open={showConfig}
        onOpenChange={setShowConfig}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
      />
    </div>
  )
} 