'use client'

import { Product } from '@/types/product'
import { cn } from '@/lib/utils'
import { MoreHorizontal, Users2, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

interface ProductListProps {
  products: Product[]
  onProductClick?: (product: Product) => void
}

export function ProductList({ products, onProductClick }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className={cn(
            "group relative p-4 rounded-lg border border-[var(--color-border)]",
            "hover:border-[var(--color-border-strong)] transition-all duration-200",
            "bg-[var(--color-background-elevated)]"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-[var(--color-text-primary)]">
                {product.name}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                {product.description}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onProductClick?.(product)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 hover:text-red-600">
                  Arquivar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Estatísticas */}
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              <span>3 Features</span>
            </div>
            <div className="flex items-center gap-1">
              <Users2 className="w-3.5 h-3.5" />
              <span>{product.team?.length || 0} Membros</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 