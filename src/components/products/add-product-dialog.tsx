'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultFormData = {
  name: '',
  description: ''
}

export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const { createProduct } = useProducts()
  const [formData, setFormData] = useState(defaultFormData)
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

      await createProduct.mutateAsync({
        name,
        description,
        status: 'active',
        team: []
      })

      toast.success('Produto criado com sucesso!')
      setFormData(defaultFormData)
      onOpenChange(false)
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

  const handleChange = (field: keyof typeof defaultFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
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
              disabled={isLoading || createProduct.isPending}
            >
              {isLoading || createProduct.isPending ? 'Criando...' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 