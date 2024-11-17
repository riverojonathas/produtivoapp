'use client'

import { useState } from 'react'
import { Plus, Search, LayoutGrid, List, MoreVertical, Pencil, Trash, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProducts } from '@/hooks/use-products'
import { AddProductDialog } from '@/components/products/add-product-dialog'
import { EditProductDialog } from '@/components/products/edit-product-dialog'
import { DeleteProductDialog } from '@/components/products/delete-product-dialog'
import { cn } from '@/lib/utils'
import { Product } from '@/types/product'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ViewMode = 'grid' | 'list'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const { products, isLoading } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  // Filtrar produtos por busca
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
      case 'inactive':
        return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300'
      case 'archived':
        return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Produtos
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gerencie seus produtos e equipes
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros e Visualização */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 bg-[var(--color-background-elevated)] p-1 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={cn(
              "gap-2",
              viewMode === 'grid' && "bg-white shadow-sm"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-xs">Grid</span>
          </Button>
          <Button
            variant="list"
            size="sm"
            onClick={() => setViewMode('list')}
            className={cn(
              "gap-2",
              viewMode === 'list' && "bg-white shadow-sm"
            )}
          >
            <List className="w-4 h-4 mr-2" />
            <span className="text-xs">Lista</span>
          </Button>
        </div>
      </div>

      {/* Lista de Produtos */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="h-[200px] bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)]"
            />
          ))}
        </div>
      ) : filteredProducts?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-[var(--color-background-elevated)] rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {searchTerm 
              ? 'Tente buscar com outros termos'
              : 'Comece criando seu primeiro produto'}
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Produto
          </Button>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        )}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={cn(
                "group relative",
                viewMode === 'grid'
                  ? "p-6 bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors"
                  : "p-4 bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors"
              )}
            >
              <div className="flex items-start justify-between mb-4">
                {/* Informações do Produto */}
                <div 
                  className="flex-1 cursor-pointer pr-12"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <span className={cn(
                      "px-2 py-0.5 text-xs rounded-full font-medium",
                      getStatusColor(product.status)
                    )}>
                      {product.status}
                    </span>
                  </div>
                  {viewMode === 'grid' && (
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                      {product.description || 'Sem descrição'}
                    </p>
                  )}
                </div>

                {/* Menu de Ações */}
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={() => setSelectedProduct(product)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setProductToDelete(product)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Equipe (apenas no modo grid) */}
              {viewMode === 'grid' && product.team && product.team.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <div className="flex -space-x-2">
                    {product.team.slice(0, 3).map((member, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-[var(--color-background-secondary)] border-2 border-[var(--color-background-elevated)]"
                      />
                    ))}
                  </div>
                  {product.team.length > 3 && (
                    <span>+{product.team.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {selectedProduct && (
        <EditProductDialog
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}

      {productToDelete && (
        <DeleteProductDialog
          open={!!productToDelete}
          onOpenChange={(open) => !open && setProductToDelete(null)}
          product={productToDelete}
        />
      )}
    </div>
  )
} 