'use client'

import { Feature } from '@/types/product'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MoreHorizontal, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/roadmap/status-badge'
import { PriorityBadge } from '@/components/roadmap/priority-badge'

interface FeatureListProps {
  features: Feature[]
  onFeatureClick?: (feature: Feature) => void
  onFeatureStatusChange?: (id: string, status: Feature['status']) => void
  onFeatureDelete?: (id: string) => Promise<void>
}

export function FeatureList({
  features,
  onFeatureClick,
  onFeatureStatusChange,
  onFeatureDelete
}: FeatureListProps) {
  return (
    <div className="space-y-4">
      {features.map((feature) => (
        <div
          key={feature.id}
          className={cn(
            "group p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-elevated)]",
            "hover:border-[var(--color-border-strong)] transition-all duration-200"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            {/* Informações Principais */}
            <div className="flex-1 space-y-1 cursor-pointer" onClick={() => onFeatureClick?.(feature)}>
              <h3 className="font-medium text-[var(--color-text-primary)]">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                {feature.description}
              </p>
            </div>

            {/* Status e Ações */}
            <div className="flex items-center gap-3">
              <StatusBadge status={feature.status} />
              <PriorityBadge priority={feature.priority} />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onFeatureClick?.(feature)}>
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onFeatureStatusChange?.(feature.id, 'planned')}>
                    Marcar como Planejado
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFeatureStatusChange?.(feature.id, 'in-progress')}>
                    Marcar como Em Progresso
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFeatureStatusChange?.(feature.id, 'completed')}>
                    Marcar como Concluído
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFeatureStatusChange?.(feature.id, 'blocked')}>
                    Marcar como Bloqueado
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onFeatureDelete?.(feature.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Metadados */}
          <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {format(new Date(feature.startDate), "dd 'de' MMM", { locale: ptBR })} - 
                {format(new Date(feature.endDate), "dd 'de' MMM", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 