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
import { 
  AlertCircle, // Problema
  Lightbulb, // Solução
  BarChart2, // Métricas
  Target, // Proposta de Valor
  Shield, // Vantagem Competitiva
  Share2, // Canais
  Users, // Segmentos
  DollarSign, // Custos
  Wallet // Receita
} from 'lucide-react'

const CANVAS_SECTIONS = {
  problem: {
    title: 'PROBLEMA',
    subtitle: 'CRIAR VALOR',
    placeholder: 'Liste os principais problemas que quer resolver',
    hint: 'ALTERNATIVAS EXISTENTES',
    borderColor: 'border-[#FFDAB9]',
    icon: AlertCircle
  },
  solution: {
    title: 'SOLUÇÃO',
    subtitle: 'ENTREGAR VALOR',
    placeholder: 'Liste as principais características',
    hint: 'Como você resolve cada problema?',
    borderColor: 'border-[#ADD8E6]',
    icon: Lightbulb
  },
  proposition: {
    title: 'PROPOSTA DE VALOR ÚNICA',
    subtitle: 'CRIAR VALOR',
    placeholder: 'Mensagem única clara e convincente',
    hint: 'CONCEITO DE ALTO NÍVEL',
    borderColor: 'border-[#FFE4B5]',
    icon: Target
  },
  advantage: {
    title: 'VANTAGEM INJUSTA',
    subtitle: 'DEFENDER VALOR',
    placeholder: 'O que não pode ser facilmente copiado ou comprado',
    hint: 'Seu diferencial competitivo',
    borderColor: 'border-[#FFB6C1]',
    icon: Shield
  },
  segments: {
    title: 'SEGMENTOS DE CLIENTES',
    subtitle: 'CRIAR VALOR',
    placeholder: 'Quem são seus clientes?',
    hint: 'PRIMEIROS ADOTANTES',
    borderColor: 'border-[#F5DEB3]',
    icon: Users
  },
  metrics: {
    title: 'MÉTRICAS CHAVE',
    subtitle: 'MEDIR VALOR',
    placeholder: 'Números que mostram o sucesso',
    hint: 'Métricas principais',
    borderColor: 'border-[#E6E6FA]',
    icon: BarChart2
  },
  channels: {
    title: 'CANAIS',
    subtitle: 'ENTREGAR VALOR',
    placeholder: 'Caminho até os clientes',
    hint: 'Como você alcança seus clientes',
    borderColor: 'border-[#ADD8E6]',
    icon: Share2
  },
  costs: {
    title: 'ESTRUTURA DE CUSTOS',
    subtitle: 'CAPTURAR VALOR',
    placeholder: 'Custos de operação do negócio',
    hint: 'Principais custos',
    borderColor: 'border-[#90EE90]',
    icon: DollarSign
  },
  revenue: {
    title: 'FONTES DE RECEITA',
    subtitle: 'CAPTURAR VALOR',
    placeholder: 'Modelo de receita',
    hint: 'Como você ganha dinheiro',
    borderColor: 'border-[#90EE90]',
    icon: Wallet
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
          "text-sm font-medium flex items-center gap-2",
          hasContent ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
        )}>
          <info.icon className="w-4 h-4" />
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
    <div className="grid grid-rows-[1fr_auto] gap-4 h-[calc(100vh-12rem)]">
      {/* Linha Superior - 5 colunas */}
      <div className="grid grid-cols-5 gap-4">
        {/* Problem */}
        <div>
          {renderSection('problem')}
        </div>

        {/* Solution + Metrics */}
        <div className="grid grid-rows-2 gap-4">
          {renderSection('solution')}
          {renderSection('metrics')}
        </div>

        {/* Unique Value Proposition - Coluna Central */}
        <div className="h-full">
          {renderSection('proposition')}
        </div>

        {/* Unfair Advantage + Channels */}
        <div className="grid grid-rows-2 gap-4">
          {renderSection('advantage')}
          {renderSection('channels')}
        </div>

        {/* Customer Segments */}
        <div>
          {renderSection('segments')}
        </div>
      </div>

      {/* Linha Inferior - 2 colunas grandes */}
      <div className="grid grid-cols-2 gap-4 h-[200px]">
        {/* Cost Structure - 2 colunas à esquerda */}
        <div>
          {renderSection('costs')}
        </div>

        {/* Revenue Streams - 2 colunas à direita */}
        <div>
          {renderSection('revenue')}
        </div>
      </div>
    </div>
  )
} 