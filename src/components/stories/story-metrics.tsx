'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { IUserStory } from '@/types/story'
import { 
  BarChart3,
  Clock,
  ListChecks,
  Target,
  AlertOctagon,
  CheckCircle2,
  BookOpen,
  PlayCircle
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface StoryMetricsProps {
  stories: IUserStory[]
}

export function StoryMetrics({ stories }: StoryMetricsProps) {
  // Métricas gerais
  const totalStories = stories.length
  const totalPoints = stories.reduce((acc, story) => acc + story.points, 0)
  const averagePoints = totalStories > 0 ? totalPoints / totalStories : 0

  // Métricas por status
  const storiesPerStatus = {
    open: stories.filter(s => s.status === 'open').length,
    'in-progress': stories.filter(s => s.status === 'in-progress').length,
    completed: stories.filter(s => s.status === 'completed').length,
    blocked: stories.filter(s => s.status === 'blocked').length
  }

  // Taxa de conclusão
  const completionRate = totalStories > 0 
    ? (storiesPerStatus.completed / totalStories) * 100 
    : 0

  // Tempo médio de conclusão (em dias)
  const completedStories = stories.filter(s => s.status === 'completed')
  const cycleTime = completedStories.length > 0
    ? completedStories.reduce((acc, story) => {
        return acc + differenceInDays(
          new Date(story.updated_at),
          new Date(story.created_at)
        )
      }, 0) / completedStories.length
    : 0

  // Métricas rápidas para o cabeçalho
  const quickMetrics = [
    {
      icon: BookOpen,
      label: 'Abertas',
      value: storiesPerStatus.open,
      color: 'text-gray-500',
      bgColor: 'bg-gray-500/8'
    },
    {
      icon: PlayCircle,
      label: 'Em Progresso',
      value: storiesPerStatus['in-progress'],
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8'
    },
    {
      icon: AlertOctagon,
      label: 'Bloqueadas',
      value: storiesPerStatus.blocked,
      color: 'text-red-500',
      bgColor: 'bg-red-500/8'
    },
    {
      icon: CheckCircle2,
      label: 'Concluídas',
      value: storiesPerStatus.completed,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Métricas Rápidas */}
      <div className="grid grid-cols-4 gap-4">
        {quickMetrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded", metric.bgColor)}>
                <metric.icon className={cn("w-4 h-4", metric.color)} />
              </div>
              <div>
                <div className="text-2xl font-semibold">
                  {metric.value}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {metric.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-2 gap-4">
        {/* Story Points */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-sm font-medium">Story Points</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Total de Pontos
              </span>
              <Badge variant="secondary">
                {totalPoints} pontos
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Média por História
              </span>
              <Badge variant="secondary">
                {averagePoints.toFixed(1)} pontos
              </Badge>
            </div>
          </div>
        </Card>

        {/* Tempo e Progresso */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-sm font-medium">Tempo e Progresso</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Taxa de Conclusão
              </span>
              <Badge variant="secondary">
                {completionRate.toFixed(1)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Tempo Médio de Conclusão
              </span>
              <Badge variant="secondary">
                {cycleTime.toFixed(1)} dias
              </Badge>
            </div>
          </div>
        </Card>

        {/* Critérios de Aceitação */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-sm font-medium">Critérios de Aceitação</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Com Critérios
              </span>
              <Badge variant="secondary">
                {stories.filter(s => s.acceptance_criteria?.length).length} histórias
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Sem Critérios
              </span>
              <Badge variant="secondary">
                {stories.filter(s => !s.acceptance_criteria?.length).length} histórias
              </Badge>
            </div>
          </div>
        </Card>

        {/* Tendências */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-sm font-medium">Tendências</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Histórias Recentes
              </span>
              <Badge variant="secondary">
                {stories.filter(s => {
                  const daysAgo = differenceInDays(new Date(), new Date(s.created_at))
                  return daysAgo <= 7
                }).length} últimos 7 dias
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Concluídas Recentemente
              </span>
              <Badge variant="secondary">
                {stories.filter(s => {
                  const daysAgo = differenceInDays(new Date(), new Date(s.updated_at))
                  return s.status === 'completed' && daysAgo <= 7
                }).length} últimos 7 dias
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 