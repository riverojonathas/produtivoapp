'use client'

import { useState } from 'react'
import { useAdminAlerts, PRIORITY_LABELS, STATUS_LABELS } from '@/hooks/use-admin-alerts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateAlertDialog } from '@/components/admin/create-alert-dialog'
import { DeleteAlertDialog } from '@/components/admin/delete-alert-dialog'
import { EditAlertDialog } from '@/components/admin/edit-alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Search,
  Calendar,
  Users,
  Trash2,
  Filter,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AdminAlert {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  target_type: 'all' | 'specific_users'
  created_at: string
}

type AlertType = 'info' | 'warning' | 'error' | 'success' | 'all'
type AlertStatus = 'draft' | 'scheduled' | 'sent' | 'cancelled' | 'all'

export default function AdminAlertsPage() {
  const { alerts, isLoading, cancelAlert, deleteAlert, updateAlert } = useAdminAlerts()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<AlertType>('all')
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus>('all')
  const [alertToDelete, setAlertToDelete] = useState<AdminAlert | null>(null)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      case 'scheduled': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'sent': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const filteredAlerts = alerts?.filter((alert: AdminAlert) => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || alert.type === selectedType
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleDeleteAlert = async () => {
    if (!alertToDelete) return

    try {
      await deleteAlert.mutateAsync(alertToDelete.id)
      toast.success('Alerta excluído com sucesso')
      setAlertToDelete(null)
    } catch (error) {
      console.error('Erro ao excluir alerta:', error)
      toast.error('Erro ao excluir alerta')
    }
  }

  const handleUpdateAlert = async (id: string, data: { status: string, scheduled_for?: string | null }) => {
    await updateAlert.mutateAsync({ id, data })
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-xl font-medium text-[var(--color-text-primary)]">
            Alertas
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gerencie todos os alertas do sistema
          </p>
        </div>
        <CreateAlertDialog />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar alertas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <Select
            value={selectedType}
            onValueChange={(value: AlertType) => setSelectedType(value)}
          >
            <SelectTrigger className="w-[130px] h-9">
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
            value={selectedStatus}
            onValueChange={(value: AlertStatus) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="sent">Enviado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
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
            {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando um novo alerta'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredAlerts?.map((alert) => (
            <Card key={alert.id} className="p-4 hover:bg-[var(--color-background-subtle)] transition-colors">
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
                        {PRIORITY_LABELS[alert.priority]}
                      </Badge>
                      <Badge className={cn("text-[10px] px-1.5 py-0.5 font-medium border", getStatusColor(alert.status))}>
                        {STATUS_LABELS[alert.status]}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)]">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(alert.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)]">
                      <Users className="w-3 h-3" />
                      {alert.target_type === 'all' ? 'Todos' : 'Específicos'}
                    </div>
                    
                    <div className="ml-auto flex items-center gap-2">
                      <EditAlertDialog
                        alert={alert}
                        onUpdateAlert={handleUpdateAlert}
                      />
                      {alert.status === 'scheduled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelAlert.mutate(alert.id)}
                          className="text-xs h-7 px-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        >
                          Cancelar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAlertToDelete(alert)}
                        className="text-xs h-7 px-2 text-[var(--color-error)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogo de confirmação */}
      <DeleteAlertDialog
        open={!!alertToDelete}
        onOpenChange={(open) => !open && setAlertToDelete(null)}
        onConfirm={handleDeleteAlert}
        title={alertToDelete?.title || ''}
      />
    </div>
  )
} 