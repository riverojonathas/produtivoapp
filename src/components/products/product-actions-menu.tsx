'use client'

import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
}

interface ProductActionsMenuProps {
  product: Product
}

export function ProductActionsMenu({ product }: ProductActionsMenuProps) {
  const router = useRouter()
  const { deleteProduct } = useProducts()

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id)
      toast.success('Produto excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      toast.error('Erro ao excluir produto')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40 bg-[var(--color-background-elevated)] border-[var(--color-border)]"
      >
        <DropdownMenuItem 
          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
          onClick={() => router.push(`/products/${product.id}/edit`)}
        >
          <Pencil className="w-4 h-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-500 focus:text-red-500 dark:hover:bg-red-950 dark:focus:bg-red-950"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 