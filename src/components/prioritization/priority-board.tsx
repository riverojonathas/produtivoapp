'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { IFeature } from "@/types/feature"
import { 
  Target, 
  ArrowUp, 
  Clock, 
  Users,
  Sparkles,
  AlertTriangle
} from "lucide-react"
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PriorityBoardProps {
  features: IFeature[]
  onFeatureClick?: (feature: IFeature) => void
}

export function PriorityBoard({ features, onFeatureClick }: PriorityBoardProps) {
  // Calcular score geral baseado em RICE e MoSCoW
  const calculateScore = (feature: IFeature) => {
    let score = 0
    
    // RICE Score (peso 60%)
    if (feature.rice_score) {
      score += (feature.rice_score / 100) * 60
    }

    // MoSCoW (peso 40%)
    const moscowWeights = {
      must: 40,
      should: 30,
      could: 20,
      wont: 0
    }
    if (feature.moscow_priority) {
      score += moscowWeights[feature.moscow_priority]
    }

    return score
  }

  // Ordenar features por score
  const sortedFeatures = [...features].sort((a, b) => calculateScore(b) - calculateScore(a))

  // Agrupar por prioridade
  const priorityGroups = {
    high: sortedFeatures.slice(0, Math.ceil(sortedFeatures.length * 0.2)), // Top 20%
    medium: sortedFeatures.slice(Math.ceil(sortedFeatures.length * 0.2), Math.ceil(sortedFeatures.length * 0.5)), // Próximos 30%
    low: sortedFeatures.slice(Math.ceil(sortedFeatures.length * 0.5)) // Restantes 50%
  }

  const renderFeatureCard = (feature: IFeature) => {
    const score = calculateScore(feature)
    const hasRisk = feature.dependencies?.some(d => d.status === 'blocked') || false

    return (
      <Card
        key={feature.id}
        className={cn(
          "group p-4 hover:shadow-md transition-all duration-200 cursor-pointer",
          "border-l-4",
          score >= 80 && "border-l-red-500",
          score >= 60 && score < 80 && "border-l-orange-500",
          score >= 40 && score < 60 && "border-l-yellow-500",
          score < 40 && "border-l-blue-500"
        )}
        onClick={() => onFeatureClick?.(feature)}
      >
        <div className="space-y-3">
          {/* Cabeçalho */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium">{feature.title}</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                {feature.description?.what}
              </p>
            </div>
            {hasRisk && (
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            )}
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-2">
            {feature.rice_score && (
              <div className="flex items-center gap-1.5 text-xs">
                <Target className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                <span>{feature.rice_score.toFixed(1)}</span>
              </div>
            )}
            {feature.moscow_priority && (
              <div className="flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                <span>{feature.moscow_priority}</span>
              </div>
            )}
            {feature.rice_effort && (
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                <span>{feature.rice_effort}m</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <Users className="w-3.5 h-3.5" />
              <span>{feature.assignees?.length || 0}</span>
            </div>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs",
                feature.status === 'done' && "bg-emerald-100 text-emerald-700",
                feature.status === 'doing' && "bg-blue-100 text-blue-700",
                feature.status === 'blocked' && "bg-red-100 text-red-700",
                feature.status === 'backlog' && "bg-gray-100 text-gray-700"
              )}
            >
              {feature.status}
            </Badge>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Alta Prioridade */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <ArrowUp className="w-4 h-4 text-red-500" />
            Alta Prioridade
          </h3>
          <Badge variant="secondary" className="text-xs">
            {priorityGroups.high.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {priorityGroups.high.map(renderFeatureCard)}
        </div>
      </div>

      {/* Média Prioridade */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <ArrowUp className="w-4 h-4 text-yellow-500" />
            Média Prioridade
          </h3>
          <Badge variant="secondary" className="text-xs">
            {priorityGroups.medium.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {priorityGroups.medium.map(renderFeatureCard)}
        </div>
      </div>

      {/* Baixa Prioridade */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <ArrowUp className="w-4 h-4 text-blue-500" />
            Baixa Prioridade
          </h3>
          <Badge variant="secondary" className="text-xs">
            {priorityGroups.low.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {priorityGroups.low.map(renderFeatureCard)}
        </div>
      </div>
    </div>
  )
} 