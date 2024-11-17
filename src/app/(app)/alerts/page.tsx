'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Bell,
  Search,
  Plus,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  Settings2,
  Filter,
  Archive,
  Megaphone
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAlerts } from '@/hooks/use-alerts'
import { Badge } from '@/components/ui/badge'
import { CreateAlertDialog } from '@/components/alerts/create-alert-dialog'
import { AlertRulesDialog } from '@/components/alerts/alert-rules-dialog'

type AlertType = 'info' | 'warning' | 'error' | 'success'
type AlertCategory = 'story' | 'feature' | 'report' | 'announcement'
type AlertStatus = 'unread' | 'read' | 'archived'

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<AlertType | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus | 'all'>('all')
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)
  const { alerts, isLoading, markAsRead, archiveAlert } = useAlerts()

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
    }
  }

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'story':
        return <Clock className="w-4 h-4" />
      case 'feature':
        return <Settings2 className="w-4 h-4" />
      case 'report':
        return <Archive className="w-4 h-4" />
      case 'announcement':
        return <Megaphone className="w-4 h-4" />
    }
  }

  const filteredAlerts = alerts?.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || alert.type === selectedType
    const matchesCategory = selectedCategory === 'all' || alert.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus
    return matchesSearch && matchesType && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Alertas e Notificações
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gerencie seus alertas, comunicados e regras de notificação
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsRulesOpen(true)}
          >
            <Settings2 className="w-4 h-4 mr-2" />
            Regras
          </Button>
          <Button
            onClick={() => setIsCreateAlertOpen(true)}
            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Alerta
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar alertas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={selectedType}
          onValueChange={(value: AlertType | 'all') => setSelectedType(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="info">Informação</SelectItem>
            <SelectItem value="warning">Aviso</SelectItem>
            <SelectItem value="error">Erro</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedCategory}
          onValueChange={(value: AlertCategory | 'all') => setSelectedCategory(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="story">História</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="report">Relatório</SelectItem>
            <SelectItem value="announcement">Comunicado</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedStatus}
          onValueChange={(value: AlertStatus | 'all') => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="unread">Não lido</SelectItem>
            <SelectItem value="read">Lido</SelectItem>
            <SelectItem value="archived">Arquivado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Alertas */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-20 bg-[var(--color-background-secondary)] rounded" />
            </Card>
          ))}
        </div>
      ) : filteredAlerts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
            Nenhum alerta encontrado
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {searchTerm ? 'Tente buscar com outros termos' : 'Você não tem alertas no momento'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts?.map((alert) => (
            <Card
              key={alert.id}
              className={cn(
                "p-4 transition-colors",
                alert.status === 'unread' && "border-l-4 border-l-[var(--color-primary)]"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-[var(--color-text-primary)]">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {alert.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="shrink-0">
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(alert.category)}
                          {alert.category}
                        </span>
                      </Badge>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {format(new Date(alert.created_at), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  {alert.status === 'unread' && (
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                      >
                        Marcar como lido
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => archiveAlert(alert.id)}
                      >
                        Arquivar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateAlertDialog
        open={isCreateAlertOpen}
        onOpenChange={setIsCreateAlertOpen}
      />
      <AlertRulesDialog
        open={isRulesOpen}
        onOpenChange={setIsRulesOpen}
      />
    </div>
  )
} 