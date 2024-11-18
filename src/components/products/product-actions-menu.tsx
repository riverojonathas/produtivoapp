'use client'

import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  LineChart, 
  Copy, 
  Files, 
  Tag, 
  ActivitySquare 
} from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { ProductTagsDialog } from './product-tags-dialog'
import { ProductStatusDialog } from './product-status-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Product {
  id: string
  name: string
  status: string
  vision?: string | null
  tags?: Array<{
    id: string
    name: string
    type: 'priority' | 'phase' | 'category' | 'custom'
    color?: string
  }>
}

interface ProductActionsMenuProps {
  product: Product
}

export function ProductActionsMenu({ product }: ProductActionsMenuProps) {
  const router = useRouter()
  const { deleteProduct } = useProducts()
  const [showVision, setShowVision] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id)
      toast.success('Produto excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      toast.error('Erro ao excluir produto')
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/products/${product.id}`
    navigator.clipboard.writeText(url)
    toast.success('Link copiado para a área de transferência')
  }

  const handleDuplicate = () => {
    router.push(`/products/new?duplicate=${product.id}`)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={handleMenuClick}>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] product-actions-menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-[var(--color-background-elevated)] border-[var(--color-border)]"
          onClick={handleMenuClick}
        >
          {/* Ações Principais */}
          <DropdownMenuItem 
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
            onClick={() => router.push(`/products/${product.id}/edit`)}
          >
            <Pencil className="w-4 h-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
            onClick={() => setShowStatusDialog(true)}
          >
            <ActivitySquare className="w-4 h-4" />
            Alterar Status
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Ações Rápidas */}
          <DropdownMenuItem 
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
            onClick={() => setShowVision(true)}
          >
            <Eye className="w-4 h-4" />
            Ver visão
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
            onClick={() => setShowMetrics(true)}
          >
            <LineChart className="w-4 h-4" />
            Ver métricas
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
            onClick={handleCopyLink}
          >
            <Copy className="w-4 h-4" />
            Copiar link
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
            onClick={handleDuplicate}
          >
            <Files className="w-4 h-4" />
            Duplicar produto
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowTags(true)
            }}
          >
            <div className="flex items-center gap-2 flex-1">
              <Tag className="w-4 h-4" />
              <span>Gerenciar tags</span>
              <div className="ml-auto text-xs text-[var(--color-text-secondary)]">
                {product.tags?.length || 0}
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Ação de Excluir */}
          <DropdownMenuItem 
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-500 focus:text-red-500 dark:hover:bg-red-950 dark:focus:bg-red-950"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para Visão */}
      <Dialog open={showVision} onOpenChange={setShowVision}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visão do Produto</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-sm whitespace-pre-wrap">
            {product.vision || 'Visão não definida'}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Métricas */}
      <Dialog open={showMetrics} onOpenChange={setShowMetrics}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Métricas do Produto</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {/* TODO: Implementar visualização de métricas */}
            <p className="text-sm text-[var(--color-text-secondary)]">
              Métricas em desenvolvimento...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <ProductTagsDialog
        productId={product.id}
        open={showTags}
        onOpenChange={setShowTags}
        currentTags={product.tags}
      />

      <ProductStatusDialog
        productId={product.id}
        currentStatus={product.status}
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
      />
    </>
  )
} 