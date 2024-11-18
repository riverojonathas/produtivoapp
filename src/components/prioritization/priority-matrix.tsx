'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Feature } from "@/types/product"
import { ArrowUp, ArrowDown, Target, AlertTriangle } from "lucide-react"

interface PriorityMatrixProps {
  features: Feature[]
  onFeatureClick?: (feature: Feature) => void
}

type Quadrant = 'high-impact-low-effort' | 'high-impact-high-effort' | 'low-impact-low-effort' | 'low-impact-high-effort'

const quadrants: Record<Quadrant, {
  title: string
  description: string
  color: string
  borderColor: string
  bgColor: string
}> = {
  'high-impact-low-effort': {
    title: 'Quick Wins',
    description: 'Alto impacto, baixo esforço',
    color: 'text-emerald-500',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50/50'
  },
  'high-impact-high-effort': {
    title: 'Projetos Maiores',
    description: 'Alto impacto, alto esforço',
    color: 'text-blue-500',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50/50'
  },
  'low-impact-low-effort': {
    title: 'Tarefas Menores',
    description: 'Baixo impacto, baixo esforço',
    color: 'text-amber-500',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50/50'
  },
  'low-impact-high-effort': {
    title: 'Não Recomendado',
    description: 'Baixo impacto, alto esforço',
    color: 'text-red-500',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50/50'
  }
}

const getQuadrant = (feature: Feature): Quadrant => {
  const impact = feature.rice_impact || 0
  const effort = feature.rice_effort || 0
  
  if (impact >= 2 && effort <= 2) return 'high-impact-low-effort'
  if (impact >= 2 && effort > 2) return 'high-impact-high-effort'
  if (impact < 2 && effort <= 2) return 'low-impact-low-effort'
  return 'low-impact-high-effort'
}

export function PriorityMatrix({ features, onFeatureClick }: PriorityMatrixProps) {
  const getFeaturesByQuadrant = (quadrant: Quadrant) => 
    features.filter(f => getQuadrant(f) === quadrant)

  const renderFeature = (feature: Feature) => (
    <Card
      key={feature.id}
      className={cn(
        "p-3 cursor-pointer hover:shadow-md transition-all duration-200",
        "border-[var(--color-border)] hover:border-[var(--color-primary)]"
      )}
      onClick={() => onFeatureClick?.(feature)}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium truncate flex-1">
            {feature.title}
          </h3>
          <Badge 
            variant="secondary" 
            className={cn(
              "ml-2 text-[10px]",
              feature.priority === 'high' && "bg-red-100 text-red-700",
              feature.priority === 'medium' && "bg-yellow-100 text-yellow-700",
              feature.priority === 'low' && "bg-green-100 text-green-700"
            )}
          >
            {feature.priority}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3" />
            <span>I: {feature.rice_impact}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown className="w-3 h-3" />
            <span>E: {feature.rice_effort}</span>
          </div>
          {feature.rice_score && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>RICE: {feature.rice_score.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {(Object.entries(quadrants) as [Quadrant, typeof quadrants[Quadrant]][]).map(([key, quadrant]) => {
        const quadrantFeatures = getFeaturesByQuadrant(key)
        
        return (
          <div 
            key={key}
            className={cn(
              "p-4 rounded-lg border-2 border-dashed",
              quadrant.borderColor,
              quadrant.bgColor
            )}
          >
            <div className="mb-4">
              <h3 className={cn("text-sm font-medium flex items-center gap-2", quadrant.color)}>
                {quadrant.title}
                {quadrantFeatures.length > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {quadrantFeatures.length}
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {quadrant.description}
              </p>
            </div>

            <div className="space-y-2">
              {quadrantFeatures.length > 0 ? (
                quadrantFeatures.map(renderFeature)
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-[var(--color-border)] rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-[var(--color-text-secondary)] mb-2" />
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Nenhuma feature neste quadrante
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
} 