'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FeatureForm } from '@/components/features/feature-form'
import { Feature } from '@/types/product'
import { useRoadmap } from '@/hooks/use-roadmap'
import { useCurrentProduct } from '@/hooks/use-current-product'
import { usePersonas } from '@/hooks/use-personas'
import { toast } from 'sonner'

interface AddFeatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddFeatureDialog({ 
  open, 
  onOpenChange,
  onSuccess
}: AddFeatureDialogProps) {
  const { data: currentProduct } = useCurrentProduct()
  const { createFeature } = useRoadmap()
  const { data: personas = [] } = usePersonas(currentProduct?.id)

  const handleSubmit = async (data: Partial<Feature>) => {
    try {
      if (!currentProduct?.id) {
        throw new Error('Nenhum produto selecionado')
      }

      // Garantir que todos os campos obrigatórios estejam presentes
      if (!data.title || !data.description?.what || !data.description?.why || !data.description?.who) {
        throw new Error('Preencha todos os campos obrigatórios')
      }

      // Formatar os dados para o formato do Supabase
      const formattedData = {
        title: data.title,
        description: data.description,
        status: data.status || 'backlog',
        priority: data.priority || 'medium',
        start_date: data.startDate ? new Date(data.startDate).toISOString() : null,
        end_date: data.endDate ? new Date(data.endDate).toISOString() : null,
        product_id: currentProduct.id,
        dependencies: data.dependencies || [],
        assignees: data.assignees || [],
        tags: data.tags || []
      }

      // Log para debug
      console.log('Dados formatados:', formattedData)

      await createFeature.mutateAsync(formattedData)
      
      toast.success('Feature criada com sucesso!')
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao criar feature'
      console.error('Erro ao criar feature:', error)
      toast.error(errorMessage)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Feature</DialogTitle>
        </DialogHeader>
        <FeatureForm
          existingFeatures={[]}
          personas={personas}
          onSubmit={handleSubmit}
          isSubmitting={createFeature.isPending}
          defaultValues={{
            status: 'backlog',
            priority: 'medium',
            startDate: null,
            endDate: null,
            dependencies: [],
            assignees: [],
            tags: []
          }}
        />
      </DialogContent>
    </Dialog>
  )
} 