'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/use-products"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ProductStatus } from '@/types/product'

interface ProductStatusDialogProps {
  productId: string
  currentStatus: ProductStatus
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusOptions = [
  { 
    id: 'development' as ProductStatus, 
    label: 'Em Desenvolvimento',
    description: 'Produto em fase de desenvolvimento',
    color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
  },
  { 
    id: 'active' as ProductStatus, 
    label: 'Ativo',
    description: 'Produto em uso ativo',
    color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
  },
  { 
    id: 'archived' as ProductStatus, 
    label: 'Arquivado',
    description: 'Produto não está mais em uso',
    color: 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400'
  }
]

export function ProductStatusDialog({ productId, currentStatus, open, onOpenChange }: ProductStatusDialogProps) {
  const { updateProduct } = useProducts()

  const handleStatusChange = async (newStatus: ProductStatus) => {
    try {
      await updateProduct.mutateAsync({
        id: productId,
        data: { status: newStatus }
      })
      toast.success('Status atualizado com sucesso')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {statusOptions.map((status) => (
            <Button
              key={status.id}
              variant="outline"
              className={cn(
                "justify-start h-auto py-4",
                status.id === currentStatus && "border-[var(--color-primary)] bg-[var(--color-primary-subtle)]",
                status.color
              )}
              onClick={() => handleStatusChange(status.id)}
              disabled={status.id === currentStatus}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{status.label}</span>
                <span className="text-xs opacity-70">
                  {status.description}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 