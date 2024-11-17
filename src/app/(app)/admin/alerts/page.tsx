'use client'

import { useEffect } from 'react'
import { useAdmin } from '@/hooks/use-admin'
import { useAdminAlerts } from '@/hooks/use-admin-alerts'
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
  Calendar,
  Users
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type AlertType = 'all' | 'info' | 'warning' | 'error' | 'success'
type AlertStatus = 'all' | 'draft' | 'scheduled' | 'sent' | 'cancelled'

export default function AdminAlertsPage() {
  const { isAdmin, isLoading: isLoadingAdmin } = useAdmin()
  const { alerts, isLoading, cancelAlert } = useAdminAlerts()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<AlertType>('all')
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus>('all')
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingAdmin && !isAdmin) {
      router.push('/dashboard')
    }
  }, [isLoadingAdmin, isAdmin, router])

  if (isLoadingAdmin || !isAdmin) {
    return null
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      default: return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const filteredAlerts = alerts?.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || alert.type === selectedType
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Gerenciamento de Alertas
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Crie e gerencie alertas para todos os usuários
          </p>
        </div>
        <Button
          onClick={() => {/* Abrir modal de criação */}}
          className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Alerta
        </Button>
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
          onValueChange={(value: AlertType) => setSelectedType(value)}
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
          value={selectedStatus}
          onValueChange={(value: AlertStatus) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-[140px]">
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
          <Bell className="w-12 h-12 text-[var(--color-text-secondary)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
            Nenhum alerta encontrado
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {searchTerm ? 'Tente buscar com outros termos' : 'Nenhum alerta foi criado ainda'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts?.map((alert) => (
            <Card key={alert.id} className="p-4">
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
                      <Badge variant="secondary">
                        {alert.status}
                      </Badge>
                      <Badge variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {alert.target_type === 'all' ? 'Todos' : 'Específicos'}
                      </Badge>
                      {alert.scheduled_for && (
                        <Badge>
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(alert.scheduled_for), "dd/MM/yyyy HH:mm")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {alert.status === 'scheduled' && (
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelAlert.mutate(alert.id)}
                      >
                        Cancelar Agendamento
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 