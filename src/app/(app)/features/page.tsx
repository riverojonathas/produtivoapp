'use client'

import { useState } from 'react'
import { useFeatures } from '@/hooks/use-features'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, LayoutGrid, List, Table, Columns } from 'lucide-react'
import { AddFeatureDialog } from '@/components/roadmap/add-feature-dialog'
import { EditFeatureDialog } from '@/components/features/edit-feature-dialog'
import { FeatureList } from '@/components/features/feature-list'
import { TableView } from '@/components/roadmap/table-view'
import { Feature } from '@/types/product'
import { KanbanView } from '@/components/roadmap/kanban-view'
import { useRoadmap } from '@/hooks/use-roadmap'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type ViewMode = 'list' | 'table' | 'grid' | 'kanban'

const viewModes = [
  {
    id: 'list',
    icon: List,
    label: 'Lista',
    description: 'Visualização em lista detalhada'
  },
  {
    id: 'table',
    icon: Table,
    label: 'Tabela',
    description: 'Visualização em tabela hierárquica'
  },
  {
    id: 'grid',
    icon: LayoutGrid,
    label: 'Grid',
    description: 'Visualização em cards'
  },
  {
    id: 'kanban',
    icon: Columns,
    label: 'Kanban',
    description: 'Visualização em quadro kanban'
  }
] as const

export default function FeaturesPage() {
  const [isAddFeatureOpen, setIsAddFeatureOpen] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const { features, isLoading } = useFeatures()
  const { updateFeatureStatus, deleteFeature } = useRoadmap()

  // Filtrar features baseado na busca
  const filteredFeatures = features?.filter(feature =>
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.what.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFeature.mutateAsync(id)
      toast.success('Feature excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir feature:', error)
      toast.error('Erro ao excluir feature')
    }
  }

  const handleStatusChange = async (id: string, status: Feature['status']) => {
    try {
      await updateFeatureStatus.mutateAsync({ id, status })
      toast.success('Status atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-[var(--color-background-primary)] border-b border-[var(--color-border)] z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Features
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Gerencie as features do seu produto
            </p>
          </div>
          <Button
            onClick={() => setIsAddFeatureOpen(true)}
            className="h-8 px-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Nova Feature</span>
          </Button>
        </div>

        {/* Filtros e Visualização */}
        <div className="px-6 py-2 border-t border-[var(--color-border)] bg-[var(--color-background-elevated)] flex items-center justify-between">
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

          {/* Seletor de Visualização */}
          <TooltipProvider delayDuration={300}>
            <div className="flex items-center gap-1 bg-[var(--color-background-secondary)]/10 rounded-lg p-1">
              {viewModes.map((mode) => (
                <Tooltip key={mode.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode(mode.id)}
                      className={cn(
                        "h-7 px-2 gap-2 relative group",
                        viewMode === mode.id && "bg-white shadow-sm"
                      )}
                    >
                      <mode.icon 
                        className={cn(
                          "w-4 h-4 transition-all duration-200",
                          viewMode === mode.id 
                            ? "text-[var(--color-primary)]" 
                            : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]"
                        )}
                      />
                      <span 
                        className={cn(
                          "text-xs transition-all duration-200",
                          viewMode === mode.id 
                            ? "text-[var(--color-primary)]" 
                            : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]"
                        )}
                      >
                        {mode.label}
                      </span>

                      {/* Indicador de ativo */}
                      {viewMode === mode.id && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[var(--color-primary)]" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] shadow-lg"
                  >
                    <div className="text-xs">
                      <p className="font-medium text-[var(--color-text-primary)]">
                        {mode.label}
                      </p>
                      <p className="text-[var(--color-text-secondary)]">
                        {mode.description}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Lista de Features */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'list' && (
          <div className="p-6">
            <FeatureList 
              features={filteredFeatures}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
        
        {viewMode === 'table' && (
          <TableView 
            features={filteredFeatures}
            onFeatureClick={handleEdit}
            onFeatureDelete={handleDelete}
            onFeatureStatusChange={handleStatusChange}
          />
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredFeatures.map(feature => (
              <div
                key={feature.id}
                className="p-4 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-lg"
                onClick={() => handleEdit(feature)}
              >
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-3">
                  {feature.description.what}
                </p>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'kanban' && (
          <KanbanView 
            features={filteredFeatures}
            onFeatureClick={handleEdit}
            onFeatureStatusChange={handleStatusChange}
            onFeatureDelete={handleDelete}
          />
        )}
      </div>

      {/* Dialogs */}
      <AddFeatureDialog
        open={isAddFeatureOpen}
        onOpenChange={setIsAddFeatureOpen}
        onSuccess={() => {
          setIsAddFeatureOpen(false)
        }}
      />

      {selectedFeature && (
        <EditFeatureDialog
          open={!!selectedFeature}
          onOpenChange={(open) => !open && setSelectedFeature(null)}
          feature={selectedFeature}
          onSuccess={() => {
            setSelectedFeature(null)
            toast.success('Feature atualizada com sucesso!')
          }}
        />
      )}
    </div>
  )
} 