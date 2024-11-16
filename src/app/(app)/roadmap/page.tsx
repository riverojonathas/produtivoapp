'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Filter,
  Calendar,
  LayoutGrid,
  GanttChart,
  Share2,
  Download,
  Search,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRoadmap } from '@/hooks/use-roadmap'
import { TimelineView } from '@/components/roadmap'
import { AddFeatureDialog } from '@/components/roadmap/add-feature-dialog'
import { EditFeatureDialog } from '@/components/roadmap/edit-feature-dialog'
import { cn } from '@/lib/utils'
import { useCurrentProduct } from '@/hooks/use-current-product'

// Tipos
type ViewMode = 'timeline' | 'gantt'
type ZoomLevel = 'year' | 'month' | 'sprint' | 'week'
type FeatureStatus = 'planned' | 'in-progress' | 'completed' | 'blocked'
type FeaturePriority = 'low' | 'medium' | 'high' | 'urgent'

interface Feature {
  id: string
  title: string
  description: string
  status: FeatureStatus
  priority: FeaturePriority
  startDate: Date
  endDate: Date
  progress: number
  dependencies: string[]
  assignees: string[]
}

const zoomLabels = {
  year: 'Ano',
  month: 'Mês',
  sprint: 'Sprint',
  week: 'Semana'
} as const

