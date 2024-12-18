'use client'

import { useState } from 'react'
import { useFeatures } from '@/hooks/use-features'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, LayoutGrid, Target, ListChecks, BarChart3, GitBranch, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PriorityMatrix } from '@/components/prioritization/priority-matrix'
import { RICEScore } from '@/components/prioritization/rice-score'
import { MoscowBoard } from '@/components/prioritization/moscow-board'
import { PrioritizedList } from '@/components/prioritization/prioritized-list'
import { PrioritizationDialog } from '@/components/prioritization/prioritization-dialog'
import { IFeature } from '@/types/feature'
import { PrioritizationHelp } from '@/components/prioritization/prioritization-help'

type ViewMode = 'matrix' | 'rice' | 'moscow' | 'list'

export default function PrioritizationPage() {
  const { features = [], isLoading } = useFeatures()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('matrix')
  const [selectedFeature, setSelectedFeature] = useState<IFeature | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  // Métricas rápidas
  const items = [
    {
      icon: Target,
      label: 'RICE Score',
      value: features.filter(f => f.rice_score).length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8'
    },
    {
      icon: ListChecks,
      label: 'MoSCoW',
      value: features.filter(f => f.moscow_priority).length,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/8'
    },
    {
      icon: GitBranch,
      label: 'Dependências',
      value: features.filter(f => f.dependencies?.length).length,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8'
    }
  ]

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description?.what?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-[var(--color-text-secondary)]">Carregando...</div>
        </div>
      )
    }

    if (filteredFeatures.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-sm text-[var(--color-text-secondary)]">
            {searchTerm ? 'Nenhuma feature encontrada' : 'Nenhuma feature cadastrada'}
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando uma nova feature'}
          </p>
        </div>
      )
    }

    switch (viewMode) {
      case 'matrix':
        return <PriorityMatrix features={filteredFeatures} onFeatureClick={setSelectedFeature} />
      case 'rice':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map(feature => (
              <RICEScore 
                key={feature.id} 
                feature={feature} 
                onFeatureClick={setSelectedFeature} 
              />
            ))}
          </div>
        )
      case 'moscow':
        return <MoscowBoard features={filteredFeatures} onFeatureClick={setSelectedFeature} />
      case 'list':
        return <PrioritizedList features={filteredFeatures} onFeatureClick={setSelectedFeature} />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-medium">Priorização</h1>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {features.length}
              </span>
            </div>

            <div className="h-4 w-px bg-[var(--color-border)]" />

            <div className="flex items-center gap-4">
              {items.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2",
                    index !== items.length - 1 && "border-r border-[var(--color-border)] pr-4"
                  )}
                >
                  <div className={cn("p-1 rounded", item.bgColor)}>
                    <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium -mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 w-[200px]"
              />
            </div>

            <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('matrix')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'matrix' && "text-[var(--color-primary)]"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('rice')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'rice' && "text-[var(--color-primary)]"
                )}
              >
                <Target className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('moscow')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'moscow' && "text-[var(--color-primary)]"
                )}
              >
                <ListChecks className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'list' && "text-[var(--color-primary)]"
                )}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>

            {/* Botão de Ajuda */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(true)}
              className="h-8"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-2" />
              Como Priorizar
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>

      {/* Dialog de Priorização */}
      {selectedFeature && (
        <PrioritizationDialog
          feature={selectedFeature}
          open={!!selectedFeature}
          onOpenChange={(open) => !open && setSelectedFeature(null)}
        />
      )}

      {/* Dialog de Ajuda */}
      <PrioritizationHelp 
        open={showHelp} 
        onOpenChange={setShowHelp} 
      />
    </div>
  )
} 