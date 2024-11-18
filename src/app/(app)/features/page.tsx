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
  TrendingUp,
  Hourglass,
  CheckCircle2,
  XCircle,
  Target
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useFeatures } from '@/hooks/use-features'
import { Feature } from '@/types/product'

type ViewMode = 'grid' | 'list' | 'kanban'

export default function FeaturesPage() {
  const { features = [], isLoading } = useFeatures()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const router = useRouter()

  // Métricas rápidas
  const items = [
    {
      icon: TrendingUp,
      label: 'Total',
      value: features.length,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8 dark:bg-violet-500/10'
    },
    {
      icon: Hourglass,
      label: 'Em Progresso',
      value: features.filter(f => f.status === 'doing').length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10'
    },
    {
      icon: CheckCircle2,
      label: 'Concluídas',
      value: features.filter(f => f.status === 'done').length,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8 dark:bg-emerald-500/10'
    },
    {
      icon: XCircle,
      label: 'Bloqueadas',
      value: features.filter(f => f.status === 'blocked').length,
      color: 'text-red-500',
      bgColor: 'bg-red-500/8 dark:bg-red-500/10'
    }
  ]

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
                  Features
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {features.length}
                </span>
              </div>

              <Button 
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                onClick={() => router.push('/features/new')}
                title="Nova Feature"
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
                placeholder="Buscar features..."
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

      {/* Lista de Features */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-secondary)]">Carregando...</div>
          </div>
        ) : features.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              {searchTerm ? 'Nenhuma feature encontrada' : 'Nenhuma feature cadastrada'}
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando uma nova feature'}
            </p>
          </div>
        ) : (
          <div className="text-center text-sm text-[var(--color-text-secondary)]">
            Implementação em andamento...
          </div>
        )}
      </div>
    </div>
  )
} 