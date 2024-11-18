'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Feature } from "@/types/product"
import { AlertTriangle, Target, ArrowUp, ArrowDown } from "lucide-react"

interface MoscowBoardProps {
  features: Feature[]
  onFeatureClick?: (feature: Feature) => void
}

type MoscowCategory = 'must' | 'should' | 'could' | 'wont'

const categories: Record<MoscowCategory, {
  title: string
  description: string
  color: string
  borderColor: string
  bgColor: string
}> = {
  'must': {
    title: 'Must Have',
    description: 'Requisitos essenciais',
    color: 'text-red-500',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50/50'
  },
  'should': {
    title: 'Should Have',
    description: 'Importantes mas não críticos',
    color: 'text-amber-500',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50/50'
  },
  'could': {
    title: 'Could Have',
    description: 'Desejáveis se houver recursos',
    color: 'text-blue-500',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50/50'
  },
  'wont': {
    title: "Won't Have",
    description: 'Não serão implementados agora',
    color: 'text-gray-500',
    borderColor: 'border-gray-200',
    bgColor: 'bg-gray-50/50'
  }
}

export function MoscowBoard({ features, onFeatureClick }: MoscowBoardProps) {
  const getFeaturesByCategory = (category: MoscowCategory) => 
    features.filter(f => f.moscow_priority === category)

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
          {feature.rice_score && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>RICE: {feature.rice_score.toFixed(1)}</span>
            </div>
          )}
          {feature.priority === 'high' && (
            <div className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3 text-red-500" />
              <span>Alta Prioridade</span>
            </div>
          )}
          {feature.priority === 'low' && (
            <div className="flex items-center gap-1">
              <ArrowDown className="w-3 h-3 text-green-500" />
              <span>Baixa Prioridade</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {(Object.entries(categories) as [MoscowCategory, typeof categories[MoscowCategory]][]).map(([key, category]) => {
        const categoryFeatures = getFeaturesByCategory(key)
        
        return (
          <div 
            key={key}
            className={cn(
              "p-4 rounded-lg border-2 border-dashed",
              category.borderColor,
              category.bgColor
            )}
          >
            <div className="mb-4">
              <h3 className={cn("text-sm font-medium flex items-center gap-2", category.color)}>
                {category.title}
                {categoryFeatures.length > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {categoryFeatures.length}
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {category.description}
              </p>
            </div>

            <div className="space-y-2">
              {categoryFeatures.length > 0 ? (
                categoryFeatures.map(renderFeature)
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-[var(--color-border)] rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-[var(--color-text-secondary)] mb-2" />
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Nenhuma feature nesta categoria
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