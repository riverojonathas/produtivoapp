'use client'

import { IProduct } from '@/types/product'
import { Card } from '@/components/ui/card'
import { ProductCard } from './product-card'
import { Archive, Rocket, Hammer } from 'lucide-react'

interface ProductsKanbanProps {
  products: IProduct[]
}

export function ProductsKanban({ products }: ProductsKanbanProps) {
  const columns = [
    {
      id: 'development',
      title: 'Em Desenvolvimento',
      icon: Hammer,
      color: 'text-blue-500',
      products: products.filter(p => p.status === 'development')
    },
    {
      id: 'active',
      title: 'Ativos',
      icon: Rocket,
      color: 'text-green-500',
      products: products.filter(p => p.status === 'active')
    },
    {
      id: 'archived',
      title: 'Arquivados',
      icon: Archive,
      color: 'text-gray-400',
      products: products.filter(p => p.status === 'archived')
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {columns.map(column => {
        const Icon = column.icon
        
        return (
          <div key={column.id} className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Icon className={`w-4 h-4 ${column.color}`} />
              <h3 className="text-sm font-medium">{column.title}</h3>
              <span className="text-xs text-[var(--color-text-secondary)] ml-auto">
                {column.products.length}
              </span>
            </div>

            <Card className="flex-1 p-4 bg-[var(--color-background-subtle)] border-2 border-dashed">
              <div className="space-y-3">
                {column.products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="compact"
                  />
                ))}
              </div>
            </Card>
          </div>
        )
      })}
    </div>
  )
} 