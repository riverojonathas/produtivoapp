'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const CANVAS_SECTIONS = {
  problem: {
    title: 'Problema',
    placeholder: 'Liste os principais problemas que seu produto resolve',
    hint: 'Ex: Dificuldade em gerenciar tarefas, Falta de visibilidade...',
    borderColor: 'border-purple-500/30'
  },
  solution: {
    title: 'Solução',
    placeholder: 'Como você resolve cada problema?',
    hint: 'Ex: Interface intuitiva, Automação de processos...',
    borderColor: 'border-orange-500/30'
  },
  metrics: {
    title: 'Métricas-Chave',
    placeholder: 'Quais números mostram que está funcionando?',
    hint: 'Ex: Taxa de retenção, NPS, Usuários ativos...',
    borderColor: 'border-amber-500/30'
  },
  proposition: {
    title: 'Proposta de Valor',
    placeholder: 'Qual é sua promessa única?',
    hint: 'Ex: Aumente a produtividade em 50%...',
    borderColor: 'border-emerald-500/30'
  },
  advantage: {
    title: 'Vantagem Competitiva',
    placeholder: 'O que torna seu produto único?',
    hint: 'Ex: Tecnologia proprietária, Base de usuários...',
    borderColor: 'border-lime-500/30'
  },
  channels: {
    title: 'Canais',
    placeholder: 'Como você alcança seus clientes?',
    hint: 'Ex: Marketing Digital, Vendas Diretas...',
    borderColor: 'border-teal-500/30'
  },
  segments: {
    title: 'Segmentos de Clientes',
    placeholder: 'Quem são seus clientes ideais?',
    hint: 'Ex: Startups em crescimento, Empresas médias...',
    borderColor: 'border-cyan-500/30'
  },
  costs: {
    title: 'Estrutura de Custos',
    placeholder: 'Quais são seus principais custos?',
    hint: 'Ex: Desenvolvimento, Marketing, Infraestrutura...',
    borderColor: 'border-blue-500/30'
  },
  revenue: {
    title: 'Fontes de Receita',
    placeholder: 'Como você ganha dinheiro?',
    hint: 'Ex: Assinatura mensal, Serviços premium...',
    borderColor: 'border-indigo-500/30'
  }
} as const

interface CanvasLayoutProps {
  sections: {
    problem: string[]
    solution: string[]
    metrics: string[]
    proposition: string[]
    advantage: string[]
    channels: string[]
    segments: string[]
    costs: string[]
    revenue: string[]
  }
  onSectionUpdate?: (sectionId: keyof typeof CANVAS_SECTIONS, content: string[]) => void
  isEditing?: boolean
}

export function CanvasLayout({ sections, onSectionUpdate, isEditing }: CanvasLayoutProps) {
  const renderSection = (id: keyof typeof CANVAS_SECTIONS) => {
    const info = CANVAS_SECTIONS[id]
    const content = sections[id] || []
    const hasContent = content.some(item => item.trim())
    
    return (
      <Card 
        className={cn(
          "h-full p-4 group relative",
          "hover:shadow-sm transition-all duration-200",
          "border-2",
          info.borderColor,
          hasContent && "border-opacity-50",
          "hover:border-opacity-100"
        )}
      >
        <h3 className={cn(
          "text-sm font-medium",
          hasContent ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
        )}>
          {info.title}
        </h3>

        <div className="mt-2 space-y-2">
          {isEditing ? (
            content.length > 0 ? (
              // Items existentes
              content.map((item, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "group/item relative",
                    item.trim() && "bg-[var(--color-background-subtle)] rounded-md"
                  )}
                >
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const newContent = [...content]
                      newContent[index] = e.target.value
                      onSectionUpdate?.(id, newContent)
                    }}
                    placeholder={info.placeholder}
                    className={cn(
                      "min-h-[40px] text-sm resize-none",
                      "bg-transparent border-0",
                      "focus:ring-0",
                      "placeholder:text-[var(--color-text-secondary)]/30",
                      item.trim() && [
                        "px-2 py-1",
                        "text-[var(--color-primary)] font-medium"
                      ]
                    )}
                  />
                  {item.trim() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newContent = content.filter((_, i) => i !== index)
                        onSectionUpdate?.(id, newContent)
                      }}
                      className={cn(
                        "absolute -right-2 -top-2 h-6 w-6 p-0",
                        "opacity-0 group-hover/item:opacity-100",
                        "transition-opacity duration-200"
                      )}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              // Área clicável com placeholder sutil
              <div 
                onClick={() => onSectionUpdate?.(id, [''])}
                className={cn(
                  "min-h-[100px] p-2 rounded",
                  "text-sm text-[var(--color-text-secondary)]/30",
                  "cursor-text",
                  "hover:bg-[var(--color-background-subtle)]",
                  "transition-colors duration-200"
                )}
              >
                <p>{info.placeholder}</p>
                <p className="text-xs mt-2 italic">{info.hint}</p>
              </div>
            )
          ) : (
            // Modo de visualização
            content.length > 0 ? (
              content.map((item, index) => (
                item.trim() && (
                  <div 
                    key={index} 
                    className={cn(
                      "text-sm p-2 rounded-md",
                      "bg-[var(--color-background-subtle)]",
                      "text-[var(--color-primary)]",
                      "font-medium"
                    )}
                  >
                    {item}
                  </div>
                )
              ))
            ) : (
              <div className="text-sm text-[var(--color-text-secondary)]/30 italic p-2">
                Nenhum item adicionado
              </div>
            )
          )}

          {isEditing && hasContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSectionUpdate?.(id, [...content, ''])}
              className={cn(
                "w-full h-7 text-xs",
                "text-[var(--color-text-secondary)]/50",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200"
              )}
            >
              <Plus className="w-3 h-3 mr-1" />
              Adicionar
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-10 gap-4 h-[calc(100vh-12rem)]">
      {/* Problema e Segmentos */}
      <div className="col-span-2 grid grid-rows-2 gap-4">
        {renderSection('problem')}
        {renderSection('segments')}
      </div>

      {/* Solução e Métricas */}
      <div className="col-span-2 grid grid-rows-2 gap-4">
        {renderSection('solution')}
        {renderSection('metrics')}
      </div>

      {/* Proposta de Valor */}
      <div className="col-span-2">
        {renderSection('proposition')}
      </div>

      {/* Vantagem e Canais */}
      <div className="col-span-2 grid grid-rows-2 gap-4">
        {renderSection('advantage')}
        {renderSection('channels')}
      </div>

      {/* Custos e Receitas */}
      <div className="col-span-2 grid grid-rows-2 gap-4">
        {renderSection('costs')}
        {renderSection('revenue')}
      </div>
    </div>
  )
} 