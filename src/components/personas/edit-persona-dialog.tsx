'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PersonaForm } from './persona-form'
import { Persona } from '@/types/product'
import { usePersonas } from '@/hooks/use-personas'

interface EditPersonaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  persona: Persona
}

export function EditPersonaDialog({ 
  open, 
  onOpenChange,
  persona 
}: EditPersonaDialogProps) {
  const { updatePersona } = usePersonas(persona.productId)

  const handleSubmit = async (data: Partial<Persona>) => {
    try {
      await updatePersona.mutateAsync({
        ...persona,
        ...data,
        updatedAt: new Date()
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar persona:', error)
      throw error
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Persona</DialogTitle>
        </DialogHeader>
        <PersonaForm
          persona={persona}
          onSubmit={handleSubmit}
          isSubmitting={updatePersona.isPending}
        />
      </DialogContent>
    </Dialog>
  )
} 