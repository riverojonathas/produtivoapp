'use client'

import { useState } from 'react'
import { useFeatures } from '@/hooks/use-features'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import {
  Calculator,
  BarChart,
  ArrowUpDown,
  Search,
  Info
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePrioritization } from '@/hooks/use-prioritization'
import { toast } from 'sonner'
import { RICEScore } from '@/types/product'

type PrioritizationMethod = 'rice' | 'moscow'

// Função de cálculo RICE
const calculateRICEScore = (scores: RICEScore): number => {
  const reach = scores.reach * 1000 // Converte para milhares de usuários
  const impact = scores.impact / 10  // Converte para decimal (0.1 - 1.0)
  const confidence = scores.confidence / 10 // Converte para decimal (0.1 - 1.0)
  const effort = scores.effort // Mantém a escala original (1-10 semanas)

  // Fórmula RICE: (Reach × Impact × Confidence) ÷ Effort
  const riceScore = (reach * impact * confidence) / effort

  return Math.round(riceScore * 100) / 100 // Arredonda para 2 casas decimais
}

const riceMetrics = {
  reach: {
    label: 'Alcance',
    description: 'Quantas pessoas serão impactadas nos próximos 3 meses'
  },
  impact: {
    label: 'Impacto',
    description: 'Qual o impacto para cada pessoa (1 = baixo, 10 = alto)'
  },
  confidence: {
    label: 'Confiança',
    description: 'Quão confiante estamos na estimativa (1 = baixa, 10 = alta)'
  },
  effort: {
    label: 'Esforço',
    description: 'Quanto tempo levará em semanas (1 = rápido, 10 = lento)'
  }
} as const

export default function PrioritizationPage() {
  const [method, setMethod] = useState<PrioritizationMethod>('rice')
  const [searchTerm, setSearchTerm] = useState('')
  const { features, isLoading } = useFeatures()
  const { updateRICEScore } = usePrioritization()

  const handleRICEUpdate = async (featureId: string, scores: RICEScore) => {
    try {
      await updateRICEScore.mutateAsync({ featureId, scores })
      toast.success('Pontuação RICE atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar pontuação RICE:', error)
      toast.error('Erro ao atualizar pontuação')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          Priorização de Features
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Priorize suas features usando RICE ou MoSCoW
        </p>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select
            value={method}
            onValueChange={(value: PrioritizationMethod) => setMethod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rice">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span>RICE Score</span>
                </div>
              </SelectItem>
              <SelectItem value="moscow">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <span>MoSCoW</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <Input
              placeholder="Buscar features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <div className="space-y-2">
                <p className="font-medium">Métodos de Priorização:</p>
                <div>
                  <p className="font-medium text-sm">RICE Score</p>
                  <p className="text-xs">Reach × Impact × Confidence ÷ Effort</p>
                </div>
                <div>
                  <p className="font-medium text-sm">MoSCoW</p>
                  <p className="text-xs">Must Have, Should Have, Could Have, Won't Have</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Lista de Features */}
      {isLoading ? (
        <div className="grid gap-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 h-32 bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {features?.map((feature) => (
            <Card key={feature.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {feature.description.what}
                  </p>
                </div>

                {method === 'rice' ? (
                  <div className="flex items-center gap-6">
                    {Object.entries(riceMetrics).map(([key, metric]) => (
                      <TooltipProvider key={key}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="space-y-2">
                              <label className="text-xs font-medium">
                                {metric.label}
                              </label>
                              <Slider
                                value={[feature[`rice_${key}` as keyof typeof feature] as number || 1]}
                                min={1}
                                max={10}
                                step={1}
                                onValueChange={([value]) => {
                                  const newScores: RICEScore = {
                                    reach: feature.rice_reach || 1,
                                    impact: feature.rice_impact || 1,
                                    confidence: feature.rice_confidence || 1,
                                    effort: feature.rice_effort || 1,
                                    [key]: value
                                  } as RICEScore
                                  handleRICEUpdate(feature.id, newScores)
                                }}
                                className="w-32"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm">{metric.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}

                    <div className="flex flex-col items-center justify-center px-4 py-2 bg-[var(--color-background-elevated)] rounded-lg min-w-[120px]">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                        Pontuação RICE
                      </span>
                      <span className="text-lg font-semibold text-[var(--color-primary)]">
                        {feature.rice_score?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        de {calculateRICEScore({
                          reach: 10,
                          impact: 10,
                          confidence: 10,
                          effort: 1
                        })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Select
                    value={feature.moscow_priority || undefined}
                    onValueChange={(value) => {
                      // Implementar atualização MoSCoW
                    }}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="must">Must Have</SelectItem>
                      <SelectItem value="should">Should Have</SelectItem>
                      <SelectItem value="could">Could Have</SelectItem>
                      <SelectItem value="wont">Won&apos;t Have</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 