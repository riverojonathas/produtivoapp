'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FeatureForm } from './feature-form'
import { Feature } from '@/types/product'
import { useRoadmap } from '@/hooks/use-roadmap'
import { useCurrentProduct } from '@/hooks/use-current-product'
import { usePersonas } from '@/hooks/use-personas'
import { toast } from 'sonner'

interface EditFeatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: Feature
  onSuccess?: () => void
}

export function EditFeatureDialog({ 
  open, 
  onOpenChange,
  feature,
  onSuccess
}: EditFeatureDialogProps) {
  const { data: currentProduct } = useCurrentProduct()
  const { updateFeature } = useRoadmap()
  const { data: personas = [] } = usePersonas(currentProduct?.id)

  const handleSubmit = async (data: Partial<Feature>) => {
    try {
      await updateFeature.mutateAsync({
        ...feature,
        ...data
      })
      
      toast.success('Feature atualizada com sucesso!')
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao atualizar feature:', error)
      toast.error('Erro ao atualizar feature')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Feature</DialogTitle>
        </DialogHeader>
        <FeatureForm
          feature={feature}
          existingFeatures={[]}
          personas={personas}
          onSubmit={handleSubmit}
          isSubmitting={updateFeature.isPending}
          defaultValues={feature}
        />
      </DialogContent>
    </Dialog>
  )
} 