'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { IProductMetric, MetricType } from '@/types/product'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Heart, Target, LineChart } from 'lucide-react'

interface ProductMetricsDialogProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  currentMetrics?: IProductMetric[]
}

const heartMetrics = [
  { key: 'happiness', label: 'Happiness', description: 'Satisfação geral do usuário' },
  { key: 'engagement', label: 'Engagement', description: 'Nível de engajamento com o produto' },
  { key: 'adoption', label: 'Adoption', description: 'Taxa de adoção de novas features' },
  { key: 'retention', label: 'Retention', description: 'Taxa de retenção dos usuários' },
  { key: 'taskSuccess', label: 'Task Success', description: 'Taxa de sucesso nas tarefas' }
]

const northStarFields = [
  { key: 'metric', label: 'Métrica', description: 'Qual é a métrica principal?' },
  { key: 'target', label: 'Meta', description: 'Qual é o objetivo quantificável?' },
  { key: 'signals', label: 'Sinais', description: 'Como você vai medir esta métrica?' },
  { key: 'actions', label: 'Ações', description: 'Que ações são necessárias?' },
  { key: 'rationale', label: 'Justificativa', description: 'Por que esta é a métrica mais importante?' }
]

export function ProductMetricsDialog({
  productId,
  open,
  onOpenChange,
  currentMetrics = []
}: ProductMetricsDialogProps) {
  const { updateProductMetrics } = useProducts()
  const [activeTab, setActiveTab] = useState('heart')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estado para métricas HEART
  const [heartValues, setHeartValues] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {}
    heartMetrics.forEach(metric => {
      const currentMetric = currentMetrics.find(
        m => m.type === 'heart' && m.name === metric.key
      )
      values[metric.key] = currentMetric?.value || ''
    })
    return values
  })

  // Estado para métricas North Star
  const [northStarValues, setNorthStarValues] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {}
    northStarFields.forEach(field => {
      const currentMetric = currentMetrics.find(
        m => m.type === 'north_star' && m.name === field.key
      )
      values[field.key] = currentMetric?.value || ''
    })
    return values
  })

  const handleSave = async () => {
    try {
      setIsSubmitting(true)

      // Preparar métricas HEART
      const heartMetrics = Object.entries(heartValues)
        .filter(([_, value]) => value.trim())
        .map(([key, value]) => ({
          type: 'heart' as MetricType,
          name: key,
          value: value.trim()
        }))

      // Preparar métricas North Star
      const northStarMetrics = Object.entries(northStarValues)
        .filter(([_, value]) => value.trim())
        .map(([key, value]) => ({
          type: 'north_star' as MetricType,
          name: key,
          value: value.trim()
        }))

      await updateProductMetrics.mutateAsync({
        productId,
        metrics: [...heartMetrics, ...northStarMetrics]
      })

      toast.success('Métricas atualizadas com sucesso')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar métricas:', error)
      toast.error('Erro ao atualizar métricas')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Métricas</DialogTitle>
          <DialogDescription>
            Configure as métricas do seu produto usando frameworks reconhecidos
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="heart" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              HEART Framework
            </TabsTrigger>
            <TabsTrigger value="northstar" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              North Star
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heart" className="space-y-4 mt-4">
            <div className="grid gap-4">
              {heartMetrics.map(metric => (
                <div key={metric.key} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    {metric.label}
                  </label>
                  <Input
                    value={heartValues[metric.key]}
                    onChange={(e) => setHeartValues(prev => ({
                      ...prev,
                      [metric.key]: e.target.value
                    }))}
                    placeholder={metric.description}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="northstar" className="space-y-4 mt-4">
            <div className="grid gap-4">
              {northStarFields.map(field => (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    {field.label}
                  </label>
                  {field.key === 'rationale' ? (
                    <Textarea
                      value={northStarValues[field.key]}
                      onChange={(e) => setNorthStarValues(prev => ({
                        ...prev,
                        [field.key]: e.target.value
                      }))}
                      placeholder={field.description}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <Input
                      value={northStarValues[field.key]}
                      onChange={(e) => setNorthStarValues(prev => ({
                        ...prev,
                        [field.key]: e.target.value
                      }))}
                      placeholder={field.description}
                    />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
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