'use client'

import { useState } from 'react'
import { useNotifications } from '@/hooks/use-notifications'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Search,
  Calendar,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente'
} as const

export default function AlertsPage() {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications()
  const [searchTerm, setSearchTerm] = useState('')

  const getAlertIcon = (type: string) => {
    const iconClass = "w-4 h-4"
    switch (type) {
      case 'info': return <Info className={cn(iconClass, "text-blue-500")} />
      case 'warning': return <AlertTriangle className={cn(iconClass, "text-yellow-500")} />
      case 'error': return <XCircle className={cn(iconClass, "text-red-500")} />
      case 'success': return <CheckCircle2 className={cn(iconClass, "text-green-500")} />
      default: return <Info className={cn(iconClass, "text-blue-500")} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'medium': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'high': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'urgent': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead.mutateAsync(notificationId)
      toast.success('Alerta marcado como lido')
    } catch (error) {
      console.error('Erro ao marcar alerta como lido:', error)
      toast.error('Erro ao marcar alerta como lido')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync()
      toast.success('Todos os alertas marcados como lidos')
    } catch (error) {
      console.error('Erro ao marcar todos alertas como lidos:', error)
      toast.error('Erro ao marcar todos alertas como lidos')
    }
  }

  const filteredNotifications = notifications?.filter(notification => 
    notification.alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const hasUnreadNotifications = notifications?.some(n => !n.read)

  return (
    <div className="h-full flex flex-col">
      {/* Header mais suave */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-[var(--color-text-primary)]">
            Alertas e Notificações
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gerencie seus alertas e notificações
          </p>
        </div>
        {hasUnreadNotifications && (
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="bg-[var(--color-background-primary)] hover:bg-[var(--color-background-hover)]"
          >
            Marcar todos como lidos
          </Button>
        )}
      </div>

      {/* Busca com fundo suave */}
      <div className="mb-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar alertas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-[var(--color-background-primary)] border-[var(--color-border)]"
          />
        </div>
      </div>

      {/* Lista com cards mais suaves */}
      <div className="flex-1 overflow-auto space-y-3">
        {/* ... loading e empty states ... */}
        {filteredNotifications?.map((notification) => (
          <Card 
            key={notification.id} 
            className={cn(
              "bg-[var(--color-background-primary)] border-[var(--color-border)] transition-all duration-200",
              "hover:shadow-lg hover:scale-[1.01]",
              !notification.read && "border-l-2 border-l-[var(--color-primary)]"
            )}
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(notification.alert.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
                      {notification.alert.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                      {notification.alert.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={cn("text-[10px] px-1.5 py-0.5 font-medium border", getPriorityColor(notification.alert.priority))}>
                      {PRIORITY_LABELS[notification.alert.priority as keyof typeof PRIORITY_LABELS]}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)]">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(notification.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                  </div>
                  
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markAsRead.isPending}
                      className="ml-auto text-xs h-7 px-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    >
                      Marcar como lido
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 