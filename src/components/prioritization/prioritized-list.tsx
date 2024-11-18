'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Feature } from "@/types/product"
import { Target, ArrowUp, ArrowDown, Calculator, Clock, AlertTriangle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PrioritizedListProps {
  features: Feature[]
  onFeatureClick?: (feature: Feature) => void
}

export function PrioritizedList({ features, onFeatureClick }: PrioritizedListProps) {
  // Ordenar features por RICE score (se disponível) ou prioridade
  const sortedFeatures = [...features].sort((a, b) => {
    if (a.rice_score && b.rice_score) {
      return b.rice_score - a.rice_score
    }
    
    const priorityWeight = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1
    }
    
    return priorityWeight[b.priority] - priorityWeight[a.priority]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return "bg-emerald-100 text-emerald-700"
      case 'doing':
        return "bg-blue-100 text-blue-700"
      case 'blocked':
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return "bg-red-100 text-red-700"
      case 'high':
        return "bg-orange-100 text-orange-700"
      case 'medium':
        return "bg-yellow-100 text-yellow-700"
      case 'low':
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getMoscowColor = (priority?: string) => {
    switch (priority) {
      case 'must':
        return "bg-red-100 text-red-700"
      case 'should':
        return "bg-amber-100 text-amber-700"
      case 'could':
        return "bg-blue-100 text-blue-700"
      case 'wont':
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Feature</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>RICE Score</TableHead>
            <TableHead>MoSCoW</TableHead>
            <TableHead>Métricas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFeatures.map((feature) => (
            <TableRow
              key={feature.id}
              className="cursor-pointer hover:bg-[var(--color-background-subtle)]"
              onClick={() => onFeatureClick?.(feature)}
            >
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{feature.title}</span>
                  <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                    {feature.description.what}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getStatusColor(feature.status))}
                >
                  {feature.status === 'done' && "Concluída"}
                  {feature.status === 'doing' && "Em Progresso"}
                  {feature.status === 'blocked' && "Bloqueada"}
                  {feature.status === 'backlog' && "Backlog"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getPriorityColor(feature.priority))}
                >
                  {feature.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {feature.rice_score ? (
                  <div className="flex items-center gap-2">
                    <Calculator className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                    <span className="font-medium">{feature.rice_score.toFixed(1)}</span>
                  </div>
                ) : (
                  <span className="text-xs text-[var(--color-text-secondary)]">-</span>
                )}
              </TableCell>
              <TableCell>
                {feature.moscow_priority ? (
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs", getMoscowColor(feature.moscow_priority))}
                  >
                    {feature.moscow_priority}
                  </Badge>
                ) : (
                  <span className="text-xs text-[var(--color-text-secondary)]">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {feature.rice_reach && (
                    <div className="flex items-center gap-1 text-xs">
                      <Target className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                      <span>{feature.rice_reach}</span>
                    </div>
                  )}
                  {feature.rice_impact && (
                    <div className="flex items-center gap-1 text-xs">
                      <ArrowUp className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                      <span>{feature.rice_impact}</span>
                    </div>
                  )}
                  {feature.rice_effort && (
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                      <span>{feature.rice_effort}</span>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
} 