'use client'

import { cn } from "@/lib/utils"
import { Step, steps, stepTitles } from "@/types/product-form"
import { CheckCircle2 } from "lucide-react"

interface StepProgressProps {
  currentStep: Step
  onStepClick: (step: Step) => void
  completedSteps: Set<Step>
  validationErrors: Record<Step, string[]>
}

export function StepProgress({ 
  currentStep, 
  onStepClick,
  completedSteps,
  validationErrors 
}: StepProgressProps) {
  const currentIndex = steps.indexOf(currentStep)
  
  return (
    <div className="mb-16 relative">
      {/* Container principal com padding reduzido */}
      <div className="relative flex justify-between items-center px-4">
        {/* Linha conectora com design mais sutil */}
        <div className="absolute top-[15px] left-[15px] right-[15px] h-[1px] bg-gray-200" />
        
        {/* Linha de progresso com transição suave */}
        <div 
          className="absolute top-[15px] left-[15px] h-[1px] bg-[var(--color-primary)] transition-all duration-500 ease-in-out"
          style={{ 
            width: `${(currentIndex / (steps.length - 1)) * (100 - 5)}%`
          }} 
        />

        {steps.map((step, index) => (
          <div key={step} className="relative flex flex-col items-center">
            <button
              onClick={() => onStepClick(step)}
              disabled={index > currentIndex + 1}
              className="relative group focus:outline-none"
            >
              {/* Círculo indicador com animações suaves */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                "font-medium text-sm",
                completedSteps.has(step)
                  ? "bg-[var(--color-primary)] text-white shadow-sm scale-105"
                  : index === currentIndex
                  ? "bg-white border-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "bg-white border border-gray-200 text-gray-400",
                "hover:scale-110 hover:shadow-md",
                validationErrors[step]?.length > 0 && index === currentIndex && "border-red-500 text-red-500"
              )}>
                {completedSteps.has(step) ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Título da etapa com melhor espaçamento e transições */}
              <div className={cn(
                "absolute -bottom-8 left-1/2 -translate-x-1/2",
                "whitespace-nowrap text-xs font-medium",
                "transition-all duration-300",
                "pt-2",
                index === currentIndex 
                  ? "text-[var(--color-primary)] transform scale-105" 
                  : completedSteps.has(step)
                  ? "text-gray-600"
                  : "text-gray-400"
              )}>
                <span className="relative">
                  {stepTitles[step]}
                  {validationErrors[step]?.length > 0 && index === currentIndex && (
                    <span className="absolute -right-4 -top-1 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 