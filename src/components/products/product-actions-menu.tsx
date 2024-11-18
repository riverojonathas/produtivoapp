'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProductActionsMenuProps {
  product: {
    id: string
    name: string
  }
}

export function ProductActionsMenu({ product }: ProductActionsMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 py-2 bg-[var(--color-background-elevated)] border border-[var(--color-border)]"
        >
          <DropdownMenuItem
            className="text-xs px-3 py-2 cursor-pointer text-[var(--color-text-primary)] hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] focus:text-[var(--color-text-primary)]"
            onClick={() => toast.info('Em desenvolvimento')}
          >
            <Pencil className="w-3.5 h-3.5 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs px-3 py-2 cursor-pointer text-[var(--color-error)] hover:bg-[var(--color-error)]/10 focus:bg-[var(--color-error)]/10 focus:text-[var(--color-error)]"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[var(--color-background-elevated)] border border-[var(--color-border)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--color-text-primary)]">
              Você tem certeza?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--color-text-secondary)]">
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o produto{' '}
              <span className="font-medium text-[var(--color-text-primary)]">
                &quot;{product.name}&quot;
              </span>
              {' '}e todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[var(--color-text-primary)] bg-[var(--color-background-subtle)] hover:bg-[var(--color-background-hover)]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[var(--color-error)] text-white hover:bg-[var(--color-error-dark)]"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 