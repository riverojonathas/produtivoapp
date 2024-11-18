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
  Users,
  ListChecks,
  Columns,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Archive,
  BarChart3,
  Target, 
  Lightbulb, 
  ArrowUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ProductActionsMenu } from '@/components/products/product-actions-menu'
import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { ProductFilters } from '@/components/products/product-filters'
import { ProductKanban } from '@/components/products/product-kanban'
import { ProductAvatar } from '@/components/products/product-avatar'
import { Checkbox } from "@/components/ui/checkbox"
import { ProductExportDialog } from '@/components/products/product-export-dialog'
import { ProductStatusBadge } from '@/components/products/product-status-badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  priority?: string
  progress?: number
}

type ViewMode = 'grid' | 'list' | 'kanban'

export default function ProductsPage() {
  const { products = [], isLoading } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const router = useRouter()
  const [filters, setFilters] = useState({
    status: [],
    dateRange: 'all',
    hasVision: null,
    hasTeam: null,
    hasRisks: null,
    hasMetrics: null
  })
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showMetrics, setShowMetrics] = useState(true)

  const items = [
    {
      icon: TrendingUp,
      label: 'Ativos',
      value: products.filter(p => p.status === 'active').length || 0,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8 dark:bg-emerald-500/10'
    },
    {
      icon: AlertTriangle,
      label: 'Riscos',
      value: products.filter(p => p.risks_count && p.risks_count > 0).length || 0,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/8 dark:bg-amber-500/10'
    },
    {
      icon: BarChart3,
      label: 'Em Desenvolvimento',
      value: products.filter(p => p.status === 'development').length || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10'
    },
    {
      icon: Archive,
      label: 'Arquivados',
      value: products.filter(p => p.status === 'archived').length || 0,
      color: 'text-slate-500',
      bgColor: 'bg-slate-500/8 dark:bg-slate-500/10'
    }
  ]

  const filteredProducts = products.filter(product => {
    // Filtro de busca
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    // Filtro de status
    if (filters.status.length > 0 && !filters.status.includes(product.status)) {
      return false
    }

    // Filtro de data
    if (filters.dateRange !== 'all') {
      const productDate = new Date(product.created_at)
      const daysAgo = subDays(new Date(), parseInt(filters.dateRange))
      if (productDate < daysAgo) return false
    }

    // Filtro de características
    if (filters.hasVision !== null && !!product.vision !== filters.hasVision) return false
    if (filters.hasTeam !== null && !!(product.team?.length) !== filters.hasTeam) return false
    if (filters.hasRisks !== null && !!(product.risks_count) !== filters.hasRisks) return false
    if (filters.hasMetrics !== null && !!(product.metrics_count) !== filters.hasMetrics) return false

    return true
  })

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
    }
  }

  const handleBulkAction = async (action: 'archive' | 'delete' | 'export') => {
    try {
      switch (action) {
        case 'archive':
          await Promise.all(
            Array.from(selectedProducts).map(id =>
              updateProduct.mutateAsync({
                id,
                data: { status: 'archived' }
              })
            )
          )
          toast.success('Produtos arquivados com sucesso')
          break

        case 'delete':
          await Promise.all(
            Array.from(selectedProducts).map(id =>
              deleteProduct.mutateAsync(id)
            )
          )
          toast.success('Produtos excluídos com sucesso')
          break

        case 'export':
          setShowExportDialog(true)
          return // Não limpar seleção ainda
      }
      setSelectedProducts(new Set())
      setIsSelectionMode(false)
    } catch (error) {
      console.error('Erro na ação em lote:', error)
      toast.error('Erro ao processar ação em lote')
    }
  }

  const renderGridView = (product: Product) => (
    <Card 
      key={product.id} 
      className={cn(
        "group bg-[var(--color-background-primary)] hover:bg-[var(--color-background-subtle)] transition-all duration-200",
        isSelectionMode && "cursor-pointer"
      )}
      onClick={(e) => {
        if (isSelectionMode) {
          handleSelectProduct(product.id)
        } else {
          // Não navegar se clicar no menu de ações
          if (!(e.target as HTMLElement).closest('.product-actions-menu')) {
            router.push(`/products/${product.id}`)
          }
        }
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {isSelectionMode && (
            <Checkbox
              checked={selectedProducts.has(product.id)}
              onCheckedChange={() => handleSelectProduct(product.id)}
              className="mt-1"
            />
          )}
          <ProductAvatar 
            className="w-10 h-10 rounded-lg border border-[var(--color-border)]"
            src={product.avatar_url}
          >
            {product.name.substring(0, 2).toUpperCase()}
          </ProductAvatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {product.name}
                  </h3>
                  <ProductStatusBadge status={product.status} />
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2">
                  {product.description}
                </p>
              </div>
              <ProductActionsMenu product={product} />
            </div>

            {/* Badges de informações */}
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
              {product.priority && (
                <ProductStatusBadge status={product.priority} />
              )}
            </div>

            {/* Indicador de Progresso */}
            {product.progress && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-secondary)]">Progresso</span>
                  <span className="font-medium">{product.progress}%</span>
                </div>
                <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                    style={{ width: `${product.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
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
          <span suppressHydrationWarning>
            {format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
        </div>
      </div>
    </Card>
  )

  const renderListView = (product: Product) => (
    <Card 
      key={product.id} 
      className={cn(
        "group bg-[var(--color-background-primary)] hover:bg-[var(--color-background-subtle)] transition-all duration-200",
        isSelectionMode && "cursor-pointer"
      )}
      onClick={() => isSelectionMode && handleSelectProduct(product.id)}
    >
      <div className="p-4 flex items-center gap-4">
        {isSelectionMode && (
          <Checkbox
            checked={selectedProducts.has(product.id)}
            onCheckedChange={() => handleSelectProduct(product.id)}
            className="mt-1"
          />
        )}
        <ProductAvatar 
          className="w-10 h-10 rounded-lg border border-[var(--color-border)]"
          src={product.avatar_url}
        >
          {product.name.substring(0, 2).toUpperCase()}
        </ProductAvatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {product.name}
                </h3>
                <ProductStatusBadge status={product.status} />
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-1">
                {product.description}
              </p>
            </div>
          </div>

          {/* Badges de informações */}
          <div className="mt-2 flex flex-wrap gap-2">
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
            {product.priority && (
              <ProductStatusBadge status={product.priority} />
            )}
          </div>

          {/* Indicador de Progresso */}
          {product.progress && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[var(--color-text-secondary)]">Progresso</span>
                <span className="font-medium">{product.progress}%</span>
              </div>
              <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                  style={{ width: `${product.progress}%` }}
                />
              </div>
            </div>
          )}
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
          <span suppressHydrationWarning>
            {format(new Date(product.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
        </div>

        <ProductActionsMenu product={product} />
      </div>
    </Card>
  )

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho Unificado */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo - Título, Botão Novo e Métricas */}
          <div className="flex items-center gap-6">
            {/* Título e Botão Novo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Produtos
                </h1>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {products.length}
                </span>
              </div>

              <Button 
                size="sm"
                className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                onClick={() => router.push('/products/new')}
                title="Novo Produto"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Separador Vertical */}
            <div className="h-4 w-px bg-[var(--color-border)]" />

            {/* Métricas Compactas */}
            {!isSelectionMode && (
              <div className="flex items-center gap-4">
                {items.map((item, index) => (
                  <TooltipProvider key={item.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            "flex items-center gap-2",
                            index !== items.length - 1 && "border-r border-[var(--color-border)] pr-4"
                          )}
                        >
                          <div className={cn("p-1 rounded", item.bgColor)}>
                            <item.icon className={cn("w-3 h-3", item.color)} />
                          </div>
                          <p className="text-sm font-medium">
                            {item.value}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="center">
                        <p className="text-xs font-medium">{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}
          </div>

          {/* Lado Direito - Ferramentas */}
          <div className="flex items-center gap-3">
            {isSelectionMode ? (
              <>
                {/* Modo de Seleção */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSelectionMode(false)
                    setSelectedProducts(new Set())
                  }}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <div className="h-4 w-px bg-[var(--color-border)]" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {selectedProducts.size === filteredProducts.length 
                    ? 'Desmarcar Todos' 
                    : 'Selecionar Todos'}
                </Button>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {selectedProducts.size} selecionado(s)
                </span>
                {selectedProducts.size > 0 && (
                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBulkAction('archive')}
                      className="text-xs"
                    >
                      Arquivar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBulkAction('export')}
                      className="text-xs"
                    >
                      Exportar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBulkAction('delete')}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Excluir
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-sm bg-[var(--color-background-elevated)] border-[var(--color-border)] w-[200px]"
                  />
                </div>

                {/* Filtros */}
                <ProductFilters onFiltersChange={setFilters} />

                {/* Visualizações */}
                <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "h-8 w-8 p-0",
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
                      "h-8 w-8 p-0",
                      viewMode === 'list' 
                        ? "text-[var(--color-text-primary)]" 
                        : "text-[var(--color-text-secondary)]"
                    )}
                  >
                    <List className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                    className={cn(
                      "h-8 w-8 p-0",
                      viewMode === 'kanban' 
                        ? "text-[var(--color-text-primary)]" 
                        : "text-[var(--color-text-secondary)]"
                    )}
                  >
                    <Columns className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </>
            )}
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
          viewMode === 'kanban' ? (
            <ProductKanban products={filteredProducts} />
          ) : (
            <div className={cn(
              "gap-4",
              viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"
            )}>
              {filteredProducts.map(product => 
                viewMode === 'grid' ? renderGridView(product) : renderListView(product)
              )}
            </div>
          )
        )}
      </div>

      <ProductExportDialog
        products={filteredProducts.filter(p => selectedProducts.has(p.id))}
        open={showExportDialog}
        onOpenChange={(open) => {
          setShowExportDialog(open)
          if (!open) {
            setSelectedProducts(new Set())
            setIsSelectionMode(false)
          }
        }}
      />
    </div>
  )
} 