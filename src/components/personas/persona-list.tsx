'use client'

import { Persona } from '@/types/product'
import { cn } from '@/lib/utils'
import { MoreHorizontal, Users2, Target, Goal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

interface PersonaListProps {
  personas: Persona[]
  onPersonaClick?: (persona: Persona) => void
}

export function PersonaList({ personas, onPersonaClick }: PersonaListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {personas.map((persona) => (
        <div
          key={persona.id}
          className={cn(
            "group relative p-4 rounded-lg border border-[var(--color-border)]",
            "hover:border-[var(--color-border-strong)] transition-all duration-200",
            "bg-[var(--color-background-elevated)]"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-[var(--color-text-primary)]">
                {persona.name}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                {persona.description}
              </p>
            </div>

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
                <DropdownMenuItem onClick={() => onPersonaClick?.(persona)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 hover:text-red-600">
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Características */}
          <div className="space-y-3">
            {/* Características */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-secondary)]">
                <Users2 className="w-3.5 h-3.5" />
                <span>Características</span>
              </div>
              <ul className="pl-5 space-y-1">
                {persona.characteristics.map((characteristic, index) => (
                  <li key={index} className="text-xs text-[var(--color-text-secondary)] list-disc">
                    {characteristic}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pontos de Dor */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-secondary)]">
                <Target className="w-3.5 h-3.5" />
                <span>Pontos de Dor</span>
              </div>
              <ul className="pl-5 space-y-1">
                {persona.painPoints.map((point, index) => (
                  <li key={index} className="text-xs text-[var(--color-text-secondary)] list-disc">
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Objetivos */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-secondary)]">
                <Goal className="w-3.5 h-3.5" />
                <span>Objetivos</span>
              </div>
              <ul className="pl-5 space-y-1">
                {persona.goals.map((goal, index) => (
                  <li key={index} className="text-xs text-[var(--color-text-secondary)] list-disc">
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 