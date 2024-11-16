import { cn } from '@/lib/utils'
import { FeaturePriority } from '@/types/product'
import { AlertTriangle, ArrowUp, Minus, Zap } from 'lucide-react'

interface PriorityBadgeProps {
  priority: FeaturePriority
  className?: string
  compact?: boolean
}

const priorityConfig = {
  urgent: {
    label: 'Urgente',
    shortLabel: 'U',
    icon: AlertTriangle,
    className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300'
  },
  high: {
    label: 'Alta',
    shortLabel: 'A',
    icon: ArrowUp,
    className: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300'
  },
  medium: {
    label: 'Média',
    shortLabel: 'M',
    icon: Minus,
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300'
  },
  low: {
    label: 'Baixa',
    shortLabel: 'B',
    icon: Zap,
    className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300'
  }
}

export function PriorityBadge({ priority, className, compact = false }: PriorityBadgeProps) {
  const config = priorityConfig[priority]

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border rounded-full",
        compact ? "w-5 h-5 text-[10px] font-medium" : "px-2.5 py-0.5 text-xs gap-1",
        config.className,
        className
      )}
      title={config.label}
    >
      {compact ? (
        config.shortLabel
      ) : (
        <>
          <config.icon className="w-3 h-3" />
          {config.label}
        </>
      )}
    </span>
  )
} 