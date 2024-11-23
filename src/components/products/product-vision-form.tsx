'use client'

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProductVision } from "@/types/product-form"
import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { heartMetricSuggestions } from "./product-form-suggestions"
import { cn } from "@/lib/utils"

interface ProductVisionFormProps {
  vision: ProductVision
  onChange: (vision: ProductVision) => void
}

export function ProductVisionForm({ vision, onChange }: ProductVisionFormProps) {
  const handleMetricChange = (key: keyof ProductVision['metrics'], value: string) => {
    onChange({
      ...vision,
      metrics: {
        ...vision.metrics,
        [key]: value
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho Informativo */}
      <div className="flex items-start gap-4 p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)]">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            Visão do Produto
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Defina claramente para quem é o produto, qual problema ele resolve e como ele resolve.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Público-alvo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Para quem? (Público-alvo)</label>
            <Textarea
              value={vision.targetAudience}
              onChange={(e) => onChange({ ...vision, targetAudience: e.target.value })}
              placeholder="Descreva o público-alvo do seu produto..."
              className="min-h-[100px]"
            />
          </div>

          {/* Problema */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Qual problema resolve?</label>
            <Textarea
              value={vision.problem}
              onChange={(e) => onChange({ ...vision, problem: e.target.value })}
              placeholder="Descreva o problema que seu produto resolve..."
              className="min-h-[100px]"
            />
          </div>

          {/* Solução */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Como resolve?</label>
            <Textarea
              value={vision.solution}
              onChange={(e) => onChange({ ...vision, solution: e.target.value })}
              placeholder="Descreva como seu produto resolve o problema..."
              className="min-h-[100px]"
            />
          </div>

          {/* Métricas HEART */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Métricas HEART</h4>
            
            {Object.entries(heartMetricSuggestions).map(([key, suggestions]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium capitalize">
                    {key === 'taskSuccess' ? 'Task Success' : key}
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          type="button" 
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={`Ver sugestões para métrica ${key}`}
                        >
                          <HelpCircle className="w-3 h-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs p-3">
                        <p className="text-xs font-medium mb-2">Sugestões:</p>
                        <ul className="text-xs space-y-1">
                          {suggestions.map((suggestion, index) => (
                            <li 
                              key={index}
                              className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                              onClick={() => handleMetricChange(key as keyof ProductVision['metrics'], suggestion)}
                            >
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  value={vision.metrics[key as keyof ProductVision['metrics']]}
                  onChange={(e) => handleMetricChange(key as keyof ProductVision['metrics'], e.target.value)}
                  placeholder={`Digite a métrica de ${key}...`}
                  className={cn(
                    vision.metrics[key as keyof ProductVision['metrics']]?.trim() && 
                    "border-green-200 focus:border-green-500"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
} 