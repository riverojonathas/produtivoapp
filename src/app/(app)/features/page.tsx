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
  Target,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useFeatures } from '@/hooks/use-features'

type ViewMode = 'grid' | 'list'

export default function FeaturesPage() {
  const { features = [], isLoading } = useFeatures()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const router = useRouter()

  // Métricas rápidas
  const items = [
    {
      icon: CheckCircle2,
      label: 'Concluídas',
      value: features.filter(f => f.status === 'done').length,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8'
    },
    {
      icon: Clock,
      label: 'Em Progresso',
      value: features.filter(f => f.status === 'doing').length,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8'
    },
    {
      icon: AlertTriangle,
      label: 'Bloqueadas',
      value: features.filter(f => f.status === 'blocked').length,
      color: 'text-red-500',
      bgColor: 'bg-red-500/8'
    }
  ]

  const filteredFeatures = features.filter(feature =>
    feature.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description?.what?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    false
  )

  const renderFeatureCard = (feature: any) => (
    <Card
      key={feature.id}
      className="p-4 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => router.push(`/features/${feature.id}`)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium">{feature.title}</h3>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2">
              {feature.description?.what || 'Sem descrição'}
            </p>
          </div>
          <Badge variant="secondary" className={cn(
            "text-xs",
            feature.priority === 'high' && "bg-red-100 text-red-700",
            feature.priority === 'medium' && "bg-yellow-100 text-yellow-700",
            feature.priority === 'low' && "bg-green-100 text-green-700"
          )}>
            {feature.priority}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <Badge variant="secondary" className={cn(
            "text-xs",
            feature.status === 'done' && "bg-emerald-100 text-emerald-700",
            feature.status === 'doing' && "bg-blue-100 text-blue-700",
            feature.status === 'blocked' && "bg-red-100 text-red-700",
            feature.status === 'backlog' && "bg-gray-100 text-gray-700"
          )}>
            {feature.status}
          </Badge>
          <span>
            {format(new Date(feature.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-medium">Features</h1>
              <Button
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white"
                onClick={() => router.push('/features/new')}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="h-4 w-px bg-[var(--color-border)]" />

            <div className="flex items-center gap-4">
              {items.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2",
                    index !== items.length - 1 && "border-r border-[var(--color-border)] pr-4"
                  )}
                >
                  <div className={cn("p-1 rounded", item.bgColor)}>
                    <item.icon className={cn("w-3 h-3", item.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium -mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 w-[200px]"
              />
            </div>

            <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'grid' && "text-[var(--color-primary)]"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === 'list' && "text-[var(--color-primary)]"
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-secondary)]">Carregando...</div>
          </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              {searchTerm ? 'Nenhuma feature encontrada' : 'Nenhuma feature cadastrada'}
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando uma nova feature'}
            </p>
          </div>
        ) : (
          <div className={cn(
            "gap-4",
            viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"
          )}>
            {filteredFeatures.map(renderFeatureCard)}
          </div>
        )}
      </div>
    </div>
  )
} 