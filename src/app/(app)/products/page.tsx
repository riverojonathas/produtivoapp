'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProducts } from '@/hooks/use-products'
import { ProductList } from '@/components/products/product-list'
import { AddProductDialog } from '@/components/products/add-product-dialog'
import { EditProductDialog } from '@/components/products/edit-product-dialog'
import { Product } from '@/types/product'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { data: products, isLoading, error } = useProducts()

  // Filtrar produtos por busca
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container max-w-[1200px] mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Produtos</h1>
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

      {/* Barra de Busca */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de Produtos */}
      {isLoading ? (
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          Carregando produtos...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Erro ao carregar produtos: {error instanceof Error ? error.message : 'Erro desconhecido'}
        </div>
      ) : filteredProducts?.length === 0 ? (
        <div className="text-center py-8 text-[var(--color-text-secondary)]">
          Nenhum produto encontrado. Crie seu primeiro produto para começar.
        </div>
      ) : (
        <ProductList
          products={filteredProducts || []}
          onProductClick={setSelectedProduct}
        />
      )}

      {/* Diálogos */}
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
    </div>
  )
} 