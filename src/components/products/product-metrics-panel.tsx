'use client'

import { 
  Users, 
  TrendingUp, 
  Archive, 
  Calendar, 
  AlertTriangle,
  BarChart3 
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  status: string
  team?: string[]
  created_at: string
  vision?: string
  target_audience?: string
  risks_count?: number
  metrics_count?: number
}

interface ProductMetricsPanelProps {
  products?: Product[]
}

export function ProductMetricsPanel({ products = [] }: ProductMetricsPanelProps) {
  const metrics = {
    totalActive: products.filter(p => p.status === 'active').length || 0,
    totalArchived: products.filter(p => p.status === 'archived').length || 0,
    createdThisMonth: products.filter(p => {
      const createdAt = new Date(p.created_at)
      const now = new Date()
      return createdAt.getMonth() === now.getMonth() && 
             createdAt.getFullYear() === now.getFullYear()
    }).length || 0,
    withRisks: products.filter(p => p.risks_count && p.risks_count > 0).length || 0,
    withTeam: products.filter(p => p.team && p.team.length > 0).length || 0,
    statusDistribution: {
      active: products.filter(p => p.status === 'active').length || 0,
      development: products.filter(p => p.status === 'development').length || 0,
      archived: products.filter(p => p.status === 'archived').length || 0
    }
  }

  const items = [
    {
      icon: TrendingUp,
      label: 'Ativos',
      value: metrics.totalActive,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8 dark:bg-emerald-500/10'
    },
    {
      icon: Calendar,
      label: 'Este mês',
      value: metrics.createdThisMonth,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10'
    },
    {
      icon: Users,
      label: 'Com time',
      value: metrics.withTeam,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8 dark:bg-violet-500/10'
    },
    {
      icon: AlertTriangle,
      label: 'Riscos',
      value: metrics.withRisks,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/8 dark:bg-amber-500/10'
    },
    {
      icon: Archive,
      label: 'Arquivados',
      value: metrics.totalArchived,
      color: 'text-slate-500',
      bgColor: 'bg-slate-500/8 dark:bg-slate-500/10'
    },
    {
      icon: BarChart3,
      label: 'Status',
      value: `${metrics.statusDistribution.active}/${metrics.statusDistribution.development}/${metrics.statusDistribution.archived}`,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/8 dark:bg-indigo-500/10'
    }
  ]

  return (
    <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
      <div className="h-10 px-4 grid grid-cols-6 gap-4">
        {items.map((item, index) => (
          <div 
            key={item.label}
            className={cn(
              "flex items-center gap-2",
              index !== items.length - 1 && "border-r border-[var(--color-border)]"
            )}
          >
            <div className={cn("p-1 rounded", item.bgColor)}>
              <item.icon className={cn("w-3 h-3", item.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-[var(--color-text-secondary)] truncate">
                {item.label}
              </p>
              <p className="text-sm font-medium -mt-0.5 truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 