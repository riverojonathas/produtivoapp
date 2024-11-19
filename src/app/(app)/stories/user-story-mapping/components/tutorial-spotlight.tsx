'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  ChevronRight,
  ChevronLeft,
  X,
  Lightbulb
} from 'lucide-react'

const TUTORIAL_STEPS = [
  {
    target: 'outcome-section',
    title: 'Resultados Esperados',
    description: 'Comece definindo os principais resultados que seus usuários querem alcançar.',
    position: 'right' as const
  },
  {
    target: 'activities-section',
    title: 'Atividades',
    description: 'Liste as principais atividades necessárias para alcançar cada resultado.',
    position: 'right' as const
  },
  {
    target: 'stories-section',
    title: 'Histórias de Usuário',
    description: 'Adicione histórias detalhadas para cada atividade.',
    position: 'bottom' as const
  },
  {
    target: 'release-line',
    title: 'Linha de Release',
    description: 'Use esta linha para separar histórias por release.',
    position: 'top' as const
  }
]

interface SpotlightProps {
  isOpen: boolean
  onClose: () => void
}

export function TutorialSpotlight({ isOpen, onClose }: SpotlightProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [elementRect, setElementRect] = useState<DOMRect | null>(null)

  const updateElementPosition = useCallback(() => {
    if (!isOpen) return

    const step = TUTORIAL_STEPS[currentStep]
    if (!step) return

    const element = document.getElementById(step.target)
    if (element) {
      const rect = element.getBoundingClientRect()
      setElementRect(rect)

      // Scroll para o elemento se necessário
      const isVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      )

      if (!isVisible) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [isOpen, currentStep])

  useEffect(() => {
    if (isOpen) {
      updateElementPosition()
      const handleUpdate = () => {
        requestAnimationFrame(updateElementPosition)
      }

      window.addEventListener('resize', handleUpdate)
      window.addEventListener('scroll', handleUpdate)

      return () => {
        window.removeEventListener('resize', handleUpdate)
        window.removeEventListener('scroll', handleUpdate)
      }
    }
  }, [isOpen, updateElementPosition])

  // Atualiza a posição quando o passo muda
  useEffect(() => {
    updateElementPosition()
  }, [currentStep, updateElementPosition])

  if (!isOpen || !elementRect) return null

  const step = TUTORIAL_STEPS[currentStep]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* ... resto do código permanece igual ... */}
      </div>
    </AnimatePresence>
  )
} 