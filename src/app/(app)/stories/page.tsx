'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus,
  Search,
  Map,
  BookOpen,
  PlayCircle,
  AlertOctagon,
  CheckCircle2,
  LayoutGrid,
  List,
  TableIcon,
  KanbanIcon,
  Edit,
  MoreHorizontal,
  Trash2,
  Eye,
  X,
  FolderTree,
  BarChart3,
  ListChecks
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useStories } from '@/hooks/use-stories'
import { IUserStory, STORY_STATUS, StoryStatus } from '@/types/story'
import { toast } from 'sonner'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table"
import { StoryStatusSelect } from '@/components/stories/story-status-select'
import { useFeatures } from '@/hooks/use-features'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StoryFilters } from '@/components/stories/story-filters'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StoryMetrics } from '@/components/stories/story-metrics'
import { IFeature } from '@/types/feature'

type ViewMode = 'grid' | 'list' | 'table' | 'kanban' | 'grouped'

// Interface para os filtros
interface StoryFilters {
  status: string[]
  points: number[]
  dateRange: string
  features: string[]
  hasAcceptanceCriteria: boolean | null
}

export default function StoriesPage() {
  const router = useRouter()
  const { stories = [], isLoading, deleteStory, updateStory } = useStories()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const { features = [] } = useFeatures()
  const [filters, setFilters] = useState<StoryFilters>({
    status: [],
    points: [],
    dateRange: 'all',
    features: [],
    hasAcceptanceCriteria: null
  })
  const [showMetrics, setShowMetrics] = useState(false)

  // Métricas rápidas
  const items = [
    {
      icon: BookOpen,
      label: 'Abertas',
      value: stories.filter(s => s.status === 'open').length || 0,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/8 dark:bg-gray-500/10'
    },
    {
      icon: PlayCircle,
      label: 'Em Progresso',
      value: stories.filter(s => s.status === 'in-progress').length || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10'
    },
    {
      icon: AlertOctagon,
      label: 'Bloqueadas',
      value: stories.filter(s => s.status === 'blocked').length || 0,
      color: 'text-red-500',
      bgColor: 'bg-red-500/8 dark:bg-red-500/10'
    },
    {
      icon: CheckCircle2,
      label: 'Concluídas',
      value: stories.filter(s => s.status === 'completed').length || 0,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8 dark:bg-emerald-500/10'
    }
  ]

  const filteredStories = stories.filter(story => {
    // Filtro de busca
    const matchesSearch = 
      story.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description?.asA?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description?.iWant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description?.soThat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false

    if (!matchesSearch) return false

    // Filtro de status
    if (filters.status.length > 0 && !filters.status.includes(story.status)) {
      return false
    }

    // Filtro de pontos
    if (filters.points.length > 0 && !filters.points.includes(story.points)) {
      return false
    }

    // Filtro de feature
    if (filters.features.length > 0 && !filters.features.includes(story.feature_id)) {
      return false
    }

    // Filtro de data
    if (filters.dateRange !== 'all') {
      const storyDate = new Date(story.created_at)
      const daysAgo = subDays(new Date(), parseInt(filters.dateRange))
      if (storyDate < daysAgo) return false
    }

    // Filtro de critérios de aceitação
    if (filters.hasAcceptanceCriteria !== null) {
      const hasCriteria = (story.acceptanceCriteria?.length || 0) > 0
      if (hasCriteria !== filters.hasAcceptanceCriteria) return false
    }

    return true
  })

  const handleDeleteStory = async (id: string) => {
    try {
      await deleteStory.mutateAsync(id)
      toast.success('História excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir história:', error)
      toast.error('Erro ao excluir história')
    }
  }

  const renderStoryCard = (story: IUserStory) => (
    <Card
      key={story.id}
      className="group p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => router.push(`/stories/${story.id}`)}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{story.title}</h3>
              {story.time_tracking?.logged_hours && (
                <Badge variant="secondary" className={cn(
                  "text-xs",
                  story.time_tracking.logged_hours > (story.estimated_hours || 0) && "bg-red-100 text-red-700"
                )}>
                  {story.time_tracking.logged_hours.toFixed(1)}h
                </Badge>
              )}
            </div>
            <div className="mt-2 space-y-1 text-xs text-[var(--color-text-secondary)]">
              {story.description?.asA && <p>Como {story.description.asA},</p>}
              {story.description?.iWant && <p>Eu quero {story.description.iWant},</p>}
              {story.description?.soThat && <p>Para que {story.description.soThat}</p>}
            </div>
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
                    onClick={() => router.push(`/stories/${story.id}`)}
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
                      router.push(`/stories/${story.id}/edit`)
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom"
                  className="bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                >
                  <p className="text-xs">Editar história</p>
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
                    router.push(`/stories/new?duplicate=${story.id}`)
                  }}
                >
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteStory(story.id)
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Status, Pontos e Data */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-2">
            <StoryStatusSelect
              status={story.status}
              onStatusChange={async (newStatus) => {
                await updateStory.mutateAsync({
                  id: story.id,
                  data: { status: newStatus }
                })
                toast.success('Status atualizado com sucesso')
              }}
              size="sm"
            />
            <Badge variant="secondary">
              {story.points} {story.points === 1 ? 'ponto' : 'pontos'}
            </Badge>
            {story.deadline && (
              <Badge variant={
                new Date(story.deadline) < new Date() 
                  ? "destructive" 
                  : "secondary"
              }>
                {format(new Date(story.deadline), "dd MMM, yy", { locale: ptBR })}
              </Badge>
            )}
          </div>
          <span>
            {format(new Date(story.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
        </div>

        {/* Critérios de Aceitação */}
        {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
          <div className="pt-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              <span className="text-xs text-[var(--color-text-secondary)]">
                {story.acceptanceCriteria.length} critérios
              </span>
            </div>
            <div className="space-y-1">
              {story.acceptanceCriteria.slice(0, 2).map((criteria: string, index: number) => (
                <p key={index} className="text-xs text-[var(--color-text-secondary)] truncate">
                  • {criteria}
                </p>
              ))}
              {story.acceptanceCriteria.length > 2 && (
                <p className="text-xs text-[var(--color-text-secondary)]">
                  +{story.acceptanceCriteria.length - 2} critérios
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )

  const renderStoryTable = (stories: IUserStory[]) => (
    <div className="border border-[var(--color-border)] rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pontos</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map(story => (
            <TableRow 
              key={story.id} 
              className="cursor-pointer hover:bg-[var(--color-background-subtle)]"
              onClick={() => router.push(`/stories/${story.id}`)}
            >
              <TableCell>
                <div className="max-w-[300px]">
                  <div className="font-medium truncate">
                    {story.title}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StoryStatusSelect
                  status={story.status}
                  onStatusChange={async (newStatus) => {
                    await updateStory.mutateAsync({
                      id: story.id,
                      data: { status: newStatus }
                    })
                    toast.success('Status atualizado com sucesso')
                  }}
                  size="sm"
                />
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {story.points} {story.points === 1 ? 'ponto' : 'pontos'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="max-w-[300px] text-xs text-[var(--color-text-secondary)]">
                  <p>Como {story.description.asA},</p>
                  <p>Eu quero {story.description.iWant},</p>
                  <p>Para que {story.description.soThat}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {format(new Date(story.created_at), "dd MMM, yy", { locale: ptBR })}
                </span>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
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
                            router.push(`/stories/${story.id}/edit`)
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="bottom"
                        className="bg-[var(--color-background-primary)] border border-[var(--color-border)]"
                      >
                        <p className="text-xs">Editar história</p>
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
                        onClick={() => router.push(`/stories/new?duplicate=${story.id}`)}
                      >
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteStory(story.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  const renderStoryKanban = (stories: IUserStory[]) => {
    // Calcular métricas por coluna
    const getColumnMetrics = (status: StoryStatus) => {
      const storiesInColumn = stories.filter(s => s.status === status)
      const totalPoints = storiesInColumn.reduce((acc, story) => acc + story.points, 0)
      return {
        count: storiesInColumn.length,
        points: totalPoints
      }
    }

    return (
      <div className="grid grid-cols-4 gap-4 h-full">
        {Object.entries(STORY_STATUS).map(([status, config]) => {
          const metrics = getColumnMetrics(status as StoryStatus)
          
          return (
            <div key={status} className="flex flex-col h-full">
              {/* Cabeçalho da Coluna Melhorado */}
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <config.icon className={cn(
                    "w-3.5 h-3.5",
                    config.color.replace('bg-', 'text-').replace('-100', '-500')
                  )} />
                  <Badge variant="secondary" className={cn("text-xs", config.color)}>
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <span>{metrics.count} {metrics.count === 1 ? 'história' : 'histórias'}</span>
                  <span>•</span>
                  <span>{metrics.points} {metrics.points === 1 ? 'ponto' : 'pontos'}</span>
                </div>
              </div>

              {/* Área de Drop com Feedback Visual */}
              <div 
                className={cn(
                  "flex-1 bg-[var(--color-background-subtle)] rounded-lg p-2 space-y-2 overflow-auto transition-all",
                  "border-2 border-transparent",
                  "hover:border-[var(--color-border)]",
                  "focus:border-[var(--color-primary)]"
                )}
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add('border-[var(--color-primary)]', 'bg-[var(--color-background-elevated)]')
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-[var(--color-primary)]', 'bg-[var(--color-background-elevated)]')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove('border-[var(--color-primary)]', 'bg-[var(--color-background-elevated)]')
                  const storyId = e.dataTransfer.getData('story_id')
                  if (storyId) {
                    updateStory.mutateAsync({
                      id: storyId,
                      data: { status: status as StoryStatus }
                    }).then(() => {
                      toast.success('Status atualizado com sucesso')
                    }).catch(() => {
                      toast.error('Erro ao atualizar status')
                    })
                  }
                }}
              >
                {stories
                  .filter(s => s.status === status)
                  .map(story => (
                    <div
                      key={story.id}
                      className={cn(
                        "p-3 cursor-move bg-[var(--color-background-primary)] rounded-lg",
                        "hover:shadow-md transition-all duration-200",
                        "border border-[var(--color-border)]",
                        "hover:border-[var(--color-primary)]"
                      )}
                      onClick={() => router.push(`/stories/${story.id}`)}
                      draggable="true"
                      onDragStart={(e) => {
                        e.dataTransfer.setData('story_id', story.id)
                        e.currentTarget.classList.add('opacity-50', 'scale-95')
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove('opacity-50', 'scale-95')
                      }}
                    >
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium truncate">
                          {story.title}
                        </h3>
                        <div className="text-xs text-[var(--color-text-secondary)] line-clamp-3">
                          <p>Como {story.description.asA},</p>
                          <p>Eu quero {story.description.iWant},</p>
                          <p>Para que {story.description.soThat}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="secondary">
                            {story.points} {story.points === 1 ? 'ponto' : 'pontos'}
                          </Badge>
                          <span className="text-[var(--color-text-secondary)]">
                            {format(new Date(story.created_at), "dd MMM, yy", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Placeholder melhorado */}
                {stories.filter(s => s.status === status).length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-[var(--color-text-secondary)] border-2 border-dashed border-[var(--color-border)] rounded-lg">
                    <config.icon className="w-5 h-5 mb-2 opacity-50" />
                    <p className="text-xs">Solte uma história aqui</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderStoriesByFeature = (stories: IUserStory[]) => {
    // Agrupar histórias por feature
    const groupedStories = stories.reduce((groups, story) => {
      const feature = features.find(f => f.id === story.feature_id)
      if (!groups[story.feature_id]) {
        groups[story.feature_id] = {
          feature,
          stories: []
        }
      }
      groups[story.feature_id].stories.push(story)
      return groups
    }, {} as Record<string, { feature: IFeature | undefined, stories: IUserStory[] }>)

    return Object.entries(groupedStories).map(([featureId, group]) => (
      <div key={featureId} className="space-y-3">
        {/* Cabeçalho da Feature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">
              {group.feature?.title || 'Feature não encontrada'}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {group.stories.length} {group.stories.length === 1 ? 'história' : 'histórias'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/features/${featureId}`)}
            className="h-7"
          >
            <Eye className="w-3.5 h-3.5 mr-2" />
            Ver Feature
          </Button>
        </div>

        {/* Lista de Histórias da Feature */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {group.stories.map(renderStoryCard)}
        </div>
      </div>
    ))
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Histórias
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {stories.length}
                </span>
              </div>

              <Button 
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                onClick={() => router.push('/stories/new')}
                title="Nova História"
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

          {/* Lado Direito */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar histórias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm bg-[var(--color-background-elevated)] border-[var(--color-border)] w-[200px]"
              />
            </div>

            <StoryFilters 
              onFiltersChange={(newFilters: StoryFilters) => {
                setFilters(prev => ({
                  ...prev,
                  ...newFilters
                }))
              }}
              features={features}
            />

            <Select
              value={selectedFeature || 'all'}
              onValueChange={(value) => setSelectedFeature(value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-[200px] h-8 text-sm">
                <SelectValue placeholder="Todas as features" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as features</SelectItem>
                {features.map(feature => (
                  <SelectItem key={feature.id} value={feature.id}>
                    {feature.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Visualizações */}
            <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-3">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grouped')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'grouped' && "text-[var(--color-text-primary)]"
                )}
              >
                <FolderTree className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {selectedFeature && (
        <div className="bg-[var(--color-background-subtle)] border-b border-[var(--color-border)]">
          <div className="h-10 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Histórias da feature:
              </span>
              <span className="text-sm font-medium">
                {features.find(f => f.id === selectedFeature)?.title}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFeature(null)}
              className="h-7"
            >
              <X className="w-3.5 h-3.5 mr-2" />
              Limpar filtro
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Histórias */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-secondary)]">Carregando...</div>
          </div>
        ) : stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4 p-4 rounded-full bg-[var(--color-background-subtle)]">
              <BookOpen className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Nenhuma história cadastrada
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-[500px]">
              Histórias de usuário ajudam a descrever funcionalidades do ponto de vista do usuário. 
              Comece criando sua primeira história.
            </p>
            <Button
              onClick={() => router.push('/stories/new')}
              className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira História
            </Button>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              {searchTerm ? 'Nenhuma história encontrada' : 'Nenhuma história cadastrada'}
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando uma nova história'}
            </p>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'table' || viewMode === 'kanban' ? 'w-full' : 'gap-4',
            viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
            viewMode === 'list' ? "space-y-3" : 
            viewMode === 'grouped' ? "space-y-8" : '',
            viewMode === 'kanban' && "h-[calc(100vh-8rem)]"
          )}>
            {viewMode === 'table' 
              ? renderStoryTable(filteredStories)
              : viewMode === 'kanban'
              ? renderStoryKanban(filteredStories)
              : viewMode === 'grouped'
              ? renderStoriesByFeature(filteredStories)
              : filteredStories.map(renderStoryCard)}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowMetrics(true)}
        className="h-8"
      >
        <BarChart3 className="w-3.5 h-3.5 mr-2" />
        Ver Métricas
      </Button>

      {/* Dialog de Métricas */}
      <Dialog open={showMetrics} onOpenChange={setShowMetrics}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Métricas das Histórias</DialogTitle>
          </DialogHeader>
          <StoryMetrics stories={stories} />
        </DialogContent>
      </Dialog>
    </div>
  )
} 