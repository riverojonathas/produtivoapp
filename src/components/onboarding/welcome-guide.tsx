'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Target,
  Lightbulb,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Coffee
} from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ElementType
  action?: {
    label: string
    href: string
  }
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao Produtivo',
    description: 'Vamos ajudar você a começar da maneira certa. Preparamos um guia rápido para você conhecer as principais funcionalidades.',
    icon: Target,
    action: {
      label: 'Começar Tour',
      href: '/products'
    }
  },
  {
    id: 'lean',
    title: 'Lean Canvas',
    description: 'Comece definindo seu modelo de negócio usando o Lean Canvas. É uma ferramenta poderosa para validar suas ideias.',
    icon: Lightbulb,
    action: {
      label: 'Criar Lean Canvas',
      href: '/lean-canvas'
    }
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    description: 'Planeje suas entregas e mantenha todos alinhados com o roadmap do produto.',
    icon: Target,
    action: {
      label: 'Ver Roadmap',
      href: '/roadmap'
    }
  }
]

export function WelcomeGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  
  const CurrentIcon = ONBOARDING_STEPS[currentStep].icon

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-violet-500/5">
      <div className="flex items-start gap-6">
        {/* Progresso */}
        <div className="flex flex-col items-center gap-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "w-2 h-2 rounded-full",
                index === currentStep ? "bg-blue-500" : "bg-[var(--color-border)]"
              )}
            />
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <CurrentIcon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {ONBOARDING_STEPS[currentStep].title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    {ONBOARDING_STEPS[currentStep].description}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    {ONBOARDING_STEPS[currentStep].action && (
                      <Button
                        size="sm"
                        onClick={() => {/* Implementar navegação */}}
                      >
                        {ONBOARDING_STEPS[currentStep].action.label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(prev => 
                        prev < ONBOARDING_STEPS.length - 1 ? prev + 1 : 0
                      )}
                    >
                      {currentStep === ONBOARDING_STEPS.length - 1 ? 'Concluir' : 'Próximo'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
} 