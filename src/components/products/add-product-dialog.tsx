'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const { createProduct } = useProducts()
  const [productName, setProductName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const name = productName.trim()

      if (!name) {
        throw new Error('Nome do produto é obrigatório')
      }

      if (name.length > 100) {
        throw new Error('Nome do produto deve ter no máximo 100 caracteres')
      }

      const product = await createProduct.mutateAsync({
        name,
        status: 'active'
      })

      toast.success('Produto criado com sucesso!')
      onOpenChange(false)
      
      // Redireciona para a página de edição do produto
      router.push(`/products/${product.id}/edit`)
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao criar produto')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nome do produto"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              maxLength={100}
              autoFocus
            />
            {productName.length > 0 && (
              <div className="text-xs text-[var(--color-text-secondary)]">
                {productName.length}/100 caracteres
              </div>
            )}
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
              disabled={isLoading || createProduct.isPending || !productName.trim()}
            >
              {isLoading || createProduct.isPending ? 'Criando...' : 'Criar e Configurar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 