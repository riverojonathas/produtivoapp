'use client'

import { useState } from 'react'
import { useAdminAlerts } from '@/hooks/use-admin-alerts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AdminAlertsPage() {
  const { alerts, createAlert, scheduleAlert, cancelAlert } = useAdminAlerts()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    priority: 'medium' as const,
    targetType: 'all' as const,
    scheduledFor: null as Date | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (formData.scheduledFor) {
        await scheduleAlert.mutateAsync({
          ...formData,
          scheduledFor: formData.scheduledFor.toISOString()
        })
        toast.success('Alerta agendado com sucesso!')
      } else {
        await createAlert.mutateAsync(formData)
        toast.success('Alerta enviado com sucesso!')
      }
      setIsCreating(false)
      setFormData({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        targetType: 'all',
        scheduledFor: null
      })
    } catch (error) {
      toast.error('Erro ao criar alerta')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Alertas Administrativos</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Envie alertas para todos os usuários da plataforma
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          Novo Alerta
        </Button>
      </div>

      {isCreating ? (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Título do alerta"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />

            <Textarea
              placeholder="Mensagem do alerta"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              required
            />

            <div className="grid grid-cols-3 gap-4">
              <Select
                value={formData.type}
                onValueChange={(value: 'info' | 'warning' | 'error' | 'success') => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Informação</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>

              <DateTimePicker
                value={formData.scheduledFor}
                onChange={(date) => setFormData(prev => ({ ...prev, scheduledFor: date }))}
                placeholder="Agendar para"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {formData.scheduledFor ? 'Agendar' : 'Enviar Agora'}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts?.map((alert) => (
            <Card key={alert.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{alert.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {format(new Date(alert.created_at), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                    {alert.status === 'scheduled' && (
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        • Agendado para {format(new Date(alert.scheduled_for), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    )}
                  </div>
                </div>
                {alert.status === 'scheduled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelAlert.mutateAsync(alert.id)}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 