'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PersonaForm } from './persona-form'
import { Persona } from '@/types/product'
import { usePersonas } from '@/hooks/use-personas'

interface AddPersonaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
}

export function AddPersonaDialog({ 
  open, 
  onOpenChange,
  productId 
}: AddPersonaDialogProps) {
  const { createPersona } = usePersonas(productId)

  const handleSubmit = async (data: Partial<Persona>) => {
    try {
      await createPersona.mutateAsync({
        ...data,
        productId,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Persona)
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar persona:', error)
      throw error
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Persona</DialogTitle>
        </DialogHeader>
        <PersonaForm
          onSubmit={handleSubmit}
          isSubmitting={createPersona.isPending}
        />
      </DialogContent>
    </Dialog>
  )
} 