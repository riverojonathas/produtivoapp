'use client'

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Circle } from "lucide-react"

interface ProductStatusBadgeProps {
  status: string
  className?: string
}

const statusConfig = {
  active: {
    label: 'Ativo',
    color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    dotColor: 'text-green-500'
  },
  development: {
    label: 'Em Desenvolvimento',
    color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    dotColor: 'text-blue-500'
  },
  archived: {
    label: 'Arquivado',
    color: 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
    dotColor: 'text-gray-500'
  },
  high: {
    label: 'Alta Prioridade',
    color: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    dotColor: 'text-red-500'
  },
  medium: {
    label: 'Média Prioridade',
    color: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
    dotColor: 'text-yellow-500'
  },
  low: {
    label: 'Baixa Prioridade',
    color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    dotColor: 'text-green-500'
  }
}

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
    dotColor: 'text-gray-500'
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "gap-1.5 pl-2 pr-2.5 font-normal",
        config.color,
        className
      )}
    >
      <Circle className={cn("w-2 h-2 fill-current", config.dotColor)} />
      {config.label}
    </Badge>
  )
} 