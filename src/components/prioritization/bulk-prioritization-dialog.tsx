'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Feature } from "@/types/product"
import { useState } from "react"
import { useFeatures } from "@/hooks/use-features"
import { toast } from "sonner"

interface BulkPrioritizationDialogProps {
  features: Feature[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BulkPrioritizationDialog({
  features,
  open,
  onOpenChange
}: BulkPrioritizationDialogProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const { updateFeature } = useFeatures()

  const handleBulkUpdate = async (priority: string) => {
    try {
      await Promise.all(
        selectedFeatures.map(id => 
          updateFeature.mutateAsync({
            id,
            data: { moscow_priority: priority }
          })
        )
      )
      toast.success('Features atualizadas com sucesso')
      onOpenChange(false)
    } catch (error) {
      toast.error('Erro ao atualizar features')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Priorização em Lote</DialogTitle>
        </DialogHeader>
        {/* ... implementação do conteúdo ... */}
      </DialogContent>
    </Dialog>
  )
} 