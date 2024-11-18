'use client'

import { useState } from 'react'
import { Feature } from '@/types/product'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RoadmapDependenciesProps {
  features: Feature[]
  onFeatureClick?: (feature: Feature) => void
}

export function RoadmapDependencies({ features, onFeatureClick }: RoadmapDependenciesProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null)

  // Função para verificar se há dependência circular
  const hasCircularDependency = (featureId: string, dependencies: string[], visited = new Set<string>()): boolean => {
    if (visited.has(featureId)) return true
    visited.add(featureId)

    const feature = features.find(f => f.id === featureId)
    if (!feature) return false

    for (const depId of dependencies) {
      const depFeature = features.find(f => f.id === depId)
      if (!depFeature) continue

      if (hasCircularDependency(depId, depFeature.dependencies, new Set(visited))) {
        return true
      }
    }

    return false
  }

  // Função para verificar se as datas das dependências são válidas
  const hasInvalidDates = (feature: Feature): boolean => {
    if (!feature.start_date || !feature.dependencies.length) return false

    const featureStartDate = new Date(feature.start_date)
    
    return feature.dependencies.some(depId => {
      const depFeature = features.find(f => f.id === depId)
      if (!depFeature?.end_date) return true
      return new Date(depFeature.end_date) > featureStartDate
    })
  }

  return (
    <div className="space-y-4">
      {features.map(feature => {
        const hasDependencies = feature.dependencies.length > 0
        const isCircular = hasCircularDependency(feature.id, feature.dependencies)
        const hasDateIssue = hasInvalidDates(feature)
        const hasIssues = isCircular || hasDateIssue

        return (
          <Card
            key={feature.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200",
              "hover:shadow-md",
              hoveredFeature === feature.id && "border-[var(--color-primary)]",
              hasIssues && "border-amber-500"
            )}
            onMouseEnter={() => setHoveredFeature(feature.id)}
            onMouseLeave={() => setHoveredFeature(null)}
            onClick={() => onFeatureClick?.(feature)}
          >
            <div className="space-y-3">
              {/* Cabeçalho */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">{feature.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {feature.status}
                    </Badge>
                    {hasIssues && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              {isCircular && (
                                <p className="text-amber-500">Dependência circular detectada</p>
                              )}
                              {hasDateIssue && (
                                <p className="text-amber-500">Datas de dependência inválidas</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>

              {/* Dependências */}
              {hasDependencies && (
                <div className="space-y-2">
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Depende de:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.dependencies.map(depId => {
                      const depFeature = features.find(f => f.id === depId)
                      if (!depFeature) return null

                      return (
                        <div
                          key={depId}
                          className="flex items-center gap-1.5 text-xs"
                        >
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-[10px]",
                              depFeature.status === 'done' && "bg-emerald-100 text-emerald-700",
                              depFeature.status === 'doing' && "bg-blue-100 text-blue-700",
                              depFeature.status === 'blocked' && "bg-red-100 text-red-700"
                            )}
                          >
                            {depFeature.title}
                          </Badge>
                          <ArrowRight className="w-3 h-3 text-[var(--color-text-secondary)]" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
} 