'use client'

import { UserStory } from '@/types/product'
import { cn } from '@/lib/utils'
import { MoreHorizontal, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

interface UserStoryListProps {
  stories: UserStory[]
  onStoryClick?: (story: UserStory) => void
  onStoryStatusChange?: (id: string, status: UserStory['status']) => void
  onStoryDelete?: (id: string) => Promise<void>
}

export function UserStoryList({
  stories,
  onStoryClick,
  onStoryStatusChange,
  onStoryDelete
}: UserStoryListProps) {
  const statusColors = {
    'open': 'bg-blue-500',
    'in-progress': 'bg-yellow-500',
    'completed': 'bg-green-500',
    'blocked': 'bg-red-500'
  }

  return (
    <div className="space-y-2">
      {stories.map((story) => (
        <div
          key={story.id}
          className={cn(
            "group relative p-3 rounded-lg border border-[var(--color-border)]",
            "hover:border-[var(--color-border-strong)] transition-all duration-200",
            "bg-[var(--color-background-elevated)]"
          )}
        >
          <div className="flex items-start gap-3">
            {/* Status */}
            <div className={cn("w-1.5 h-1.5 mt-1.5 rounded-full", statusColors[story.status])} />

            {/* Conteúdo */}
            <div className="flex-1 space-y-1 cursor-pointer" onClick={() => onStoryClick?.(story)}>
              <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
                {story.title}
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Como {story.description.asA}, eu quero {story.description.iWant}, para que {story.description.soThat}
              </p>
            </div>

            {/* Story Points */}
            <div className="shrink-0 px-2 py-0.5 rounded bg-[var(--color-background-secondary)] text-xs font-medium">
              {story.points} {story.points === 1 ? 'ponto' : 'pontos'}
            </div>

            {/* Menu de Ações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onStoryClick?.(story)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onStoryStatusChange?.(story.id, 'open')}>
                  Marcar como Aberta
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStoryStatusChange?.(story.id, 'in-progress')}>
                  Marcar como Em Progresso
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStoryStatusChange?.(story.id, 'completed')}>
                  Marcar como Concluída
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStoryStatusChange?.(story.id, 'blocked')}>
                  Marcar como Bloqueada
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onStoryDelete?.(story.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Critérios de Aceitação */}
          {story.acceptanceCriteria.length > 0 && (
            <div className="mt-3 pl-4 space-y-1">
              <h5 className="text-xs font-medium text-[var(--color-text-secondary)]">
                Critérios de Aceitação:
              </h5>
              <ul className="space-y-1">
                {story.acceptanceCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-baseline gap-2">
                    <ChevronRight className="w-3 h-3 text-[var(--color-text-secondary)]" />
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {criteria}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 