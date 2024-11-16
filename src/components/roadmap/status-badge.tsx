import { cn } from '@/lib/utils'
import { FeatureStatus } from '@/types/product'

interface StatusBadgeProps {
  status: FeatureStatus
  className?: string
  compact?: boolean
}

const statusConfig = {
  planned: {
    label: 'Planejado',
    shortLabel: 'P',
    className: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
  },
  'in-progress': {
    label: 'Em Progresso',
    shortLabel: 'IP',
    className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300'
  },
  completed: {
    label: 'Concluído',
    shortLabel: 'C',
    className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300'
  },
  blocked: {
    label: 'Bloqueado',
    shortLabel: 'B',
    className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300'
  }
}

export function StatusBadge({ status, className, compact = false }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border rounded-full",
        compact ? "w-5 h-5 text-[10px] font-medium" : "px-2.5 py-0.5 text-xs",
        statusConfig[status].className,
        className
      )}
      title={statusConfig[status].label}
    >
      {compact ? statusConfig[status].shortLabel : statusConfig[status].label}
    </span>
  )
} 