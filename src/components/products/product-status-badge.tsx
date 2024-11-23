'use client'

import { Badge } from "@/components/ui/badge"
import { ProductStatus, productStatusConfig } from "@/types/product"
import { LucideIcon } from 'lucide-react'

interface ProductStatusBadgeProps {
  status: ProductStatus
  size?: 'sm' | 'md'
}

export function ProductStatusBadge({ status, size = 'md' }: ProductStatusBadgeProps) {
  const config = productStatusConfig[status]
  const Icon: LucideIcon = config.icon

  return (
    <Badge 
      variant="secondary"
      className={`
        flex items-center gap-1.5
        ${config.bgColor} ${config.color}
        ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'px-2.5 py-1'}
      `}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {size === 'sm' ? (
        <span className="sr-only">{config.label}</span>
      ) : (
        <span>{config.label}</span>
      )}
    </Badge>
  )
} 