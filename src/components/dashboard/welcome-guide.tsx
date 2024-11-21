'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { 
  Package, 
  Users, 
  ListTodo, 
  BookOpen,
  Target,
  Lightbulb,
  ArrowRight,
  X,
  Sparkles,
  GitBranch
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const steps = [
  {
    id: 'products',
    title: 'Produtos',
    description: 'Comece criando seu primeiro produto e defina sua visão',
    icon: Package,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    href: '/products/new',
    sections: [
      {
        title: 'Como criar um produto efetivo',
        description: 'Um produto bem definido é a base para o sucesso',
        steps: [
          'Defina claramente a visão do produto',
          'Identifique o público-alvo específico',
          'Estabeleça métricas HEART para acompanhamento',
          'Defina uma métrica North Star',
          'Mapeie riscos e planos de mitigação'
        ],
        tips: [
          'Mantenha a visão do produto simples e inspiradora',
          'Valide suas suposições com usuários reais',
          'Revise e atualize as métricas regularmente',
          'Mantenha um registro de lições aprendidas'
        ]
      }
    ]
  },
  {
    id: 'lean-canvas',
    title: 'Lean Canvas',
    description: 'Valide suas hipóteses e encontre o product-market fit',
    icon: Lightbulb,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100 dark:bg-amber-900/20',
    href: '/lean-canvas',
    sections: [
      {
        title: 'Como usar o Lean Canvas',
        description: 'Valide suas hipóteses de negócio de forma estruturada',
        steps: [
          'Identifique o problema principal',
          'Defina sua proposta única de valor',
          'Liste seus principais indicadores',
          'Calcule a estrutura de custos',
          'Identifique fontes de receita'
        ],
        tips: [
          'Foque em problemas reais dos usuários',
          'Teste suas hipóteses rapidamente',
          'Itere com base no feedback',
          'Mantenha o canvas atualizado'
        ]
      }
    ]
  },
  {
    id: 'personas',
    title: 'Personas',
    description: 'Defina seus usuários ideais e suas necessidades',
    icon: Users,
    color: 'text-violet-500',
    bgColor: 'bg-violet-100 dark:bg-violet-900/20',
    href: '/personas',
    sections: [
      {
        title: 'Como criar personas efetivas',
        description: 'Personas ajudam a entender melhor seus usuários e suas necessidades',
        steps: [
          'Identifique os diferentes perfis de usuários',
          'Defina características demográficas',
          'Liste objetivos e motivações',
          'Descreva dores e necessidades',
          'Estabeleça comportamentos típicos'
        ],
        tips: [
          'Use dados reais sempre que possível',
          'Mantenha as personas atualizadas',
          'Não crie personas demais (3-5 é o ideal)',
          'Foque em comportamentos, não apenas demografia'
        ]
      }
    ]
  },
  {
    id: 'features',
    title: 'Features',
    description: 'Planeje as funcionalidades do seu produto',
    icon: ListTodo,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    href: '/features',
    sections: [
      {
        title: 'Como definir features de valor',
        description: 'Features bem definidas são essenciais para o sucesso do produto',
        steps: [
          'Identifique o problema a ser resolvido',
          'Defina o valor para o usuário',
          'Estabeleça critérios de aceitação',
          'Considere dependências técnicas',
          'Estime esforço e impacto'
        ],
        tips: [
          'Mantenha o escopo bem definido',
          'Foque no valor para o usuário',
          'Considere a viabilidade técnica',
          'Documente dependências e riscos'
        ]
      }
    ]
  },
  {
    id: 'stories',
    title: 'Histórias',
    description: 'Quebre as features em histórias de usuário',
    icon: BookOpen,
    color: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    href: '/stories',
    sections: [
      {
        title: 'Como escrever boas histórias de usuário',
        description: 'Histórias de usuário efetivas facilitam o desenvolvimento e entrega de valor',
        steps: [
          'Use o formato "Como... Eu quero... Para que..."',
          'Defina critérios de aceitação claros',
          'Estime pontos de complexidade',
          'Identifique dependências',
          'Estabeleça prioridades'
        ],
        tips: [
          'Mantenha histórias pequenas e focadas',
          'Inclua critérios de aceitação testáveis',
          'Considere o valor para o usuário',
          'Use templates para consistência'
        ]
      }
    ]
  },
  {
    id: 'prioritization',
    title: 'Priorização',
    description: 'Priorize o que será desenvolvido primeiro',
    icon: Target,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    href: '/prioritization',
    sections: [
      {
        title: 'Como priorizar efetivamente',
        description: 'Uma boa priorização garante a entrega do máximo valor possível',
        steps: [
          'Avalie o impacto no negócio',
          'Considere o esforço necessário',
          'Use o framework RICE',
          'Aplique a metodologia MoSCoW',
          'Analise dependências técnicas'
        ],
        tips: [
          'Balance valor e esforço',
          'Considere riscos e dependências',
          'Reavalie prioridades regularmente',
          'Envolva stakeholders na decisão'
        ]
      }
    ]
  }
]

