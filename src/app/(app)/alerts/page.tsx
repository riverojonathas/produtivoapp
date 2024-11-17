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

interface Alert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  created_at: string
}

export default function AlertsPage() {
  const { alerts, isLoading, markAsRead } = useNotifications()
  const [searchTerm, setSearchTerm] = useState('')

  const getAlertIcon = (type: Alert['type']) => {
    const iconClass = "w-4 h-4"
    switch (type) {
      case 'info': return <Info className={cn(iconClass, "text-blue-500")} />
      case 'warning': return <AlertTriangle className={cn(iconClass, "text-yellow-500")} />
      case 'error': return <XCircle className={cn(iconClass, "text-red-500")} />
      case 'success': return <CheckCircle2 className={cn(iconClass, "text-green-500")} />
      default: return <Info className={cn(iconClass, "text-blue-500")} />
    }
  }

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'medium': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'high': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'urgent': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const filteredAlerts = alerts?.filter((alert: Alert) => 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6">
      {/* Header Minimalista */}
      <div className="flex items-center justify-between pb-6 border-b border-[var(--color-border)]">
        <h1 className="text-xl font-medium text-[var(--color-text-primary)]">
          Alertas e Notificações
        </h1>
      </div>

      {/* Busca */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar alertas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-transparent"
          />
        </div>
      </div>

      {/* Lista de Alertas */}
      {isLoading ? (
        <div className="grid gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-[var(--color-background-subtle)] animate-pulse" />
          ))}
        </div>
      ) : filteredAlerts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertTriangle className="w-8 h-8 text-[var(--color-text-secondary)] mb-3" />
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Nenhum alerta encontrado
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            {searchTerm ? 'Tente buscar com outros termos' : 'Você não tem alertas no momento'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredAlerts?.map((alert: Alert) => (
            <Card 
              key={alert.id} 
              className={cn(
                "p-4 hover:bg-[var(--color-background-subtle)] transition-colors",
                !alert.read && "border-l-2 border-l-[var(--color-primary)]"
              )}
            >
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                        {alert.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn("text-[10px] px-1.5 py-0.5 font-medium border", getPriorityColor(alert.priority))}>
                        {alert.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)]">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(alert.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                    </div>
                    
                    {!alert.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead.mutate(alert.id)}
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
      )}
    </div>
  )
} 