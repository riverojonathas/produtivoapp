'use client'

import { useRouter } from 'next/navigation'
import { IProduct } from '@/types/product'
import { ProductAvatar } from './product-avatar'
import { ProductStatusBadge } from './product-status-badge'
import { Users, AlertTriangle, LineChart, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnimatedCard } from '@/components/ui/animated-card'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: IProduct
  variant?: 'default' | 'compact'
  onClick?: () => void
  delay?: number
}

export function ProductCard({ 
  product, 
  variant = 'default',
  onClick,
  delay = 0
}: ProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(`/products/${product.id}`)
    }
  }

  const content = (
    <div className="flex items-start gap-4">
      <ProductAvatar
        src={product.avatar_url}
        className={cn(
          "border border-[var(--color-border)]",
          variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'
        )}
        fallbackClassName="bg-gradient-to-br from-blue-500 to-purple-500"
      >
        {product.name.substring(0, 2).toUpperCase()}
      </ProductAvatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium truncate group-hover:text-[var(--color-primary)] transition-colors">
            {product.name}
          </h2>
          <ProductStatusBadge status={product.status} size={variant === 'compact' ? 'sm' : 'md'} />
        </div>

        {product.description && (
          <p className={cn(
            "text-[var(--color-text-secondary)] truncate",
            variant === 'compact' ? 'text-xs mt-0.5' : 'text-sm mt-1'
          )}>
            {product.description}
          </p>
        )}

        <div className={cn(
          "flex items-center gap-4 text-[var(--color-text-secondary)]",
          variant === 'compact' ? 'mt-2' : 'mt-4'
        )}>
          <div className="flex items-center gap-1">
            <Users className={variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            <span className="text-xs">{product.team?.length || 0}</span>
          </div>

          <div className="flex items-center gap-1">
            <AlertTriangle className={variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            <span className="text-xs">{product.risks_count || 0}</span>
          </div>

          <div className="flex items-center gap-1">
            <LineChart className={variant === 'compact' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            <span className="text-xs">{product.metrics_count || 0}</span>
          </div>

          {variant === 'default' && (
            <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
    </div>
  )

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className="cursor-pointer"
      >
        <AnimatedCard
          delay={delay}
          className="p-3 hover:border-[var(--color-primary)] transition-colors group"
        >
          {content}
        </AnimatedCard>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <AnimatedCard
        delay={delay}
        className="p-4 hover:border-[var(--color-primary)] transition-colors group"
      >
        {content}
      </AnimatedCard>
    </motion.div>
  )
} 