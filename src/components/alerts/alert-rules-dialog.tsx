'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Clock, Bell, Calendar, AlertTriangle } from 'lucide-react'

interface AlertRulesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type RuleType = 'deadline' | 'status_change' | 'weekly_report'

interface AlertRule {
  id: string
  name: string
  description: string
  type: RuleType
  conditions: {
    days_before?: number
    status?: string
    day_of_week?: number
    time?: string
  }
  actions: {
    alert_type: 'info' | 'warning' | 'error'
    message_template: string
  }
  is_active: boolean
}

const defaultRule = {
  name: '',
  description: '',
  type: 'deadline' as RuleType,
  conditions: {
    days_before: 3
  },
  actions: {
    alert_type: 'warning' as const,
    message_template: ''
  },
  is_active: true
}

export function AlertRulesDialog({ open, onOpenChange }: AlertRulesDialogProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState(defaultRule)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Implementar criação de regra
      toast.success('Regra criada com sucesso!')
      setFormData(defaultRule)
      setIsCreating(false)
    } catch (error) {
      toast.error('Erro ao criar regra')
    }
  }

  const getRuleIcon = (type: RuleType) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-4 h-4" />
      case 'status_change':
        return <Bell className="w-4 h-4" />
      case 'weekly_report':
        return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Regras de Alerta</DialogTitle>
        </DialogHeader>

        {isCreating ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nome da regra"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <Textarea
              placeholder="Descrição da regra"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />

            <Select
              value={formData.type}
              onValueChange={(value: RuleType) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de regra" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Prazo</SelectItem>
                <SelectItem value="status_change">Mudança de Status</SelectItem>
                <SelectItem value="weekly_report">Relatório Semanal</SelectItem>
              </SelectContent>
            </Select>

            {formData.type === 'deadline' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Dias antes do prazo</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.conditions.days_before}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions, days_before: parseInt(e.target.value) }
                  }))}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem do alerta</label>
              <Textarea
                value={formData.actions.message_template}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  actions: { ...prev.actions, message_template: e.target.value }
                }))}
                placeholder="Use {feature} para o nome da feature e {days} para o número de dias"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <span className="text-sm">Regra ativa</span>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar Regra
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={() => setIsCreating(true)}
              className="w-full"
            >
              Criar Nova Regra
            </Button>

            <div className="space-y-4">
              {/* Lista de regras existentes */}
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Alerta de Prazo</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Notificar 3 dias antes do prazo da feature
                      </p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Alerta de Status</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        Notificar quando uma feature ficar bloqueada
                      </p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 