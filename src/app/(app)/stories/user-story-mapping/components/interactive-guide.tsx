'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  CheckCircle,
  AlertTriangle,
  Info,
  Users,
  Target,
  ListChecks,
  ArrowRight
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Tipos para os dados do mapa
interface MapData {
  personas?: { id: string }[]
  outcomes?: { id: string }[]
  activities: StoryActivity[]
  stories: UserStory[]
}

interface GuideStep {
  id: number
  title: string
  description: string
  action: string
  example: string
  tips: string[]
  validation: (data: MapData) => boolean
  nextCondition: string
  icon: React.ElementType
}

const INTERACTIVE_GUIDE: GuideStep[] = [
  {
    id: 1,
    title: "Descubra seus Usuários",
    description: "Antes de começar, identifique claramente quem são seus usuários e o que eles precisam alcançar.",
    action: "Defina as personas principais do seu produto",
    example: "Ex: Product Manager que precisa organizar o backlog do produto",
    icon: Users,
    tips: [
      "Entreviste usuários reais",
      "Identifique suas dores e necessidades",
      "Liste os jobs to be done"
    ],
    validation: (data: MapData) => Boolean(data.personas?.length > 0),
    nextCondition: "Defina ao menos uma persona"
  },
  {
    id: 2,
    title: "Defina o Resultado Esperado",
    description: "Qual é o objetivo principal que o usuário quer alcançar?",
    action: "Adicione um resultado esperado",
    example: "Ex: Gerenciar meu e-mail eficientemente",
    icon: Target,
    tips: [
      "Use verbos de ação",
      "Foque no benefício final",
      "Mantenha simples e direto"
    ],
    validation: (data: MapData) => Boolean(data.outcomes?.length > 0),
    nextCondition: "Adicione um resultado esperado"
  },
  {
    id: 3,
    title: "Defina as Atividades",
    description: "Quais são as principais atividades que o usuário realiza?",
    action: "Adicione as atividades principais",
    example: "Ex: Procurar, Arquivar, Escrever, Ler",
    icon: ListChecks,
    tips: [
      "Pense na jornada do usuário",
      "Mantenha o nível macro",
      "Foque nas ações principais"
    ],
    validation: (data: MapData) => data.activities.length > 0,
    nextCondition: "Adicione ao menos uma atividade"
  },
  {
    id: 4,
    title: "Adicione as Histórias",
    description: "Detalhe as histórias de usuário para cada atividade",
    action: "Adicione histórias de usuário",
    example: "Ex: Procurar por palavra-chave, Mover e-mails",
    icon: ArrowRight,
    tips: [
      "Use o formato 'Como [persona], quero [ação] para [benefício]'",
      "Mantenha o escopo pequeno",
      "Pense em valor entregue"
    ],
    validation: (data: MapData) => data.stories.length > 0,
    nextCondition: "Adicione ao menos uma história"
  }
]

interface InteractiveGuideProps {
  currentStep: number
  onStepComplete: (step: number) => void
  onStepHint: (hint: string) => void
  data: MapData
  onClose?: () => void
}

export function InteractiveGuide({ 
  currentStep, 
  onStepComplete, 
  onStepHint,
  data,
  onClose 
}: InteractiveGuideProps) {
  const step = INTERACTIVE_GUIDE[currentStep - 1]
  
  if (!step) return null

  const isStepValid = step.validation(data)
  const Icon = step.icon

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <Info className="w-4 h-4" />
          Guia Interativo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-blue-500" />
            <span>Passo {step.id} de {INTERACTIVE_GUIDE.length}</span>
            {isStepValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
          </DialogTitle>
          <DialogDescription>
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ação Necessária */}
          <div>
            <h4 className="text-sm font-medium mb-2">Ação Necessária</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {step.action}
            </p>
          </div>

          {/* Exemplo */}
          <div>
            <h4 className="text-sm font-medium mb-2">Exemplo</h4>
            <Card className={cn(
              "p-3",
              "bg-[var(--color-background-subtle)]",
              "border-[var(--color-border)]"
            )}>
              <p className="text-sm">{step.example}</p>
            </Card>
          </div>

          {/* Dicas */}
          <div>
            <h4 className="text-sm font-medium mb-2">Dicas Úteis</h4>
            <div className="space-y-2">
              {step.tips.map((tip, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-blue-500 font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)]">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Validação e Próximos Passos */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
            {!isStepValid && step.nextCondition && (
              <p className="text-sm text-yellow-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {step.nextCondition}
              </p>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                onClick={() => onStepHint(step.action)}
              >
                Preciso de Ajuda
              </Button>
              <Button
                onClick={() => {
                  onStepComplete(step.id)
                  if (currentStep === INTERACTIVE_GUIDE.length) {
                    onClose?.()
                  }
                }}
                disabled={!isStepValid}
              >
                {currentStep === INTERACTIVE_GUIDE.length ? 'Concluir' : 'Próximo Passo'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 