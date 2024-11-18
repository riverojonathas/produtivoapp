'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/use-products'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Users,
  ListChecks,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ProductActionsMenu } from '@/components/products/product-actions-menu'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string
  status: string
  team?: string[]
  created_at: string
  owner_id: string
}

export default function ProductsPage() {
  const { products = [], isLoading } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderGridView = (product: Product) => (
    <Card key={product.id} className="group bg-[var(--color-background-primary)] hover:bg-[var(--color-background-subtle)] transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
              {product.name}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2">
              {product.description}
            </p>
          </div>
          <ProductActionsMenu product={product} />
        </div>
        
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
          <span>
            {format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
        </div>
      </div>
    </Card>
  )

  const renderListView = (product: Product) => (
    <Card key={product.id} className="group bg-[var(--color-background-primary)] hover:bg-[var(--color-background-subtle)] transition-all duration-200">
      <div className="p-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                {product.name}
              </h3>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-1">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{product.team?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <ListChecks className="w-3.5 h-3.5" />
            <span>0</span>
          </div>
          <span>
            {format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
        </div>

        <ProductActionsMenu product={product} />
      </div>
    </Card>
  )

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Toolbar Unificada */}
      <div className="bg-[var(--color-background-primary)]">
        <div className="h-14 px-4 flex items-center justify-between gap-4 border-b border-[var(--color-border)]">
          {/* Título e Contagem */}
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
              Produtos
            </h1>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {products.length}
            </span>
          </div>

          {/* Busca */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-sm bg-[var(--color-background-elevated)] border-[var(--color-border)]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {/* Botão de Filtros */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </Button>

            {/* Botões de Visualização */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-8 px-2.5",
                  viewMode === 'grid' 
                    ? "text-[var(--color-text-primary)]" 
                    : "text-[var(--color-text-secondary)]"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-8 px-2.5",
                  viewMode === 'list' 
                    ? "text-[var(--color-text-primary)]" 
                    : "text-[var(--color-text-secondary)]"
                )}
              >
                <List className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Botão Novo Produto */}
            <Button 
              size="sm"
              className="h-8 px-3 text-xs bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
              onClick={() => router.push('/products/new')}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-secondary)]">Carregando...</div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando um novo produto'}
            </p>
          </div>
        ) : (
          <div className={cn(
            "gap-4",
            viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"
          )}>
            {filteredProducts.map(product => 
              viewMode === 'grid' ? renderGridView(product) : renderListView(product)
            )}
          </div>
        )}
      </div>
    </div>
  )
} 