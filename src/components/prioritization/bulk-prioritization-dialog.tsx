'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IFeature } from "@/types/feature"
import { useState } from "react"
import { useFeatures } from "@/hooks/use-features"
import { toast } from "sonner"

type MoscowPriority = 'must' | 'should' | 'could' | 'wont'

interface BulkPrioritizationDialogProps {
  features: IFeature[]
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

  const handleBulkUpdate = async (priority: MoscowPriority) => {
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleBulkUpdate('must')}
            >
              Must Have
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleBulkUpdate('should')}
            >
              Should Have
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleBulkUpdate('could')}
            >
              Could Have
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleBulkUpdate('wont')}
            >
              Won't Have
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 