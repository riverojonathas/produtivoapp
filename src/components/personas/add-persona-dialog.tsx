'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { usePersonas } from '@/hooks/use-personas'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddPersonaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultFormData = {
  name: '',
  description: '',
  characteristics: [] as string[],
  pain_points: [] as string[],
  goals: [] as string[],
  product_id: undefined as string | undefined
}

export function AddPersonaDialog({ open, onOpenChange }: AddPersonaDialogProps) {
  const { createPersona } = usePersonas()
  const { products } = useProducts()
  const [formData, setFormData] = useState(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const name = formData.name.trim()
      const description = formData.description?.trim() || ''

      if (name.length > 100) {
        throw new Error('Nome da persona deve ter no máximo 100 caracteres')
      }

      await createPersona.mutateAsync({
        name,
        description,
        characteristics: formData.characteristics,
        pain_points: formData.pain_points,
        goals: formData.goals,
        product_id: formData.product_id || null
      })

      toast.success('Persona criada com sucesso!')
      setFormData(defaultFormData)
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar persona:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao criar persona')
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
          <DialogTitle>Nova Persona</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nome da persona"
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
              placeholder="Descrição da persona"
              value={formData.description}
              onChange={handleChange('description')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Select
              value={formData.product_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={isLoading || createPersona.isPending}
            >
              {isLoading || createPersona.isPending ? 'Criando...' : 'Criar Persona'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 