'use client'

import { Card } from "@/components/ui/card"
import { ProductActionsMenu } from "./product-actions-menu"
import { Badge } from "@/components/ui/badge"
import { Target, Lightbulb, AlertTriangle, ArrowUp, Users, ListChecks } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ProductAvatar } from './product-avatar'

interface Product {
  id: string
  name: string
  description: string
  status: string
  team?: string[]
  created_at: string
  owner_id: string
  avatar_url?: string | null
  vision?: string | null
  target_audience?: string | null
  risks_count?: number
  metrics_count?: number
}

interface ProductKanbanProps {
  products: Product[]
}

const columns = [
  { id: 'active', title: 'Ativos', color: 'bg-green-500' },
  { id: 'development', title: 'Em Desenvolvimento', color: 'bg-blue-500' },
  { id: 'archived', title: 'Arquivados', color: 'bg-gray-500' }
]

export function ProductKanban({ products }: ProductKanbanProps) {
  const getColumnProducts = (columnId: string) => 
    products.filter(product => product.status === columnId)

  return (
    <div className="h-full flex gap-6">
      {columns.map(column => (
        <div key={column.id} className="flex-1 min-w-[320px] flex flex-col">
          {/* Cabeçalho da Coluna */}
          <div className="mb-4 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${column.color}`} />
            <h3 className="text-sm font-medium">
              {column.title}
            </h3>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {getColumnProducts(column.id).length}
            </span>
          </div>

          {/* Lista de Produtos */}
          <div className="flex-1 space-y-3">
            {getColumnProducts(column.id).map(product => (
              <Card 
                key={product.id}
                className="bg-[var(--color-background-primary)] hover:bg-[var(--color-background-subtle)] transition-all duration-200"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <ProductAvatar
                      className="w-10 h-10 rounded-lg border border-[var(--color-border)]"
                      src={product.avatar_url}
                    >
                      {product.name.substring(0, 2).toUpperCase()}
                    </ProductAvatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                        <ProductActionsMenu product={product} />
                      </div>

                      {/* Badges */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.target_audience && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <Target className="w-3 h-3" />
                            {product.target_audience}
                          </Badge>
                        )}
                        {product.vision && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <Lightbulb className="w-3 h-3" />
                            Visão definida
                          </Badge>
                        )}
                        {product.risks_count && product.risks_count > 0 && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            {product.risks_count} riscos
                          </Badge>
                        )}
                        {product.metrics_count && product.metrics_count > 0 && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <ArrowUp className="w-3 h-3" />
                            {product.metrics_count} métricas
                          </Badge>
                        )}
                      </div>

                      {/* Metadados */}
                      <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{product.team?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ListChecks className="w-3.5 h-3.5" />
                            <span>0</span>
                          </div>
                        </div>
                        <span suppressHydrationWarning>
                          {format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 