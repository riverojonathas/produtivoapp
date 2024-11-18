'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'

interface CreateProductDialogProps {
  children: React.ReactNode
}

export function CreateProductDialog({ children }: CreateProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { createProduct } = useProducts()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createProduct.mutateAsync({
        name,
        description
      })

      toast.success('Produto criado com sucesso')
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error('Erro ao criar produto:', error)
      toast.error('Erro ao criar produto')
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Nome do produto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Descrição do produto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-[var(--color-background-subtle)] text-[var(--color-text-primary)] min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-[var(--color-text-primary)]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
            >
              Criar Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 