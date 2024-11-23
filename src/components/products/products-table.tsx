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
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ProductsTableProps {
  products: IProduct[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()

  return (
    <div className="relative overflow-x-auto rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-border)]">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Produto</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Time</th>
            <th className="px-4 py-3 text-left font-medium">Riscos</th>
            <th className="px-4 py-3 text-left font-medium">Métricas</th>
            <th className="px-4 py-3 text-left font-medium">Criado em</th>
            <th className="px-4 py-3 text-left font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {products.map(product => (
            <tr 
              key={product.id}
              className="hover:bg-[var(--color-background-subtle)] transition-colors cursor-pointer"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <ProductAvatar
                    src={product.avatar_url}
                    className="w-8 h-8 rounded-lg border border-[var(--color-border)]"
                    fallbackClassName="bg-gradient-to-br from-blue-500 to-purple-500"
                  >
                    {product.name.substring(0, 2).toUpperCase()}
                  </ProductAvatar>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-[var(--color-text-secondary)] truncate max-w-[300px]">
                        {product.description}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <ProductStatusBadge status={product.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                  <Users className="w-4 h-4" />
                  <span>{product.team?.length || 0}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{product.risks_count || 0}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                  <LineChart className="w-4 h-4" />
                  <span>{product.metrics_count || 0}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <ArrowRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 