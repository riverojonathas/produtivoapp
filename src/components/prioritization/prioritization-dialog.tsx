'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IFeature } from "@/types/feature"
import { useState } from "react"
import { useFeatures } from "@/hooks/use-features"
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { 
  Calculator, 
  Target, 
  Users, 
  ArrowUp, 
  Gauge, 
  Clock,
  Sparkles
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type MoscowPriority = 'must' | 'should' | 'could' | 'wont'

interface PrioritizationDialogProps {
  feature: IFeature
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrioritizationDialog({ 
  feature, 
  open, 
  onOpenChange 
}: PrioritizationDialogProps) {
  const { updateFeature } = useFeatures()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [riceValues, setRiceValues] = useState({
    reach: feature.rice_reach || 0,
    impact: feature.rice_impact || 0,
    confidence: feature.rice_confidence || 0,
    effort: feature.rice_effort || 0
  })
  const [moscowPriority, setMoscowPriority] = useState<MoscowPriority | undefined>(
    feature.moscow_priority as MoscowPriority | undefined
  )

  // Calcula o RICE Score
  const riceScore = riceValues.effort > 0
    ? ((riceValues.reach * riceValues.impact * riceValues.confidence) / riceValues.effort).toFixed(1)
    : '0.0'

  // Função para lidar com a mudança de prioridade
  const handlePriorityChange = (value: string) => {
    setMoscowPriority(value as MoscowPriority)
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      await updateFeature.mutateAsync({
        id: feature.id,
        data: {
          rice_reach: riceValues.reach,
          rice_impact: riceValues.impact,
          rice_confidence: riceValues.confidence,
          rice_effort: riceValues.effort,
          moscow_priority: moscowPriority
        }
      })
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
          {/* RICE Score Card */}
          <Card className="p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-[var(--color-primary)]" />
                  Framework RICE
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Priorização baseada em dados quantitativos
                </p>
              </div>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-lg font-semibold",
                  parseFloat(riceScore) >= 100 ? "bg-emerald-100 text-emerald-700" :
                  parseFloat(riceScore) >= 50 ? "bg-blue-100 text-blue-700" :
                  parseFloat(riceScore) >= 25 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                )}
              >
                {riceScore}
              </Badge>
            </div>

            <div className="grid gap-6">
              {/* Reach */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <label className="text-sm font-medium">Reach</label>
                  </div>
                  <span className="text-sm font-medium">{riceValues.reach}</span>
                </div>
                <Slider
                  value={[riceValues.reach]}
                  onValueChange={([value]) => setRiceValues(prev => ({ ...prev, reach: value }))}
                  max={1000}
                  step={10}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Número estimado de usuários impactados por trimestre
                </p>
              </div>

              {/* Impact */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <label className="text-sm font-medium">Impact</label>
                  </div>
                  <span className="text-sm font-medium">{riceValues.impact}</span>
                </div>
                <div className="flex gap-2">
                  {[0.25, 0.5, 1, 2, 3].map(value => (
                    <Button
                      key={value}
                      variant={riceValues.impact === value ? "default" : "outline"}
                      className={cn(
                        "flex-1 h-8",
                        riceValues.impact === value && "bg-[var(--color-primary)] text-white"
                      )}
                      onClick={() => setRiceValues(prev => ({ ...prev, impact: value }))}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Impacto por usuário (0.25 = Mínimo, 3 = Massivo)
                </p>
              </div>

              {/* Confidence */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <label className="text-sm font-medium">Confidence</label>
                  </div>
                  <span className="text-sm font-medium">{riceValues.confidence}%</span>
                </div>
                <Slider
                  value={[riceValues.confidence]}
                  onValueChange={([value]) => setRiceValues(prev => ({ ...prev, confidence: value }))}
                  max={100}
                  step={5}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Nível de confiança na estimativa (0-100%)
                </p>
              </div>

              {/* Effort */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <label className="text-sm font-medium">Effort</label>
                  </div>
                  <span className="text-sm font-medium">{riceValues.effort}</span>
                </div>
                <div className="flex gap-2">
                  {[0.5, 1, 2, 3, 5, 8, 13].map(value => (
                    <Button
                      key={value}
                      variant={riceValues.effort === value ? "default" : "outline"}
                      className={cn(
                        "flex-1 h-8",
                        riceValues.effort === value && "bg-[var(--color-primary)] text-white"
                      )}
                      onClick={() => setRiceValues(prev => ({ ...prev, effort: value }))}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Esforço estimado em pessoa-mês
                </p>
              </div>
            </div>
          </Card>

          {/* MoSCoW Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                  Priorização MoSCoW
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Classificação baseada em importância
                </p>
              </div>
            </div>

            <Select
              value={moscowPriority}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade MoSCoW" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="must">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                      Must Have
                    </Badge>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      Essencial para o produto
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="should">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      Should Have
                    </Badge>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      Importante mas não crítico
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="could">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Could Have
                    </Badge>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      Desejável se houver recursos
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="wont">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Won't Have
                    </Badge>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      Não será implementado agora
                    </span>
                  </div>
                </SelectItem>
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
            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 