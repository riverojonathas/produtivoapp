'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Plus, 
  Calendar,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  ZoomIn,
  ZoomOut,
  Share2,
  Download,
  Filter,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFeatures } from '@/hooks/use-features'
import { RoadmapTimeline } from '@/components/roadmap/roadmap-timeline'
import { RoadmapDependencies } from '@/components/roadmap/roadmap-dependencies'
import { AddFeatureDialog } from '@/components/roadmap/add-feature-dialog'
import { RoadmapExportDialog } from '@/components/roadmap/roadmap-export-dialog'
import { ZoomView } from '@/components/roadmap/zoom-view'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ViewMode = 'timeline' | 'dependencies' | 'zoom'
type ZoomLevel = 'year' | 'month' | 'sprint' | 'week'

export default function RoadmapPage() {
  const { features = [], isLoading } = useFeatures()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('timeline')
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month')
  const [currentDate] = useState(new Date())
  const [showAddFeature, setShowAddFeature] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const router = useRouter()

  // Métricas rápidas ajustadas - removido labels
  const items = [
    {
      icon: CheckCircle2,
      tooltip: 'Features Concluídas',
      value: features.filter(f => f.status === 'done').length,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8 dark:bg-emerald-500/10'
    },
    {
      icon: Clock,
      tooltip: 'Features em Progresso',
      value: features.filter(f => f.status === 'doing').length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10'
    },
    {
      icon: AlertTriangle,
      tooltip: 'Features Bloqueadas',
      value: features.filter(f => f.status === 'blocked').length,
      color: 'text-red-500',
      bgColor: 'bg-red-500/8 dark:bg-red-500/10'
    },
    {
      icon: Target,
      tooltip: 'Features Planejadas',
      value: features.filter(f => f.status === 'backlog').length,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8 dark:bg-violet-500/10'
    }
  ]

  const filteredFeatures = features.filter(feature => {
    // Filtro de busca
    const matchesSearch = 
      feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.what.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    // Filtro de status
    if (statusFilter.length > 0 && !statusFilter.includes(feature.status)) {
      return false
    }

    return true
  })

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

  const handleFeatureClick = (feature: any) => {
    router.push(`/features/${feature.id}`)
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-medium">Roadmap</h1>
              <Button
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white"
                onClick={() => setShowAddFeature(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="h-4 w-px bg-[var(--color-border)]" />

            <div className="flex items-center gap-4">
              {items.map((item, index) => (
                <TooltipProvider key={item.tooltip}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          index !== items.length - 1 && "border-r border-[var(--color-border)] pr-4"
                        )}
                      >
                        <div className={cn("p-1 rounded", item.bgColor)}>
                          <item.icon className={cn("w-3 h-3", item.color)} />
                        </div>
                        <span className="text-sm font-medium">
                          {item.value}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs font-medium">{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Lado Direito */}
          <div className="flex items-center gap-3">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 w-[200px]"
              />
            </div>

            {/* Filtros */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-8 px-2.5 text-xs",
                    statusFilter.length > 0 && "text-[var(--color-primary)]"
                  )}
                >
                  <Filter className="w-3.5 h-3.5 mr-2" />
                  Filtros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* ... itens de filtro ... */}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Visualizações */}
            <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('timeline')}
                      className={cn(
                        "h-8 w-8 p-0",
                        viewMode === 'timeline' && "text-[var(--color-primary)]"
                      )}
                    >
                      <CalendarRange className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Timeline</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">
                      Visualização em linha do tempo
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('dependencies')}
                      className={cn(
                        "h-8 w-8 p-0",
                        viewMode === 'dependencies' && "text-[var(--color-primary)]"
                      )}
                    >
                      <Target className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Dependências</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">
                      Visualização de dependências entre features
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode('zoom')}
                      className={cn(
                        "h-8 w-8 p-0",
                        viewMode === 'zoom' && "text-[var(--color-primary)]"
                      )}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Zoom</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">
                      Visualização com controle de zoom
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Zoom Controls */}
            {viewMode !== 'dependencies' && (
              <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomIn}
                        disabled={zoomLevel === 'week'}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Aumentar Zoom</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">
                        {zoomLevel === 'year' ? 'Mês' : 
                         zoomLevel === 'month' ? 'Sprint' : 
                         zoomLevel === 'sprint' ? 'Semana' : 'Máximo zoom'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomOut}
                        disabled={zoomLevel === 'year'}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p className="text-xs">Diminuir Zoom</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">
                        {zoomLevel === 'week' ? 'Sprint' : 
                         zoomLevel === 'sprint' ? 'Mês' : 
                         zoomLevel === 'month' ? 'Ano' : 'Mínimo zoom'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            {/* Ações */}
            <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3"
                onClick={() => setShowExportDialog(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="text-xs">Exportar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span className="text-xs">Compartilhar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-secondary)]">Carregando...</div>
          </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              {searchTerm ? 'Nenhuma feature encontrada' : 'Nenhuma feature cadastrada'}
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece adicionando uma feature ao roadmap'}
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'timeline' && (
              <RoadmapTimeline
                features={filteredFeatures}
                currentDate={currentDate}
                zoomLevel={zoomLevel}
                onFeatureClick={handleFeatureClick}
              />
            )}
            {viewMode === 'dependencies' && (
              <RoadmapDependencies
                features={filteredFeatures}
                onFeatureClick={handleFeatureClick}
              />
            )}
            {viewMode === 'zoom' && (
              <ZoomView
                features={filteredFeatures}
                currentDate={currentDate}
                zoomLevel={zoomLevel}
                onFeatureClick={handleFeatureClick}
              />
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <AddFeatureDialog
        open={showAddFeature}
        onOpenChange={setShowAddFeature}
        onSuccess={() => {
          setShowAddFeature(false)
        }}
      />

      <RoadmapExportDialog
        features={filteredFeatures}
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
      />
    </div>
  )
} 