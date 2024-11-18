'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Feature } from "@/types/product"
import { useFeatures } from "@/hooks/use-features"
import { toast } from "sonner"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Target, ArrowUp, Gauge, Clock } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PrioritizationDialogProps {
  feature: Feature
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrioritizationDialog({ feature, open, onOpenChange }: PrioritizationDialogProps) {
  const { createFeaturePrioritization } = useFeatures()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [riceValues, setRiceValues] = useState({
    reach: feature.rice_reach || 0,
    impact: feature.rice_impact || 0,
    confidence: feature.rice_confidence || 0,
    effort: feature.rice_effort || 0
  })
  const [moscowPriority, setMoscowPriority] = useState(feature.moscow_priority || '')

  // Calcula o RICE Score
  const riceScore = riceValues.effort > 0
    ? ((riceValues.reach * riceValues.impact * riceValues.confidence) / riceValues.effort).toFixed(1)
    : '0.0'

  const handleSave = async () => {
    try {
      setIsSubmitting(true)

      // Salvar priorização RICE
      if (Object.values(riceValues).some(value => value > 0)) {
        await createFeaturePrioritization.mutateAsync({
          feature_id: feature.id,
          method: 'rice',
          ...riceValues
        })
      }

      // Salvar priorização MoSCoW
      if (moscowPriority) {
        await createFeaturePrioritization.mutateAsync({
          feature_id: feature.id,
          method: 'moscow',
          moscow_priority: moscowPriority as 'must' | 'should' | 'could' | 'wont'
        })
      }

      toast.success('Priorização atualizada com sucesso')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar priorização:', error)
      toast.error('Erro ao atualizar priorização')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Priorizar Feature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* RICE Score */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium">Framework RICE</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Priorização baseada em Reach, Impact, Confidence e Effort
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className="text-lg font-semibold"
              >
                {riceScore}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <label className="text-sm font-medium">Reach</label>
                </div>
                <Input
                  type="number"
                  min="0"
                  value={riceValues.reach}
                  onChange={(e) => setRiceValues(prev => ({ 
                    ...prev, 
                    reach: parseInt(e.target.value) || 0 
                  }))}
                  placeholder="Número de usuários impactados"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <label className="text-sm font-medium">Impact</label>
                </div>
                <Input
                  type="number"
                  min="0"
                  max="3"
                  value={riceValues.impact}
                  onChange={(e) => setRiceValues(prev => ({ 
                    ...prev, 
                    impact: parseInt(e.target.value) || 0 
                  }))}
                  placeholder="Impacto (0-3)"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <label className="text-sm font-medium">Confidence</label>
                </div>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={riceValues.confidence}
                  onChange={(e) => setRiceValues(prev => ({ 
                    ...prev, 
                    confidence: parseInt(e.target.value) || 0 
                  }))}
                  placeholder="Confiança (0-100%)"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <label className="text-sm font-medium">Effort</label>
                </div>
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={riceValues.effort}
                  onChange={(e) => setRiceValues(prev => ({ 
                    ...prev, 
                    effort: parseFloat(e.target.value) || 0 
                  }))}
                  placeholder="Esforço em pessoa-mês"
                />
              </div>
            </div>
          </Card>

          {/* MoSCoW */}
          <Card className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium">Priorização MoSCoW</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Must have, Should have, Could have, Won't have
              </p>
            </div>

            <Select
              value={moscowPriority}
              onValueChange={setMoscowPriority}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade MoSCoW" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="must">Must Have (Deve ter)</SelectItem>
                <SelectItem value="should">Should Have (Deveria ter)</SelectItem>
                <SelectItem value="could">Could Have (Poderia ter)</SelectItem>
                <SelectItem value="wont">Won't Have (Não terá)</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 