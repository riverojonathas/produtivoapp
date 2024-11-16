'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FeatureForm } from '@/components/features/feature-form'
import { Feature } from '@/types/product'
import { useRoadmap } from '@/hooks/use-roadmap'

interface AddFeatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingFeatures: Feature[]
  productId: string
}

export function AddFeatureDialog({ 
  open, 
  onOpenChange,
  existingFeatures,
  productId 
}: AddFeatureDialogProps) {
  const { createFeature } = useRoadmap(productId)

  const handleSubmit = async (data: Partial<Feature>) => {
    try {
      await createFeature.mutateAsync({
        ...data,
        productId,
        stories: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: data.tags || [],
        dependencies: data.dependencies || [],
        assignees: data.assignees || []
      } as Feature)
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar feature:', error)
      throw error
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Feature</DialogTitle>
        </DialogHeader>
        <FeatureForm
          existingFeatures={existingFeatures}
          onSubmit={handleSubmit}
          isSubmitting={createFeature.isPending}
        />
      </DialogContent>
    </Dialog>
  )
} 