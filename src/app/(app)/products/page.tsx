'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/use-products'
import { 
  ProductCard,
  ProductsKanban,
  ProductsTable,
  ProductsGallery,
  NewProductButton
} from '@/components/products'
import { 
  Button,
  Card,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui"
import { 
  LayoutGrid, 
  LayoutList, 
  Kanban, 
  Grid2x2,
  Rocket,
  Hammer,
  Archive,
  Plus
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ViewMode = 'grid' | 'table' | 'kanban' | 'gallery'

const viewModeConfig = {
  grid: {
    icon: LayoutGrid,
    label: 'Visualização em Grid'
  },
  table: {
    icon: LayoutList,
    label: 'Visualização em Tabela'
  },
  kanban: {
    icon: Kanban,
    label: 'Visualização Kanban'
  },
  gallery: {
    icon: Grid2x2,
    label: 'Visualização em Galeria'
  }
} as const

export default function ProductsPage() {
  const router = useRouter()
  const { products, isLoading } = useProducts()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Calcular métricas
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.status === 'active').length
  const inDevelopment = products.filter(p => p.status === 'development').length
  const archivedProducts = products.filter(p => p.status === 'archived').length

  // Renderizar a visualização correta
  const renderView = () => {
    switch (viewMode) {
      case 'table':
        return <ProductsTable products={products} />
      case 'kanban':
        return <ProductsKanban products={products} />
      case 'gallery':
        return <ProductsGallery products={products} />
      default:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => router.push(`/products/${product.id}`)}
              />
            ))}
          </div>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Header */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-sm font-medium">Produtos</h1>
            
            {/* Métricas com Tooltips */}
            <div className="flex items-center gap-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-[var(--color-primary)]">{totalProducts}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Total de Produtos</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500 ml-1">{activeProducts}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Produtos Ativos</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Hammer className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-500 ml-1">{inDevelopment}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Em Desenvolvimento</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center">
                        <Archive className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-500 ml-1">{archivedProducts}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Produtos Arquivados</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Seletor de Visualização */}
            <div className="flex items-center gap-1 bg-[var(--color-background-subtle)] p-1 rounded-lg">
              <TooltipProvider>
                {(Object.entries(viewModeConfig) as [ViewMode, typeof viewModeConfig[keyof typeof viewModeConfig]][]).map(([mode, config]) => (
                  <Tooltip key={mode}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${viewMode === mode ? 'bg-white shadow-sm' : ''}`}
                        onClick={() => setViewMode(mode)}
                      >
                        <config.icon className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{config.label}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            <NewProductButton />
          </div>
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {products.length > 0 ? renderView() : <NewProductButton variant="empty-state" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 