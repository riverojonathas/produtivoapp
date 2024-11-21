'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface DashboardPreferences {
  showWelcomeGuide: boolean
  completedSteps: string[]
  enabledWidgets: string[]
}

interface DashboardConfigProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preferences: DashboardPreferences | null
  onUpdatePreferences: (preferences: DashboardPreferences) => Promise<void>
}

const availableWidgets = [
  {
    id: 'quick-metrics',
    title: 'Métricas Rápidas',
    description: 'Resumo das principais métricas dos seus produtos'
  },
  {
    id: 'recent-activities',
    title: 'Atividades Recentes',
    description: 'Lista das últimas ações realizadas'
  },
  {
    id: 'product-insights',
    title: 'Insights dos Produtos',
    description: 'Sugestões e insights baseados nos seus produtos'
  },
  {
    id: 'priority-features',
    title: 'Features Prioritárias',
    description: 'Lista das features mais importantes'
  }
]

export function DashboardConfig({ 
  open, 
  onOpenChange, 
  preferences,
  onUpdatePreferences 
}: DashboardConfigProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleWidget = async (widgetId: string) => {
    if (!preferences) return

    try {
      setIsSubmitting(true)
      const currentWidgets = preferences.enabledWidgets || []
      const newWidgets = currentWidgets.includes(widgetId)
        ? currentWidgets.filter(id => id !== widgetId)
        : [...currentWidgets, widgetId]

      await onUpdatePreferences({
        ...preferences,
        enabledWidgets: newWidgets
      })
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleWelcomeGuide = async () => {
    if (!preferences) return

    try {
      setIsSubmitting(true)
      await onUpdatePreferences({
        ...preferences,
        showWelcomeGuide: !preferences.showWelcomeGuide,
        completedSteps: !preferences.showWelcomeGuide ? [] : preferences.completedSteps
      })
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações do Dashboard</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Guia de Boas-vindas */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Switch
                id="welcome-guide"
                checked={preferences?.showWelcomeGuide}
                onCheckedChange={toggleWelcomeGuide}
                disabled={isSubmitting}
              />
              <div className="space-y-1">
                <Label
                  htmlFor="welcome-guide"
                  className="text-sm font-medium leading-none"
                >
                  Guia de Boas-vindas
                </Label>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Mostrar o guia de boas-vindas no dashboard
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Widgets */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Widgets Visíveis</h3>
            <div className="space-y-4">
              {availableWidgets.map((widget) => (
                <div key={widget.id} className="flex items-start space-x-4">
                  <Switch
                    id={widget.id}
                    checked={preferences?.enabledWidgets?.includes(widget.id)}
                    onCheckedChange={() => toggleWidget(widget.id)}
                    disabled={isSubmitting}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor={widget.id}
                      className="text-sm font-medium leading-none"
                    >
                      {widget.title}
                    </Label>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {widget.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 