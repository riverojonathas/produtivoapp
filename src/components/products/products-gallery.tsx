'use client'

import { IProduct } from '@/types/product'
import { ProductAvatar } from './product-avatar'
import { ProductStatusBadge } from './product-status-badge'
import { useRouter } from 'next/navigation'
import { 
  Users,
  AlertTriangle,
  LineChart,
  ArrowRight,
  Calendar,
  Tag
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProductsGalleryProps {
  products: IProduct[]
}

export function ProductsGallery({ products }: ProductsGalleryProps) {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map(product => (
        <Card 
          key={product.id}
          className="group hover:border-[var(--color-primary)] transition-colors cursor-pointer overflow-hidden"
          onClick={() => router.push(`/products/${product.id}`)}
        >
          {/* Header com Gradiente */}
          <div className="h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6">
            <div className="flex items-start justify-between">
              <ProductAvatar
                src={product.avatar_url}
                className="w-16 h-16 rounded-xl border-2 border-white/10 shadow-lg"
                fallbackClassName="bg-gradient-to-br from-blue-500 to-purple-500"
              >
                {product.name.substring(0, 2).toUpperCase()}
              </ProductAvatar>
              <ProductStatusBadge status={product.status} />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            <h2 className="text-lg font-medium mb-2 group-hover:text-[var(--color-primary)] transition-colors">
              {product.name}
            </h2>
            {product.description && (
              <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-[var(--color-background-subtle)] rounded-lg">
                <div className="flex items-center gap-2 text-violet-500 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium">Time</span>
                </div>
                <span className="text-lg font-semibold">{product.team?.length || 0}</span>
              </div>

              <div className="p-3 bg-[var(--color-background-subtle)] rounded-lg">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Riscos</span>
                </div>
                <span className="text-lg font-semibold">{product.risks_count || 0}</span>
              </div>

              <div className="p-3 bg-[var(--color-background-subtle)] rounded-lg">
                <div className="flex items-center gap-2 text-blue-500 mb-1">
                  <LineChart className="w-4 h-4" />
                  <span className="text-xs font-medium">Métricas</span>
                </div>
                <span className="text-lg font-semibold">{product.metrics_count || 0}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">
                  {format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}
                </span>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  {product.tags.slice(0, 2).map(tag => (
                    <Badge 
                      key={tag.id}
                      variant="secondary"
                      className={`${tag.color || ''} text-xs`}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                  {product.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{product.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 