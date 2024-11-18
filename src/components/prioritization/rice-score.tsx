'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Feature } from "@/types/product"
import { Target, Users, Gauge, ArrowUp, Calculator } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RICEScoreProps {
  feature: Feature
  onFeatureClick?: (feature: Feature) => void
}

export function RICEScore({ feature, onFeatureClick }: RICEScoreProps) {
  const riceScore = feature.rice_score || 0

  // Função para determinar a cor do score
  const getScoreColor = (score: number) => {
    if (score >= 100) return "text-emerald-500 bg-emerald-50"
    if (score >= 50) return "text-blue-500 bg-blue-50"
    if (score >= 25) return "text-amber-500 bg-amber-50"
    return "text-red-500 bg-red-50"
  }

  // Componentes de métricas individuais
  const metrics = [
    {
      icon: Users,
      label: 'Reach',
      value: feature.rice_reach || 0,
      tooltip: 'Número de usuários/clientes impactados por trimestre'
    },
    {
      icon: ArrowUp,
      label: 'Impact',
      value: feature.rice_impact || 0,
      tooltip: 'Impacto por usuário (0.25, 0.5, 1, 2, 3)'
    },
    {
      icon: Gauge,
      label: 'Confidence',
      value: feature.rice_confidence || 0,
      tooltip: 'Nível de confiança na estimativa (0-100%)'
    },
    {
      icon: Target,
      label: 'Effort',
      value: feature.rice_effort || 0,
      tooltip: 'Esforço em pessoa-mês'
    }
  ]

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer hover:shadow-md transition-all duration-200",
        "border-[var(--color-border)] hover:border-[var(--color-primary)]"
      )}
      onClick={() => onFeatureClick?.(feature)}
    >
      <div className="space-y-4">
        {/* Cabeçalho com título e score */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium truncate">
              {feature.title}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {feature.description.what}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "flex items-center gap-1.5",
                    getScoreColor(riceScore)
                  )}
                >
                  <Calculator className="w-3 h-3" />
                  {riceScore.toFixed(1)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">RICE Score</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Grid de métricas RICE */}
        <div className="grid grid-cols-4 gap-2">
          {metrics.map((metric) => (
            <TooltipProvider key={metric.label}>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-[var(--color-background-subtle)] hover:bg-[var(--color-background-elevated)] transition-colors">
                    <metric.icon className="w-3.5 h-3.5 text-[var(--color-text-secondary)] mb-1" />
                    <span className="text-xs font-medium">
                      {metric.value}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-medium">{metric.label}</p>
                    <p className="text-[var(--color-text-secondary)]">
                      {metric.tooltip}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </Card>
  )
} 