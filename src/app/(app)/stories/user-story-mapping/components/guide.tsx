'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  Users,
  Target,
  MessageSquare,
  ListChecks,
  ArrowRight,
  HelpCircle
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const MAPPING_STEPS = [
  {
    id: 1,
    title: "DESCUBRA QUEM SÃO OS USUÁRIOS",
    description: "É quase impossível entender os resultados esperados pelos seus usuários sem saber quem eles são e quais seus jobs to be done",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    id: 2,
    title: "REÚNA O TIME E OS STAKEHOLDERS",
    description: "Dá para fazer sem? Até dá. Mas você vai perder insights importantes. Lembre-se que gestão de produto é um esporte de equipe.",
    icon: MessageSquare,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
  {
    id: 3,
    title: "DEFINA A NARRATIVA E AS ATIVIDADES",
    description: "O que exatamente seus usuários querem fazer? Quais são as macro atividades para alcançar esse resultado?",
    icon: Target,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    id: 4,
    title: "DEFINA AS ENTREGAS DE VALOR EM CADA ATIVIDADE",
    description: "Ao realizar cada passo da jornada, há várias possíveis entregas de valor para remover fricções, facilitar a vida do usuário ou encantá-lo.",
    icon: ListChecks,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
  {
    id: 5,
    title: "DEFINA AS PRIORIDADES",
    description: "Organize os cards com as entregas de valor prioritárias acima, de maneira que seja possível definir uma primeira release",
    icon: ArrowRight,
    color: "text-red-500",
    bgColor: "bg-red-500/10"
  },
  {
    id: 6,
    title: '"PARA OU CONTINUA"?',
    description: "Avalie seu Story Map e pergunte-se se você está confortável em seguir adiante com o delivery. Se não, repita os passos anteriores!",
    icon: HelpCircle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  }
]

interface GuideProps {
  currentStep: number
  onStepClick: (step: number) => void
}

export function MappingGuide({ currentStep, onStepClick }: GuideProps) {
  return (
    <div className="p-4 bg-[var(--color-background-elevated)] border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between gap-4">
        {MAPPING_STEPS.map((step) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          
          return (
            <TooltipProvider key={step.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card 
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                      isActive && "ring-2 ring-[var(--color-primary)]"
                    )}
                    onClick={() => onStepClick(step.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        step.bgColor
                      )}>
                        <Icon className={cn("w-4 h-4", step.color)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                            PASSO {step.id}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium mt-1">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-sm">{step.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
} 