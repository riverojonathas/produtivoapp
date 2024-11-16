'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { useState } from 'react'
import { useProducts } from '@/hooks/use-products'

interface EditProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
}

export function EditProductDialog({ 
  open, 
  onOpenChange,
  product 
}: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || ''
  })
  const { updateProduct } = useProducts()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        name: formData.name,
        description: formData.description
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Nome
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome do produto"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Descrição
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o produto"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={updateProduct.isPending}>
              {updateProduct.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 