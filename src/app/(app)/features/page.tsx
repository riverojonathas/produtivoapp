'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Clock,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TableIcon,
  KanbanIcon,
  BookOpen,
  BarChart3,
  InboxIcon,
  PlayCircle,
  AlertOctagon,
  ListTodo
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useFeatures } from '@/hooks/use-features'
import { IFeature } from '@/types/feature'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { ProductFilters } from '@/components/products/product-filters'
import { subDays } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableColumnsConfig, TableColumn } from '@/components/features/table-columns-config'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { FeatureStatusSelect } from '@/components/features/feature-status-select'
import { FEATURE_STATUS, FeatureStatus } from '@/types/feature'
import { FeaturePrioritySelect } from '@/components/features/feature-priority-select'
import { FEATURE_PRIORITY, FeaturePriority } from '@/types/feature'

type ViewMode = 'grid' | 'list' | 'table' | 'kanban'

// Interface para os filtros
interface FeatureFilters {
  status: FeatureStatus[]
  dateRange: string
  priority: FeaturePriority[]
  hasDescription: boolean | null
  hasStories: boolean | null
  product: string | null
}

export default function FeaturesPage() {
  const { features = [], isLoading, deleteFeature, updateFeature } = useFeatures()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const router = useRouter()
  const [filters, setFilters] = useState<FeatureFilters>({
    status: [],
    dateRange: 'all',
    priority: [],
    hasDescription: null,
    hasStories: null,
    product: null
  })

  // Substituir useLocalStorage por useUserPreferences
  const { 
    preferences: tableColumns, 
    updatePreferences: setTableColumns 
  } = useUserPreferences<TableColumn[]>(
    'feature-table-columns',
    [
      { id: 'title', label: 'Título', visible: true },
      { id: 'status', label: 'Status', visible: true },
      { id: 'priority', label: 'Prioridade', visible: true },
      { id: 'user_stories', label: 'Histórias', visible: true },
      { id: 'progress', label: 'Progresso', visible: true },
      { id: 'date', label: 'Data', visible: true },
      { id: 'actions', label: 'Ações', visible: true }
    ]
  )

  // Métricas rápidas
  const items = [
    {
      icon: InboxIcon,
      label: 'Backlog',
      value: features.filter(f => f.status === 'backlog').length || 0,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/8 dark:bg-gray-500/10'
    },
    {
      icon: PlayCircle,
      label: 'Em Progresso',
      value: features.filter(f => f.status === 'doing').length || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10'
    },
    {
      icon: AlertOctagon,
      label: 'Bloqueadas',
      value: features.filter(f => f.status === 'blocked').length || 0,
      color: 'text-red-500',
      bgColor: 'bg-red-500/8 dark:bg-red-500/10'
    },
    {
      icon: CheckCircle2,
      label: 'Concluídas',
      value: features.filter(f => f.status === 'done').length || 0,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8 dark:bg-emerald-500/10'
    }
  ]

  const filteredFeatures = features.filter(feature => {
    // Filtro de busca
    const matchesSearch = 
      feature.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description?.what?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    if (!matchesSearch) return false

    // Filtro de status
    if (filters.status.length > 0 && !filters.status.includes(feature.status as FeatureStatus)) {
      return false
    }

    // Filtro de data
    if (filters.dateRange !== 'all' && feature.created_at) {
      const featureDate = new Date(feature.created_at)
      const daysAgo = subDays(new Date(), parseInt(filters.dateRange))
      if (featureDate < daysAgo) return false
    }

    // Filtro de prioridade
    if (filters.priority.length > 0 && !filters.priority.includes(feature.priority as FeaturePriority)) {
      return false
    }

    // Filtro de descrição
    if (filters.hasDescription !== null) {
      const hasDescription = !!feature.description
      if (hasDescription !== filters.hasDescription) return false
    }

    // Filtro de histórias
    if (filters.hasStories !== null) {
      const hasStories = (feature.user_stories?.length || 0) > 0
      if (hasStories !== filters.hasStories) return false
    }

    // Filtro de produto
    if (filters.product && feature.product_id !== filters.product) {
      return false
    }

    return true
  })

  const handleDeleteFeature = async (id: string) => {
    try {
      await deleteFeature.mutateAsync(id)
      toast.success('Feature excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir feature:', error)
      toast.error('Erro ao excluir feature')
    }
  }

  const renderFeatureCard = (feature: IFeature) => (
    <Card
      key={feature.id}
      className="group p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => router.push(`/features/${feature.id}`)}>
            <h3 className="text-sm font-medium">{feature.title}</h3>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2">
              {feature.description?.what || 'Sem descrição'}
            </p>
          </div>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => router.push(`/features/${feature.id}`)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom"
                  className="bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                >
                  <p className="text-xs">Visualizar detalhes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/features/${feature.id}/edit`)
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom"
                  className="bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                >
                  <p className="text-xs">Editar feature</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom"
                    className="bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                  >
                    <p className="text-xs">Mais ações</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/features/new?duplicate=${feature.id}`)
                  }}
                >
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteFeature(feature.id)
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Status e Prioridade */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-2">
            <FeatureStatusSelect
              status={feature.status}
              onStatusChange={async (newStatus) => {
                await updateFeature.mutateAsync({
                  id: feature.id,
                  data: { status: newStatus }
                })
                toast.success('Status atualizado com sucesso')
              }}
              size="sm"
            />
            <FeaturePrioritySelect
              priority={feature.priority}
              onPriorityChange={async (newPriority) => {
                await updateFeature.mutateAsync({
                  id: feature.id,
                  data: { priority: newPriority }
                })
                toast.success('Prioridade atualizada com sucesso')
              }}
              size="sm"
            />
          </div>
          <span>
            {format(new Date(feature.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
        </div>
      </div>
    </Card>
  )

  const renderFeatureTable = (features: IFeature[]) => (
    <div className="border border-[var(--color-border)] rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {tableColumns?.map(column => column.visible && (
              <TableHead key={column.id}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map(feature => (
            <TableRow 
              key={feature.id} 
              className="cursor-pointer hover:bg-[var(--color-background-subtle)]"
              onClick={() => router.push(`/features/${feature.id}`)}
            >
              {tableColumns?.map(column => {
                if (!column.visible) return null

                switch (column.id) {
                  case 'title':
                    return (
                      <TableCell key={column.id}>
                        <div className="max-w-[300px]">
                          <div className="font-medium truncate">
                            {feature.title}
                          </div>
                          {feature.description?.what && (
                            <div className="text-xs text-[var(--color-text-secondary)] truncate">
                              {feature.description.what}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    )
                  case 'status':
                    return (
                      <TableCell key={column.id}>
                        <FeatureStatusSelect
                          status={feature.status}
                          onStatusChange={async (newStatus) => {
                            await updateFeature.mutateAsync({
                              id: feature.id,
                              data: { status: newStatus }
                            })
                            toast.success('Status atualizado com sucesso')
                          }}
                          size="sm"
                        />
                      </TableCell>
                    )
                  case 'priority':
                    return (
                      <TableCell key={column.id}>
                        <FeaturePrioritySelect
                          priority={feature.priority}
                          onPriorityChange={async (newPriority) => {
                            await updateFeature.mutateAsync({
                              id: feature.id,
                              data: { priority: newPriority }
                            })
                            toast.success('Prioridade atualizada com sucesso')
                          }}
                          size="sm"
                        />
                      </TableCell>
                    )
                  case 'user_stories':
                    return (
                      <TableCell key={column.id}>
                        <span className="text-sm">
                          {feature.user_stories?.length || 0}
                        </span>
                      </TableCell>
                    )
                  case 'progress':
                    return (
                      <TableCell key={column.id}>
                        {feature.progress !== undefined && (
                          <div className="w-[100px] space-y-1">
                            <div className="text-xs text-[var(--color-text-secondary)]">
                              {feature.progress}%
                            </div>
                            <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[var(--color-primary)] transition-all duration-300"
                                style={{ width: `${feature.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </TableCell>
                    )
                  case 'date':
                    return (
                      <TableCell key={column.id}>
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {format(new Date(feature.created_at), "dd MMM, yy", { locale: ptBR })}
                        </span>
                      </TableCell>
                    )
                  case 'actions':
                    return (
                      <TableCell key={column.id} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/features/${feature.id}/edit`)
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent 
                                side="bottom"
                                className="bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                              >
                                <p className="text-xs">Editar feature</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DropdownMenu>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-3.5 w-3.5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent 
                                  side="bottom"
                                  className="bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                                >
                                  <p className="text-xs">Mais ações</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem
                                onClick={() => router.push(`/features/new?duplicate=${feature.id}`)}
                              >
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteFeature(feature.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    )
                  default:
                    return null
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const renderFeatureKanban = (features: IFeature[]) => {
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      // Adicionar visual feedback
      const dropZone = e.currentTarget
      dropZone.classList.add('bg-[var(--color-background-elevated)]')
    }

    const handleDragLeave = (e: React.DragEvent) => {
      // Remover visual feedback
      const dropZone = e.currentTarget
      dropZone.classList.remove('bg-[var(--color-background-elevated)]')
    }

    const handleDrop = async (e: React.DragEvent, newStatus: FeatureStatus) => {
      e.preventDefault()
      // Remover visual feedback
      const dropZone = e.currentTarget
      dropZone.classList.remove('bg-[var(--color-background-elevated)]')

      const featureId = e.dataTransfer.getData('feature_id')
      if (!featureId) return

      try {
        await updateFeature.mutateAsync({
          id: featureId,
          data: { status: newStatus }
        })
        toast.success('Status atualizado com sucesso')
      } catch (error) {
        console.error('Erro ao atualizar status:', error)
        toast.error('Erro ao atualizar status')
      }
    }

    return (
      <div className="grid grid-cols-4 gap-4 h-full">
        {Object.entries(FEATURE_STATUS).map(([status, config]) => (
          <div key={status} className="flex flex-col h-full">
            {/* Cabeçalho da Coluna */}
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <config.icon className={cn(
                  "w-3.5 h-3.5",
                  config.color.replace('bg-', 'text-').replace('-100', '-500')
                )} />
                <Badge variant="secondary" className={cn("text-xs", config.color)}>
                  {config.label}
                </Badge>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {features.filter(f => f.status === status).length}
                </span>
              </div>
            </div>

            {/* Lista de Cards */}
            <div 
              className="flex-1 bg-[var(--color-background-subtle)] rounded-lg p-2 space-y-2 overflow-auto transition-colors"
              onDragOver={(e) => {
                e.preventDefault()
                e.currentTarget.classList.add('bg-[var(--color-background-elevated)]')
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('bg-[var(--color-background-elevated)]')
              }}
              onDrop={(e) => {
                e.preventDefault()
                e.currentTarget.classList.remove('bg-[var(--color-background-elevated)]')
                const featureId = e.dataTransfer.getData('feature_id')
                if (featureId) {
                  handleDrop(e, status as FeatureStatus)
                }
              }}
            >
              {features
                .filter(f => f.status === status)
                .map(feature => (
                  <div
                    key={feature.id}
                    className="p-3 cursor-move hover:shadow-md transition-all duration-200 bg-[var(--color-background-primary)] rounded-lg"
                    onClick={() => router.push(`/features/${feature.id}`)}
                    draggable="true"
                    onDragStart={(e) => {
                      e.dataTransfer.setData('feature_id', feature.id)
                      e.currentTarget.classList.add('opacity-50')
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove('opacity-50')
                    }}
                  >
                    <div className="space-y-2">
                      {/* Título e Descrição */}
                      <div>
                        <h3 className="text-sm font-medium truncate">
                          {feature.title}
                        </h3>
                        {feature.description?.what && (
                          <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mt-1">
                            {feature.description.what}
                          </p>
                        )}
                      </div>

                      {/* Métricas e Tags */}
                      <div className="flex items-center justify-between text-xs">
                        <FeaturePrioritySelect
                          priority={feature.priority}
                          onPriorityChange={async (newPriority) => {
                            await updateFeature.mutateAsync({
                              id: feature.id,
                              data: { priority: newPriority }
                            })
                            toast.success('Prioridade atualizada com sucesso')
                          }}
                          size="sm"
                        />

                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                          {feature.user_stories && feature.user_stories.length > 0 && (
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{feature.user_stories.length}</span>
                            </div>
                          )}
                          {feature.progress !== undefined && (
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />
                              <span>{feature.progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {features.filter(f => f.status === status).length === 0 && (
                <div className="flex items-center justify-center h-20 text-[var(--color-text-secondary)]">
                  <p className="text-xs">Solte uma feature aqui</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho Unificado */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo - Título, Botão Novo e Métricas */}
          <div className="flex items-center gap-6">
            {/* Título e Botão Novo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Features
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {features.length}
                </span>
              </div>

              <Button 
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                onClick={() => router.push('/features/new')}
                title="Nova Feature"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Separador Vertical */}
            <div className="h-4 w-px bg-[var(--color-border)]" />

            {/* Métricas Compactas */}
            <div className="flex items-center gap-4">
              {items.map((item, index) => (
                <TooltipProvider key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={cn(
                          "flex items-center gap-2",
                          index !== items.length - 1 && "border-r border-[var(--color-border)] pr-4"
                        )}
                      >
                        <div className={cn("p-1 rounded", item.bgColor)}>
                          <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                        </div>
                        <p className="text-sm font-medium">
                          {item.value}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom" 
                      align="center"
                      className="bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                    >
                      <p className="text-xs font-medium">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Lado Direito - Ferramentas */}
          <div className="flex items-center gap-3">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm bg-[var(--color-background-elevated)] border-[var(--color-border)] w-[200px]"
              />
            </div>

            {/* Filtros */}
            <ProductFilters 
              onFiltersChange={(newFilters) => {
                setFilters(prev => ({
                  ...prev,
                  status: newFilters.status.map(s => s as FeatureStatus),
                  dateRange: newFilters.dateRange,
                  priority: prev.priority,
                  hasDescription: prev.hasDescription,
                  hasStories: prev.hasStories,
                  product: prev.product
                }))
              }}
              filters={[
                {
                  type: 'multi-select',
                  label: 'Status',
                  key: 'status',
                  options: Object.entries(FEATURE_STATUS).map(([key, status]) => ({
                    label: status.label,
                    value: key
                  }))
                },
                {
                  type: 'multi-select',
                  label: 'Prioridade',
                  key: 'priority',
                  options: Object.entries(FEATURE_PRIORITY).map(([key, priority]) => ({
                    label: priority.label,
                    value: key
                  }))
                },
                {
                  type: 'boolean',
                  label: 'Tem Descrição',
                  key: 'hasDescription'
                },
                {
                  type: 'boolean',
                  label: 'Tem Histórias',
                  key: 'hasStories'
                }
              ]}
            />

            {/* Visualizações */}
            <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-3">
              {viewMode === 'table' && tableColumns && (
                <TableColumnsConfig
                  columns={tableColumns}
                  onChange={setTableColumns}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'grid' && "text-[var(--color-text-primary)]"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'list' && "text-[var(--color-text-primary)]"
                )}
              >
                <List className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'table' && "text-[var(--color-text-primary)]"
                )}
              >
                <TableIcon className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('kanban')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'kanban' && "text-[var(--color-text-primary)]"
                )}
              >
                <KanbanIcon className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Features */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-secondary)]">Carregando...</div>
          </div>
        ) : features.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4 p-4 rounded-full bg-[var(--color-background-subtle)]">
              <ListTodo className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Nenhuma feature cadastrada
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-[500px]">
              Features são funcionalidades que agregam valor ao seu produto. 
              Comece criando sua primeira feature.
            </p>
            <Button
              onClick={() => router.push('/features/new')}
              className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Feature
            </Button>
          </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              Nenhuma feature encontrada
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Tente buscar com outros termos
            </p>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'table' || viewMode === 'kanban' ? 'w-full' : 'gap-4',
            viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
            viewMode === 'list' ? "space-y-3" : '',
            viewMode === 'kanban' && "h-[calc(100vh-8rem)]"
          )}>
            {viewMode === 'table' 
              ? renderFeatureTable(filteredFeatures)
              : viewMode === 'kanban'
              ? renderFeatureKanban(filteredFeatures)
              : filteredFeatures.map(renderFeatureCard)}
          </div>
        )}
      </div>
    </div>
  )
} 