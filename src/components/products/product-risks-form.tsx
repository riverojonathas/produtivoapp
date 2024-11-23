'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ProductRisks, Risk } from "@/types/product-form"
import { HelpCircle, Plus } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { riskSuggestions, mitigationSuggestions } from "./product-form-suggestions"

interface ProductRisksFormProps {
  risks: ProductRisks
  onChange: (risks: ProductRisks) => void
}

const riskCategories = {
  valueRisks: 'Valor',
  usabilityRisks: 'Usabilidade',
  feasibilityRisks: 'Viabilidade',
  businessRisks: 'Negócio'
}

export function ProductRisksForm({ risks, onChange }: ProductRisksFormProps) {
  const addRisk = (category: keyof ProductRisks) => {
    const newRisk: Risk = { description: '', mitigation: '' }
    onChange({
      ...risks,
      [category]: [...risks[category], newRisk]
    })
  }

  const removeRisk = (category: keyof ProductRisks, index: number) => {
    onChange({
      ...risks,
      [category]: risks[category].filter((_, i) => i !== index)
    })
  }

  const updateRisk = (
    category: keyof ProductRisks,
    index: number,
    field: keyof Risk,
    value: string
  ) => {
    const updatedRisks = [...risks[category]]
    updatedRisks[index] = { ...updatedRisks[index], [field]: value }
    onChange({
      ...risks,
      [category]: updatedRisks
    })
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho Informativo */}
      <div className="flex items-start gap-4 p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)]">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            Riscos e Mitigações
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Identifique os principais riscos do produto e como você planeja mitigá-los.
          </p>
        </div>
      </div>

      {/* Categorias de Risco */}
      <div className="grid grid-cols-1 gap-6">
        {(Object.entries(riskCategories) as [keyof ProductRisks, string][]).map(([category, title]) => (
          <Card key={category} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Riscos de {title}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addRisk(category)}
                  className="h-8"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Risco
                </Button>
              </div>

              {risks[category].map((risk, index) => (
                <div key={index} className="space-y-4 p-4 bg-[var(--color-background-subtle)] rounded-lg">
                  {/* Descrição do Risco */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Descrição</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              type="button" 
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label={`Sugestões de riscos de ${title.toLowerCase()}`}
                            >
                              <HelpCircle className="w-3 h-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs p-3">
                            <p className="text-xs font-medium mb-2">Sugestões de riscos:</p>
                            <ul className="text-xs space-y-1">
                              {riskSuggestions[category].map((suggestion, i) => (
                                <li 
                                  key={i}
                                  className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                                  onClick={() => updateRisk(category, index, 'description', suggestion)}
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={risk.description}
                      onChange={(e) => updateRisk(category, index, 'description', e.target.value)}
                      placeholder={`Descreva o risco de ${title.toLowerCase()}...`}
                      className="min-h-[60px]"
                    />
                  </div>

                  {/* Mitigação */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Mitigação</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              type="button" 
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label={`Sugestões de mitigação para ${title.toLowerCase()}`}
                            >
                              <HelpCircle className="w-3 h-3" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs p-3">
                            <p className="text-xs font-medium mb-2">Sugestões de mitigação:</p>
                            <ul className="text-xs space-y-1">
                              {mitigationSuggestions[category].map((suggestion, i) => (
                                <li 
                                  key={i}
                                  className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                                  onClick={() => updateRisk(category, index, 'mitigation', suggestion)}
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      value={risk.mitigation}
                      onChange={(e) => updateRisk(category, index, 'mitigation', e.target.value)}
                      placeholder="Como você pretende mitigar este risco?"
                      className="min-h-[60px]"
                    />
                  </div>

                  {/* Botão Remover */}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRisk(category, index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}

              {risks[category].length === 0 && (
                <div className="text-center p-6 border border-dashed rounded-lg text-gray-400">
                  <p className="text-sm">
                    Nenhum risco adicionado. Clique em "Adicionar Risco" para começar.
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 