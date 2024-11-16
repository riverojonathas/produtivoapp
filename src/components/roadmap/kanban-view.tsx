'use client'

import { Feature } from '@/types/product'
import { FeatureCard } from './feature-card'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'

interface KanbanViewProps {
  features: Feature[]
  onFeatureClick?: (feature: Feature) => void
  onFeatureStatusChange?: (id: string, status: Feature['status']) => void
  onFeatureDelete?: (id: string) => Promise<void>
}

const columns = [
  {
    id: 'discovery',
    title: 'Discovery',
    description: 'Features em fase de descoberta',
    color: 'bg-purple-500'
  },
  {
    id: 'backlog',
    title: 'Backlog',
    description: 'Features ainda não iniciadas',
    color: 'bg-gray-500'
  },
  {
    id: 'doing',
    title: 'Em Desenvolvimento',
    description: 'Features em andamento',
    color: 'bg-blue-500'
  },
  {
    id: 'done',
    title: 'Concluído',
    description: 'Features finalizadas',
    color: 'bg-green-500'
  }
] as const

export function KanbanView({
  features,
  onFeatureClick,
  onFeatureStatusChange,
  onFeatureDelete
}: KanbanViewProps) {
  // Agrupar features por status
  const getFeaturesByStatus = (status: Feature['status']) => {
    return features.filter(feature => feature.status === status)
  }

  // Calcular progresso da coluna
  const getColumnProgress = (status: Feature['status']) => {
    const columnFeatures = getFeaturesByStatus(status)
    if (columnFeatures.length === 0) return 0

    const totalStories = columnFeatures.reduce((acc, feature) => 
      acc + (feature.stories?.length || 0), 0)
    
    const completedStories = columnFeatures.reduce((acc, feature) => 
      acc + (feature.stories?.filter(s => s.status === 'completed').length || 0), 0)

    return totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0
  }

  // Handler para drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination || !onFeatureStatusChange) return

    const featureId = result.draggableId
    const newStatus = result.destination.droppableId as Feature['status']

    onFeatureStatusChange(featureId, newStatus)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full flex gap-6 p-6 overflow-x-auto">
        {columns.map(column => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 flex flex-col bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)]"
          >
            {/* Cabeçalho da Coluna */}
            <div className="p-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-1">
                <div className={cn("w-2 h-2 rounded-full", column.color)} />
                <h3 className="font-medium text-[var(--color-text-primary)]">
                  {column.title}
                </h3>
                <span className="text-xs text-[var(--color-text-secondary)] ml-auto">
                  {getFeaturesByStatus(column.id).length}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {column.description}
              </p>

              {/* Barra de Progresso */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                  <span>Progresso</span>
                  <span>{getColumnProgress(column.id)}%</span>
                </div>
                <div className="h-1 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-300", column.color)}
                    style={{ 
                      width: `${getColumnProgress(column.id)}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Lista de Features */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "flex-1 p-2 overflow-y-auto",
                    snapshot.isDraggingOver && "bg-[var(--color-background-secondary)]/5"
                  )}
                >
                  <div className="space-y-2">
                    {getFeaturesByStatus(column.id).map((feature, index) => (
                      <Draggable 
                        key={feature.id} 
                        draggableId={feature.id} 
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              snapshot.isDragging && "rotate-2 scale-105"
                            )}
                          >
                            <FeatureCard
                              feature={feature}
                              onClick={() => onFeatureClick?.(feature)}
                              onStatusChange={onFeatureStatusChange}
                              onDelete={onFeatureDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
} 