export default function RoadmapPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | 'all'>('all')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)

  // Carregar produto atual
  const { data: currentProduct, isLoading: isLoadingProduct } = useCurrentProduct()
  
  // Carregar features do produto atual
  const { 
    data: features, 
    isLoading: isLoadingFeatures, 
    error, 
    updateFeatureStatus,
    deleteFeature 
  } = useRoadmap(currentProduct?.id)

  // Mostrar loading enquanto carrega o produto
  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
        Carregando produto...
      </div>
    )
  }

  // Verificar se tem produto selecionado
  if (!currentProduct) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
        Nenhum produto selecionado
      </div>
    )
  }

  // Debug log para verificar os dados
  useEffect(() => {
    console.log('Roadmap Data:', {
      features,
      isLoading: isLoadingFeatures,
      error,
      currentDate,
      statusFilter,
      searchTerm
    })
  }, [features, isLoadingFeatures, error, currentDate, statusFilter, searchTerm])

  // Função para navegar entre períodos
  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    
    switch (zoomLevel) {
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1))
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
        break
      case 'sprint':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 14 : -14))
        break
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
        break
    }
    
    setCurrentDate(newDate)
  }

  // Filtrar features apenas por status e busca (sem filtro de período)
  const filteredFeatures = features?.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || feature.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleFeatureStatusChange = async (id: string, status: Feature['status']) => {
    try {
      await updateFeatureStatus.mutateAsync({ id, status })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      console.error('Erro ao atualizar status:', errorMessage)
    }
  }

  const handleFeatureDelete = async (id: string) => {
    try {
      await deleteFeature.mutateAsync(id)
    } catch (err) {
      console.error('Erro ao excluir feature:', err)
    }
  }

  // Funções de zoom
  const handleZoomIn = () => {
    const levels: ZoomLevel[] = ['year', 'month', 'sprint', 'week']
    const currentIndex = levels.indexOf(zoomLevel)
    if (currentIndex < levels.length - 1) {
      setZoomLevel(levels[currentIndex + 1])
    }
  }

  const handleZoomOut = () => {
    const levels: ZoomLevel[] = ['year', 'month', 'sprint', 'week']
    const currentIndex = levels.indexOf(zoomLevel)
    if (currentIndex > 0) {
      setZoomLevel(levels[currentIndex - 1])
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Header Fixo */}
      <div className="shrink-0 bg-[var(--color-background-primary)] border-b border-[var(--color-border)] z-10">
        {/* Primeira linha: Título e ações principais */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Roadmap</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Planeje e acompanhe o desenvolvimento do seu produto
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              onClick={() => {}}
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">Compartilhar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              onClick={() => {}}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">Exportar</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
              className="h-8 px-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">Nova Feature</span>
            </Button>
          </div>
        </div>

        {/* Segunda linha: Controles e filtros */}
        <div className="px-6 py-2 border-t border-[var(--color-border)] bg-[var(--color-background-elevated)] flex items-center gap-3">
          {/* Busca */}
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
            <Input
              placeholder="Buscar features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          {/* Filtro de Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-8 px-3 group",
                  statusFilter !== 'all' && "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                )}
              >
                <Filter className="w-3.5 h-3.5 mr-1.5 group-hover:text-[var(--color-primary)]" />
                <span className="text-xs group-hover:text-[var(--color-primary)]">
                  {statusFilter === 'all' ? 'Status' : 
                   statusFilter === 'planned' ? 'Planejado' :
                   statusFilter === 'in-progress' ? 'Em Progresso' :
                   statusFilter === 'completed' ? 'Concluído' : 'Bloqueado'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] shadow-lg min-w-[160px]"
            >
              <DropdownMenuItem 
                onClick={() => setStatusFilter('all')}
                className={cn(
                  "text-xs py-2 px-3 flex items-center cursor-pointer transition-colors",
                  "hover:bg-[var(--color-background-secondary)]",
                  statusFilter === 'all' && "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--color-text-secondary)] mr-2" />
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('planned')}
                className={cn(
                  "text-xs py-2 px-3 flex items-center cursor-pointer transition-colors",
                  "hover:bg-[var(--color-background-secondary)]",
                  statusFilter === 'planned' && "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                Planejado
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('in-progress')}
                className={cn(
                  "text-xs py-2 px-3 flex items-center cursor-pointer transition-colors",
                  "hover:bg-[var(--color-background-secondary)]",
                  statusFilter === 'in-progress' && "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                Em Progresso
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('completed')}
                className={cn(
                  "text-xs py-2 px-3 flex items-center cursor-pointer transition-colors",
                  "hover:bg-[var(--color-background-secondary)]",
                  statusFilter === 'completed' && "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                Concluído
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStatusFilter('blocked')}
                className={cn(
                  "text-xs py-2 px-3 flex items-center cursor-pointer transition-colors",
                  "hover:bg-[var(--color-background-secondary)]",
                  statusFilter === 'blocked' && "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                )}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                Bloqueado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Separador */}
          <div className="h-4 w-px bg-[var(--color-border)]" />

          {/* Controles de Zoom e Navegação */}
          <div className="flex items-center gap-1.5">
            {/* Navegação */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTime('prev')}
              className="h-8 w-8 p-0"
              title="Período anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>

            {/* Seletor de Visualização */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 gap-1.5 group">
                  {zoomLevel === 'year' && <Calendar className="w-3.5 h-3.5 group-hover:text-[var(--color-primary)]" />}
                  {zoomLevel === 'month' && <CalendarDays className="w-3.5 h-3.5 group-hover:text-[var(--color-primary)]" />}
                  {zoomLevel === 'sprint' && <CalendarRange className="w-3.5 h-3.5 group-hover:text-[var(--color-primary)]" />}
                  {zoomLevel === 'week' && <CalendarClock className="w-3.5 h-3.5 group-hover:text-[var(--color-primary)]" />}
                  <span className="text-xs group-hover:text-[var(--color-primary)]">{zoomLabels[zoomLevel]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start"
                className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] shadow-lg min-w-[140px]"
              >
                <DropdownMenuItem 
                  onClick={() => setZoomLevel('year')}
                  className={cn(
                    "text-xs py-2 px-3 flex items-center cursor-pointer transition-colors",
                    "hover:bg-[var(--color-background-secondary)]",
                    zoomLevel === 'year' && "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                  )}
                >
                  <Calendar className="w-3.5 h-3.5 mr-2" />
                  Ano
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setZoomLevel('month')}
                  className={cn(
                    "text-xs py-2 px-3 flex items-center cursor-pointer transition-colors",
                    "hover:bg-[var(--color-background-secondary)]",
                    zoomLevel === 'month' && "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                  )}
                >
                  <CalendarDays className="w-3.5 h-3.5 mr-2" />
                  Mês
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setZoomLevel('sprint')}
                  className={cn(
                    "text-xs py-2 px-3 flex items-center cursor-pointer transition-colors",
                    "hover:bg-[var(--color-background-secondary)]",
                    zoomLevel === 'sprint' && "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                  )}
                >
                  <CalendarRange className="w-3.5 h-3.5 mr-2" />
                  Sprint
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setZoomLevel('week')}
                  className={cn(
                    "text-xs py-2 px-3 flex items-center cursor-pointer transition-colors",
                    "hover:bg-[var(--color-background-secondary)]",
                    zoomLevel === 'week' && "text-[var(--color-primary)] bg-[var(--color-primary-subtle)]"
                  )}
                >
                  <CalendarClock className="w-3.5 h-3.5 mr-2" />
                  Semana
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTime('next')}
              className="h-8 w-8 p-0"
              title="Próximo período"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>

            {/* Zoom */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoomLevel === 'week'}
              className="h-8 w-8 p-0 disabled:opacity-40"
              title="Aumentar zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoomLevel === 'year'}
              className="h-8 w-8 p-0 disabled:opacity-40"
              title="Diminuir zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Container do Timeline com Scroll */}
      <div className="flex-1 relative overflow-hidden">
        {isLoadingFeatures ? (
          <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
            Carregando roadmap...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            Erro ao carregar o roadmap: {error instanceof Error ? error.message : 'Erro desconhecido'}
          </div>
        ) : viewMode === 'timeline' ? (
          <TimelineView
            features={filteredFeatures || []}
            currentDate={currentDate}
            zoomLevel={zoomLevel}
            onFeatureClick={(feature) => {
              setSelectedFeature(feature)
            }}
            onFeatureStatusChange={handleFeatureStatusChange}
            onFeatureDelete={handleFeatureDelete}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
            Visualização Gantt em desenvolvimento
          </div>
        )}
      </div>

      {/* Diálogos */}
      <AddFeatureDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        existingFeatures={features || []}
        productId={currentProduct.id}
      />

      {selectedFeature && (
        <EditFeatureDialog
          open={!!selectedFeature}
          onOpenChange={(open) => !open && setSelectedFeature(null)}
          feature={selectedFeature}
          existingFeatures={features || []}
        />
      )}
    </div>
  )
} 