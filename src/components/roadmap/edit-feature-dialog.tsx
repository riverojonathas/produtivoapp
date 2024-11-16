'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FeatureForm } from '@/components/features/feature-form'
import { Feature } from '@/types/product'
import { useRoadmap } from '@/hooks/use-roadmap'

interface EditFeatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: Feature
  existingFeatures: Feature[]
}

export function EditFeatureDialog({ 
  open, 
  onOpenChange,
  feature,
  existingFeatures 
}: EditFeatureDialogProps) {
  const { updateFeature } = useRoadmap()

  const handleSubmit = async (data: Partial<Feature>) => {
    try {
      await updateFeature.mutateAsync({
        ...data,
        id: feature.id,
        updatedAt: new Date()
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar feature:', error)
      throw error
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
          existingFeatures={existingFeatures}
          onSubmit={handleSubmit}
          isSubmitting={updateFeature.isPending}
        />
      </DialogContent>
    </Dialog>
  )
} 