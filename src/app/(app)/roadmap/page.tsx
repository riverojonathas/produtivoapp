'use client'

import { useState } from 'react'
import { useFeatures } from '@/hooks/use-features'
import { TimelineView } from '@/components/roadmap'
import { AddFeatureDialog } from '@/components/roadmap/add-feature-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Filter,
  Share2,
  Download,
  Search,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  Calendar,
  ZoomIn,
  ZoomOut
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type ZoomLevel = 'year' | 'month' | 'sprint' | 'week'
type FeatureStatus = 'planned' | 'in-progress' | 'completed' | 'blocked'

const zoomLabels = {
  year: 'Ano',
  month: 'Mês',
  sprint: 'Sprint',
  week: 'Semana'
} as const

export default function RoadmapPage() {
  // Estados
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | 'all'>('all')
  const [currentDate] = useState(new Date())
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month')
  const { features, isLoading: isLoadingFeatures, error } = useFeatures()

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

  // Loading state
  if (isLoadingFeatures) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar roadmap</h2>
          <p className="text-[var(--color-text-secondary)]">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
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
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">Compartilhar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs">Exportar</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAddFeatureOpen(true)}
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
                className={`h-8 px-3 group ${
                  statusFilter !== 'all' ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)]' : ''
                }`}
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
              {/* ... itens do dropdown ... */}
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
              {/* ... itens do dropdown ... */}
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
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

      {/* Timeline */}
      <div className="flex-1 min-h-0">
        <TimelineView 
          features={features || []}
          currentDate={currentDate}
          zoomLevel={zoomLevel}
        />
      </div>

      {/* Dialog de adicionar feature */}
      <AddFeatureDialog
        open={isAddFeatureOpen}
        onOpenChange={setIsAddFeatureOpen}
        onSuccess={() => {
          setIsAddFeatureOpen(false)
        }}
      />
    </div>
  )
} 