'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Users,
  Target,
  Heart,
  AlertTriangle,
  Lightbulb,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { usePersonas } from '@/hooks/use-personas'
import { PersonaAvatar } from '@/components/personas/persona-avatar'
import { PersonaActionsMenu } from '@/components/personas/persona-actions-menu'

interface Persona {
  id: string
  name: string
  description: string
  characteristics: string[]
  pain_points: string[]
  goals: string[]
  product_id: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

type ViewMode = 'grid' | 'list'

export default function PersonasPage() {
  const { personas = [], isLoading } = usePersonas()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const router = useRouter()

  // Métricas rápidas
  const items = [
    {
      icon: Users,
      label: 'Total',
      value: personas.length,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8 dark:bg-violet-500/10'
    },
    {
      icon: Target,
      label: 'Com objetivos',
      value: personas.filter(p => p.goals.length > 0).length,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8 dark:bg-emerald-500/10'
    },
    {
      icon: Heart,
      label: 'Com necessidades',
      value: personas.filter(p => p.pain_points.length > 0).length,
      color: 'text-red-500',
      bgColor: 'bg-red-500/8 dark:bg-red-500/10'
    },
    {
      icon: Lightbulb,
      label: 'Com características',
      value: personas.filter(p => p.characteristics.length > 0).length,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/8 dark:bg-amber-500/10'
    }
  ]

  const filteredPersonas = personas.filter(persona => {
    const searchLower = searchTerm.toLowerCase()
    return (
      persona.name.toLowerCase().includes(searchLower) ||
      persona.description.toLowerCase().includes(searchLower)
    )
  })

  const renderGridView = (persona: Persona) => (
    <Card 
      key={persona.id} 
      className="group bg-[var(--color-background-primary)] hover:bg-[var(--color-background-subtle)] transition-all duration-200"
      onClick={() => router.push(`/personas/${persona.id}`)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <PersonaAvatar 
            className="w-10 h-10 rounded-lg border border-[var(--color-border)]"
            name={persona.name}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {persona.name}
                </h3>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2">
                  {persona.description}
                </p>
              </div>
              <PersonaActionsMenu persona={persona} />
            </div>

            {/* Badges de informações */}
            <div className="mt-3 flex flex-wrap gap-2">
              {persona.goals.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Target className="w-3 h-3" />
                  {persona.goals.length} objetivos
                </Badge>
              )}
              {persona.pain_points.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Heart className="w-3 h-3" />
                  {persona.pain_points.length} necessidades
                </Badge>
              )}
              {persona.characteristics.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Lightbulb className="w-3 h-3" />
                  {persona.characteristics.length} características
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-end text-xs text-[var(--color-text-secondary)]">
          <span suppressHydrationWarning>
            {format(new Date(persona.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
        </div>
      </div>
    </Card>
  )

  const renderListView = (persona: Persona) => (
    <Card 
      key={persona.id} 
      className="group bg-[var(--color-background-primary)] hover:bg-[var(--color-background-subtle)] transition-all duration-200"
      onClick={() => router.push(`/personas/${persona.id}`)}
    >
      <div className="p-4 flex items-center gap-4">
        <PersonaAvatar 
          className="w-10 h-10 rounded-lg border border-[var(--color-border)]"
          name={persona.name}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {persona.name}
              </h3>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-1">
                {persona.description}
              </p>
            </div>
          </div>

          {/* Badges de informações */}
          <div className="mt-2 flex flex-wrap gap-2">
            {persona.goals.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Target className="w-3 h-3" />
                {persona.goals.length} objetivos
              </Badge>
            )}
            {persona.pain_points.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Heart className="w-3 h-3" />
                {persona.pain_points.length} necessidades
              </Badge>
            )}
            {persona.characteristics.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Lightbulb className="w-3 h-3" />
                {persona.characteristics.length} características
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span suppressHydrationWarning className="text-xs text-[var(--color-text-secondary)]">
            {format(new Date(persona.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
          <PersonaActionsMenu persona={persona} />
        </div>
      </div>
    </Card>
  )

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho Unificado */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo - Título, Botão Novo e Métricas */}
          <div className="flex items-center gap-6">
            {/* Título e Botão Novo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Personas
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {personas.length}
                </span>
              </div>

              <Button 
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                onClick={() => router.push('/personas/new')}
                title="Nova Persona"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Separador Vertical */}
            <div className="h-4 w-px bg-[var(--color-border)]" />

            {/* Métricas Compactas */}
            <div className="flex items-center gap-4">
              {items.map((item, index) => (
                <TooltipProvider key={item.label}>
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
                        <p className="text-sm font-medium">
                          {item.value}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      <p className="text-xs font-medium">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Lado Direito - Ferramentas */}
          <div className="flex items-center gap-3">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar personas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm bg-[var(--color-background-elevated)] border-[var(--color-border)] w-[200px]"
              />
            </div>

            {/* Visualizações */}
            <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'grid' 
                    ? "text-[var(--color-text-primary)]" 
                    : "text-[var(--color-text-secondary)]"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'list' 
                    ? "text-[var(--color-text-primary)]" 
                    : "text-[var(--color-text-secondary)]"
                )}
              >
                <List className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Personas */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-secondary)]">Carregando...</div>
          </div>
        ) : personas.length === 0 ? (
          <Card className="w-full p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-[var(--color-background-subtle)] p-3">
                <Users className="w-6 h-6 text-[var(--color-text-secondary)]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Nenhuma Persona Criada
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-sm">
                Crie sua primeira persona para começar a definir os usuários ideais do seu produto.
              </p>
              <Button 
                onClick={() => router.push('/personas/new')} 
                className="mt-4 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Persona
              </Button>
            </div>
          </Card>
        ) : searchTerm && filteredPersonas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              Nenhuma persona encontrada
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Tente buscar com outros termos
            </p>
          </div>
        ) : (
          <div className={cn(
            "gap-4",
            viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"
          )}>
            {filteredPersonas.map(persona => 
              viewMode === 'grid' ? renderGridView(persona) : renderListView(persona)
            )}
          </div>
        )}
      </div>
    </div>
  )
} 