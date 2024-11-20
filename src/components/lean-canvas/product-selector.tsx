'use client'

import { useProducts } from '@/hooks/use-products'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Link2, Link2Off, Package } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { useState } from 'react'

interface ProductSelectorProps {
  currentProductId?: string
  onSelect: (productId?: string) => Promise<void>
  trigger?: React.ReactNode
}

export function ProductSelector({ currentProductId, onSelect, trigger }: ProductSelectorProps) {
  const { products = [] } = useProducts()
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Filtrar produtos
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(search.toLowerCase())
  )

  // Produto atual
  const currentProduct = products.find(p => p.id === currentProductId)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button 
            variant="ghost" 
            size="sm"
            className="flex items-center gap-2 text-xs"
          >
            <Package className="w-4 h-4" />
            {currentProduct ? currentProduct.title : 'Vincular Produto'}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[300px] bg-[var(--color-background-elevated)] border border-[var(--color-border)]"
      >
        <div className="p-2">
          <Input
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        <DropdownMenuSeparator className="bg-[var(--color-border)]" />

        <div className="py-1 px-2">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            {filteredProducts.length} produtos encontrados
          </span>
        </div>

        <div className="max-h-[200px] overflow-y-auto">
          {filteredProducts.map((product) => (
            <DropdownMenuItem
              key={product.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-subtle)]"
              onClick={async () => {
                await onSelect(product.id)
                setIsOpen(false)
              }}
            >
              <Package className="w-4 h-4 text-[var(--color-text-secondary)]" />
              <div className="flex flex-col">
                <span className="text-sm">{product.title}</span>
                {product.description && (
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {product.description}
                  </span>
                )}
              </div>
            </DropdownMenuItem>
          ))}

          {filteredProducts.length === 0 && (
            <div className="p-2 text-sm text-center text-[var(--color-text-secondary)]">
              Nenhum produto encontrado
            </div>
          )}
        </div>

        {currentProductId && (
          <>
            <DropdownMenuSeparator className="bg-[var(--color-border)]" />
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
              onClick={async () => {
                await onSelect(undefined)
                setIsOpen(false)
              }}
            >
              <Link2Off className="w-4 h-4" />
              Desvincular Produto
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 