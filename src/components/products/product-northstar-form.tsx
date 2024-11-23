'use client'

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { NorthStar } from "@/types/product-form"
import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { northStarSuggestions } from "./product-form-suggestions"
import { cn } from "@/lib/utils"

interface ProductNorthStarFormProps {
  northStar: NorthStar
  onChange: (northStar: NorthStar) => void
}

export function ProductNorthStarForm({ northStar, onChange }: ProductNorthStarFormProps) {
  return (
    <div className="space-y-8">
      {/* Cabeçalho Informativo */}
      <div className="flex items-start gap-4 p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)]">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
            Métrica North Star
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Defina a métrica principal que guiará o sucesso do seu produto e alinhe toda a equipe em torno dela.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Métrica Principal */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Métrica</span>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={northStar.metric}
                  onChange={(e) => onChange({ ...northStar, metric: e.target.value })}
                  placeholder="Qual é a sua métrica principal de sucesso?"
                  className={cn(
                    "flex-1",
                    northStar.metric?.trim() && "border-green-200 focus:border-green-500"
                  )}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Ver sugestões de métricas North Star"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs p-3">
                      <p className="text-xs font-medium mb-2">Sugestões de métricas:</p>
                      <ul className="text-xs space-y-1">
                        {northStarSuggestions.metric.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                            onClick={() => onChange({ ...northStar, metric: suggestion })}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Meta</span>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={northStar.target}
                  onChange={(e) => onChange({ ...northStar, target: e.target.value })}
                  placeholder="Qual é o objetivo quantificável?"
                  className={cn(
                    "flex-1",
                    northStar.target?.trim() && "border-green-200 focus:border-green-500"
                  )}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Ver sugestões de metas"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs p-3">
                      <p className="text-xs font-medium mb-2">Sugestões de metas:</p>
                      <ul className="text-xs space-y-1">
                        {northStarSuggestions.target.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                            onClick={() => onChange({ ...northStar, target: suggestion })}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Sinais */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Sinais</span>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={northStar.signals}
                  onChange={(e) => onChange({ ...northStar, signals: e.target.value })}
                  placeholder="Como você vai medir esta métrica?"
                  className={cn(
                    "flex-1",
                    northStar.signals?.trim() && "border-green-200 focus:border-green-500"
                  )}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Ver sugestões de sinais"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs p-3">
                      <p className="text-xs font-medium mb-2">Sugestões de sinais:</p>
                      <ul className="text-xs space-y-1">
                        {northStarSuggestions.signals.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                            onClick={() => onChange({ ...northStar, signals: suggestion })}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Ações</span>
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={northStar.actions}
                  onChange={(e) => onChange({ ...northStar, actions: e.target.value })}
                  placeholder="Que ações são necessárias para atingir a meta?"
                  className={cn(
                    "flex-1",
                    northStar.actions?.trim() && "border-green-200 focus:border-green-500"
                  )}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Ver sugestões de ações"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs p-3">
                      <p className="text-xs font-medium mb-2">Sugestões de ações:</p>
                      <ul className="text-xs space-y-1">
                        {northStarSuggestions.actions.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                            onClick={() => onChange({ ...northStar, actions: suggestion })}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Justificativa */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="w-32 text-sm font-semibold text-[var(--color-primary)]">Justificativa</span>
              <div className="flex-1 flex items-start gap-2">
                <Textarea
                  value={northStar.rationale}
                  onChange={(e) => onChange({ ...northStar, rationale: e.target.value })}
                  placeholder="Por que esta é a métrica mais importante para o sucesso do produto?"
                  className={cn(
                    "flex-1 min-h-[100px]",
                    northStar.rationale?.trim() && "border-green-200 focus:border-green-500"
                  )}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-600 transition-colors mt-2"
                        aria-label="Ver sugestões de justificativa"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs p-3">
                      <p className="text-xs font-medium mb-2">Sugestões de justificativa:</p>
                      <ul className="text-xs space-y-1">
                        {northStarSuggestions.rationale.map((suggestion, index) => (
                          <li 
                            key={index}
                            className="cursor-pointer hover:text-[var(--color-primary)] transition-colors pl-2 border-l-2 border-transparent hover:border-[var(--color-primary)]"
                            onClick={() => onChange({ ...northStar, rationale: suggestion })}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 