interface DashboardPreferences {
  showWelcomeGuide: boolean
  completedSteps: string[]
  enabledWidgets: string[]
}

interface WelcomeGuideProps {
  completedSteps: string[]
  onStepComplete: (stepId: string) => Promise<void>
  onHide: () => Promise<void>
}

export function WelcomeGuide({ 
  completedSteps, 
  onStepComplete, 
  onHide 
}: WelcomeGuideProps) {
  const router = useRouter()
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const { preferences, updatePreferences, isLoading, error } = useUserPreferences<DashboardPreferences>(
    'dashboard-preferences',
    {
      showWelcomeGuide: true,
      completedSteps: [],
      enabledWidgets: [
        'quick-metrics',
        'recent-activities',
        'product-insights',
        'priority-features'
      ]
    }
  )

  const handleHideGuide = async () => {
    if (!preferences) return

    await updatePreferences({
      showWelcomeGuide: false,
      completedSteps: preferences.completedSteps,
      enabledWidgets: preferences.enabledWidgets
    })
  }

  const handleStepComplete = async (stepId: string) => {
    if (!preferences) return

    const completedSteps = [...preferences.completedSteps, stepId]
    await updatePreferences({
      ...preferences,
      completedSteps
    })
  }

  if (isLoading || error || !preferences || !preferences.showWelcomeGuide) {
    return null
  }

  const selectedStepData = steps.find(s => s.id === selectedStep)

  return (
    <Card className="relative p-6 mb-6">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[var(--color-primary)] bg-opacity-10">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-medium">
              Bem-vindo ao Produtivo
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Siga os passos abaixo para começar a usar a plataforma
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onHide}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid de Passos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps?.includes(step.id)

          return (
            <div
              key={step.id}
              className={cn(
                "group relative p-4 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer",
                "hover:border-[var(--color-primary)] hover:bg-[var(--color-background-subtle)]",
                isCompleted && "border-[var(--color-primary)] border-solid bg-[var(--color-background-subtle)]"
              )}
              onClick={() => setSelectedStep(step.id)}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  step.bgColor
                )}>
                  <step.icon className={cn("w-4 h-4", step.color)} />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-sm font-medium">{step.title}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-secondary)]">
                  Passo {index + 1} de {steps.length}
                </span>
              </div>

              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <div className="p-1 rounded-full bg-[var(--color-primary)]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3 text-white"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Dialog do Guia */}
      <Dialog open={!!selectedStep} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStepData?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedStepData && (
            <div className="space-y-6">
              {selectedStepData.sections.map((section, index) => (
                <Card key={index} className="p-6">
                  <div className="space-y-6">
                    {/* Cabeçalho da Seção */}
                    <div>
                      <h3 className="text-base font-medium">{section.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {section.description}
                      </p>
                    </div>

                    {/* Passos */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Passo a Passo
                      </h4>
                      <div className="grid gap-2">
                        {section.steps.map((step, stepIndex) => (
                          <div 
                            key={stepIndex}
                            className="flex items-start gap-3 p-3 bg-[var(--color-background-subtle)] rounded-lg"
                          >
                            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-medium text-[var(--color-primary)]">
                                {stepIndex + 1}
                              </span>
                            </div>
                            <p className="text-sm">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dicas */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Dicas e Boas Práticas
                      </h4>
                      <div className="grid gap-2">
                        {section.tips.map((tip, tipIndex) => (
                          <div 
                            key={tipIndex}
                            className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)]"
                          >
                            <Lightbulb className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Botões */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedStep(null)}
                >
                  Fechar
                </Button>
                <Button
                  onClick={() => {
                    handleStepComplete(selectedStepData.id)
                    router.push(selectedStepData.href)
                  }}
                >
                  Começar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Progresso */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--color-primary)] transition-all duration-300"
              style={{ 
                width: `${((preferences?.completedSteps?.length || 0) / steps.length) * 100}%` 
              }}
            />
          </div>
          <span className="text-sm text-[var(--color-text-secondary)]">
            {preferences?.completedSteps?.length || 0} de {steps.length} completos
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onHide}
          className="h-8"
        >
          Ocultar Guia
        </Button>
      </div>
    </Card>
  )
} 