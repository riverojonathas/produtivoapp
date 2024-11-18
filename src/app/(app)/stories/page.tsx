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
  Columns,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Target
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useStories } from '@/hooks/use-stories'

type ViewMode = 'grid' | 'list' | 'kanban'

export default function StoriesPage() {
  const { stories = [], isLoading } = useStories()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const router = useRouter()

  // Métricas rápidas
  const items = [
    {
      icon: CheckCircle2,
      label: 'Concluídas',
      value: stories.filter(s => s.status === 'completed').length,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8 dark:bg-emerald-500/10'
    },
    {
      icon: Clock,
      label: 'Em Progresso',
      value: stories.filter(s => s.status === 'in-progress').length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10'
    },
    {
      icon: AlertTriangle,
      label: 'Bloqueadas',
      value: stories.filter(s => s.status === 'blocked').length,
      color: 'text-red-500',
      bgColor: 'bg-red-500/8 dark:bg-red-500/10'
    },
    {
      icon: Target,
      label: 'Story Points',
      value: stories.reduce((total, story) => total + (story.points || 0), 0),
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8 dark:bg-violet-500/10'
    }
  ]

  const filteredStories = stories.filter(story => {
    const searchLower = searchTerm.toLowerCase()
    return (
      story.title.toLowerCase().includes(searchLower) ||
      story.description.asA.toLowerCase().includes(searchLower) ||
      story.description.iWant.toLowerCase().includes(searchLower) ||
      story.description.soThat.toLowerCase().includes(searchLower)
    )
  })

  const renderGridView = (story: any) => (
    <Card 
      key={story.id} 
      className="group bg-[var(--color-background-primary)] hover:bg-[var(--color-background-subtle)] transition-all duration-200"
      onClick={() => router.push(`/stories/${story.id}`)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {story.title}
                </h3>
                <div className="mt-1 text-xs text-[var(--color-text-secondary)] space-y-1">
                  <p>Como {story.description.asA},</p>
                  <p>Eu quero {story.description.iWant},</p>
                  <p>Para que {story.description.soThat}</p>
                </div>
              </div>
            </div>

            {/* Badges de informações */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Target className="w-3 h-3" />
                {story.points} pontos
              </Badge>
              {story.acceptance_criteria?.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  {story.acceptance_criteria.length} critérios
                </Badge>
              )}
              {story.assignees?.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Users className="w-3 h-3" />
                  {story.assignees.length} designados
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              story.status === 'completed' && "bg-emerald-100 text-emerald-700",
              story.status === 'in-progress' && "bg-blue-100 text-blue-700",
              story.status === 'blocked' && "bg-red-100 text-red-700",
              story.status === 'open' && "bg-gray-100 text-gray-700"
            )}
          >
            {story.status === 'completed' && "Concluída"}
            {story.status === 'in-progress' && "Em Progresso"}
            {story.status === 'blocked' && "Bloqueada"}
            {story.status === 'open' && "Aberta"}
          </Badge>
          <span suppressHydrationWarning>
            {format(new Date(story.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
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
                  Histórias
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {stories.length}
                </span>
              </div>

              <Button 
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                onClick={() => router.push('/stories/new')}
                title="Nova História"
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
                placeholder="Buscar histórias..."
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('kanban')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'kanban' 
                    ? "text-[var(--color-text-primary)]" 
                    : "text-[var(--color-text-secondary)]"
                )}
              >
                <Columns className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Histórias */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-secondary)]">Carregando...</div>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              {searchTerm ? 'Nenhuma história encontrada' : 'Nenhuma história cadastrada'}
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando uma nova história'}
            </p>
          </div>
        ) : (
          <div className={cn(
            "gap-4",
            viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"
          )}>
            {filteredStories.map(story => renderGridView(story))}
          </div>
        )}
      </div>
    </div>
  )
} 