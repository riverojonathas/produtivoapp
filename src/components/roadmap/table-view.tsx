'use client'

import { useState } from 'react'
import { Feature } from '@/types/product'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, ChevronDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TableViewProps {
  features: Feature[]
  onFeatureClick?: (feature: Feature) => void
  onFeatureStatusChange?: (id: string, status: Feature['status']) => void
  onFeatureDelete?: (id: string) => Promise<void>
}

export function TableView({
  features,
  onFeatureClick,
  onFeatureStatusChange,
  onFeatureDelete
}: TableViewProps) {
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set())

  const toggleFeature = (featureId: string) => {
    const newExpanded = new Set(expandedFeatures)
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId)
    } else {
      newExpanded.add(featureId)
    }
    setExpandedFeatures(newExpanded)
  }

  return (
    <div className="w-full">
      {/* Cabeçalho da Tabela */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-[var(--color-background-secondary)] border-b border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)]">
        <div className="col-span-4">Feature/História</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Prioridade</div>
        <div className="col-span-2">Progresso</div>
        <div className="col-span-2">Ações</div>
      </div>

      {/* Lista de Features */}
      <div className="divide-y divide-[var(--color-border)]">
        {features.map(feature => (
          <div key={feature.id}>
            {/* Linha da Feature */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-[var(--color-background-secondary)]/5">
              <div className="col-span-4 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleFeature(feature.id)}
                >
                  {expandedFeatures.has(feature.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <span className="font-medium">{feature.title}</span>
              </div>
              <div className="col-span-2">
                <Badge variant="secondary">{feature.status}</Badge>
              </div>
              <div className="col-span-2">
                <Badge variant="secondary">{feature.priority}</Badge>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--color-primary)]"
                      style={{ 
                        width: `${feature.stories?.filter(s => s.status === 'completed').length || 0 / (feature.stories?.length || 1) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {feature.stories?.filter(s => s.status === 'completed').length || 0}/{feature.stories?.length || 0}
                  </span>
                </div>
              </div>
              <div className="col-span-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onFeatureClick?.(feature)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onFeatureDelete?.(feature.id)}
                      className="text-red-600"
                    >
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Histórias da Feature */}
            {expandedFeatures.has(feature.id) && feature.stories?.map(story => (
              <div 
                key={story.id}
                className="grid grid-cols-12 gap-4 px-4 py-2 bg-[var(--color-background-secondary)]/5 border-t border-[var(--color-border)]/50"
              >
                <div className="col-span-4 pl-8 flex items-center gap-2">
                  <span className="text-sm">{story.title}</span>
                </div>
                <div className="col-span-2">
                  <Badge variant="secondary">{story.status}</Badge>
                </div>
                <div className="col-span-2">
                  <Badge variant="secondary">{story.points} pontos</Badge>
                </div>
                <div className="col-span-4" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
} 