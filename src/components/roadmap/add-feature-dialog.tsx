'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FeatureForm } from './feature-form'
import { useRoadmap } from '@/hooks/use-roadmap'
import { useProducts } from '@/hooks/use-products'
import { usePersonas } from '@/hooks/use-personas'
import { Feature } from '@/types/product'
import { toast } from 'sonner'

interface AddFeatureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddFeatureDialog({ open, onOpenChange }: AddFeatureDialogProps) {
  const { createFeature } = useRoadmap()
  const { products } = useProducts()
  const { personas } = usePersonas()

  const defaultValues = {
    status: 'backlog' as const,
    priority: 'medium' as const,
    start_date: null,
    end_date: null,
    dependencies: [],
    assignees: [],
    tags: []
  }

  const handleSubmit = async (data: Partial<Feature>) => {
    try {
      if (!data.product_id) {
        throw new Error('Selecione um produto')
      }

      const formattedData = {
        title: data.title || '',
        description: data.description || {
          what: '',
          why: '',
          how: '',
          who: ''
        },
        status: data.status || defaultValues.status,
        priority: data.priority || defaultValues.priority,
        start_date: data.start_date,
        end_date: data.end_date,
        product_id: data.product_id,
        dependencies: data.dependencies || [],
        assignees: data.assignees || [],
        tags: data.tags || []
      }

      await createFeature.mutateAsync(formattedData)
      
      toast.success('Feature criada com sucesso!')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar feature:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar feature')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nova Feature</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulário Principal */}
          <div>
            <FeatureForm
              personas={personas || []}
              products={products || []}
              onSubmit={handleSubmit}
              isSubmitting={createFeature.isPending}
              defaultValues={defaultValues}
            />
          </div>

          {/* Personas */}
          <div>
            <h3 className="text-sm font-medium mb-4">
              Para quem
            </h3>
            <div className="space-y-3">
              {personas?.length > 0 ? (
                personas.map(persona => (
                  <div
                    key={persona.id}
                    className="p-4 bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-background-secondary)] flex items-center justify-center shrink-0">
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                          {persona.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-[var(--color-text-primary)]">
                          {persona.name}
                        </h4>
                        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                          {persona.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[var(--color-text-secondary)]">
                    Nenhuma persona encontrada. Crie uma persona primeiro.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 