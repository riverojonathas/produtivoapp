'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { Product } from '@/types/product'

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
  const { updateProduct } = useProducts()
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const name = formData.name.trim()
      const description = formData.description?.trim() || ''

      if (name.length > 100) {
        throw new Error('Nome do produto deve ter no máximo 100 caracteres')
      }

      await updateProduct.mutateAsync({
        ...product,
        name,
        description
      })

      toast.success('Produto atualizado com sucesso!')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao atualizar produto')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nome do produto"
              value={formData.name}
              onChange={handleChange('name')}
              maxLength={100}
            />
            {formData.name.length > 0 && (
              <div className="text-xs text-[var(--color-text-secondary)]">
                {formData.name.length}/100 caracteres
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Descrição do produto"
              value={formData.description}
              onChange={handleChange('description')}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || updateProduct.isPending}
            >
              {isLoading || updateProduct.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 