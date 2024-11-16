'use client'

import { Feature } from '@/types/product'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserStoriesDialog } from './user-stories-dialog'
import { useState } from 'react'
import { 
  MoreHorizontal, 
  ChevronDown, 
  ChevronRight,
  BookOpen,
  Edit,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FeatureListProps {
  features: Feature[]
  onEdit?: (feature: Feature) => void
  onDelete?: (id: string) => void
}

export function FeatureList({ features, onEdit, onDelete }: FeatureListProps) {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set())
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [showStoriesDialog, setShowStoriesDialog] = useState(false)

  const toggleFeature = (featureId: string) => {
    const newExpanded = new Set(expandedFeatures)
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId)
    } else {
      newExpanded.add(featureId)
    }
    setExpandedFeatures(newExpanded)
  }

  const getStatusColor = (status: Feature['status']) => {
    switch (status) {
      case 'planned': return 'bg-blue-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'completed': return 'bg-green-500'
      case 'blocked': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: Feature['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      {features.map(feature => (
        <div
          key={feature.id}
          className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-lg overflow-hidden hover:border-[var(--color-border-hover)] transition-colors"
        >
          {/* Cabeçalho da Feature */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <button
                  onClick={() => toggleFeature(feature.id)}
                  className="mt-1 p-1 hover:bg-[var(--color-background-secondary)] rounded-md transition-colors"
                >
                  {expandedFeatures.has(feature.id) ? (
                    <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-[var(--color-text-primary)]">
                      {feature.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(feature.status)}`} />
                      <Badge variant="secondary" className="text-xs">
                        {feature.status}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(feature.priority)}`} />
                      <Badge variant="secondary" className="text-xs">
                        {feature.priority}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                    {feature.description.what}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                      setSelectedFeature(feature)
                      setShowStoriesDialog(true)
                    }}
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span className="text-xs">
                      {feature.stories?.length || 0} histórias
                    </span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(feature)}>
                        <Edit className="w-4 h-4 mr-2" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(feature.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            {feature.stories && feature.stories.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-1">
                  <span>Progresso</span>
                  <span>
                    {feature.stories.filter(s => s.status === 'completed').length}/
                    {feature.stories.length} histórias concluídas
                  </span>
                </div>
                <div className="h-1.5 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--color-primary)] transition-all duration-300"
                    style={{ 
                      width: `${Math.round((feature.stories.filter(s => s.status === 'completed').length / feature.stories.length) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Detalhes Expandidos */}
          {expandedFeatures.has(feature.id) && (
            <div className="px-4 pb-4 border-t border-[var(--color-border)]">
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Por quê?
                  </h4>
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {feature.description.why}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Para quem?
                  </h4>
                  <p className="text-sm text-[var(--color-text-primary)]">
                    {feature.description.who}
                  </p>
                </div>
              </div>

              {/* Lista de Histórias */}
              {feature.stories && feature.stories.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Histórias de Usuário
                  </h4>
                  <div className="space-y-2">
                    {feature.stories.map(story => (
                      <div 
                        key={story.id}
                        className="p-2 bg-[var(--color-background-secondary)]/50 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(story.status)}`} />
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">
                            {story.title}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {story.points} pontos
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Dialog de Histórias */}
      {selectedFeature && (
        <UserStoriesDialog
          open={showStoriesDialog}
          onOpenChange={setShowStoriesDialog}
          feature={selectedFeature}
        />
      )}
    </div>
  )
} 