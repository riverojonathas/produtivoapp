'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react'
import { useStories } from '@/hooks/use-stories'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Step = 'basic' | 'description' | 'criteria'

interface StoryForm {
  title: string
  description: {
    asA: string      // Persona/Usuário
    iWant: string    // Ação desejada
    soThat: string   // Benefício esperado
  }
  acceptance_criteria: string[]
  status: 'open' | 'in-progress' | 'completed' | 'blocked'
  points: number
  feature_id: string
  assignees: string[]
}

const steps: Step[] = ['basic', 'description', 'criteria']

const stepTitles = {
  basic: 'Informações Básicas',
  description: 'Descrição da História',
  criteria: 'Critérios de Aceitação'
}

export default function NewStoryPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [formData, setFormData] = useState<StoryForm>({
    title: '',
    description: {
      asA: '',
      iWant: '',
      soThat: ''
    },
    acceptance_criteria: [''],
    status: 'open',
    points: 0,
    feature_id: '',
    assignees: []
  })

  const { createStory } = useStories()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!formData.title.trim()) {
        toast.error('Título é obrigatório')
        return
      }

      if (!formData.description.asA.trim() || !formData.description.iWant.trim() || !formData.description.soThat.trim()) {
        toast.error('Todos os campos da descrição são obrigatórios')
        return
      }

      await createStory.mutateAsync({
        ...formData,
        acceptance_criteria: formData.acceptance_criteria.filter(criteria => criteria.trim()),
        owner_id: null // será preenchido pelo backend
      })

      toast.success('História criada com sucesso')
      router.push('/stories')
    } catch (error) {
      console.error('Erro ao criar história:', error)
      toast.error('Erro ao criar história')
    }
  }

  const handleNext = () => {
    let canProceed = true
    const errors: string[] = []

    switch (currentStep) {
      case 'basic':
        if (!formData.title.trim()) {
          errors.push('Título é obrigatório')
          canProceed = false
        }
        if (!formData.points) {
          errors.push('Story points são obrigatórios')
          canProceed = false
        }
        break

      case 'description':
        if (!formData.description.asA.trim()) {
          errors.push('Campo "Como..." é obrigatório')
          canProceed = false
        }
        if (!formData.description.iWant.trim()) {
          errors.push('Campo "Eu quero..." é obrigatório')
          canProceed = false
        }
        if (!formData.description.soThat.trim()) {
          errors.push('Campo "Para que..." é obrigatório')
          canProceed = false
        }
        break
    }

    if (!canProceed) {
      errors.forEach(error => toast.error(error))
      return
    }

    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const addCriteria = () => {
    setFormData(prev => ({
      ...prev,
      acceptance_criteria: [...prev.acceptance_criteria, '']
    }))
  }

  const updateCriteria = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      acceptance_criteria: prev.acceptance_criteria.map((item, i) => 
        i === index ? value : item
      )
    }))
  }

  const removeCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      acceptance_criteria: prev.acceptance_criteria.filter((_, i) => i !== index)
    }))
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título da história"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'open' | 'in-progress' | 'completed' | 'blocked') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberta</SelectItem>
                    <SelectItem value="in-progress">Em Progresso</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="blocked">Bloqueada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Story Points</label>
                <Select
                  value={formData.points.toString()}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, points: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione os pontos" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 8, 13].map(points => (
                      <SelectItem key={points} value={points.toString()}>
                        {points} {points === 1 ? 'ponto' : 'pontos'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 'description':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Como... (Persona/Usuário)</label>
              <Textarea
                value={formData.description.asA}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, asA: e.target.value }
                }))}
                placeholder="Descreva quem é o usuário desta história..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Eu quero... (Ação)</label>
              <Textarea
                value={formData.description.iWant}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, iWant: e.target.value }
                }))}
                placeholder="Descreva o que o usuário quer fazer..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Para que... (Benefício)</label>
              <Textarea
                value={formData.description.soThat}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, soThat: e.target.value }
                }))}
                placeholder="Descreva qual o benefício esperado..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )

      case 'criteria':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Critérios de Aceitação</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCriteria}
                >
                  Adicionar Critério
                </Button>
              </div>
              <div className="space-y-3">
                {formData.acceptance_criteria.map((criteria, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={criteria}
                      onChange={(e) => updateCriteria(index, e.target.value)}
                      placeholder="Descreva um critério de aceitação..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCriteria(index)}
                      className="shrink-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Header */}
      <div className="bg-[var(--color-background-primary)]">
        <div className="h-14 px-4 flex items-center gap-4 border-b border-[var(--color-border)]">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => router.push('/stories')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
              Nova História
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {stepTitles[currentStep]}
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderCurrentStep()}

            <div className="flex justify-between mt-6">
              {currentStep !== 'basic' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
              
              {currentStep !== 'criteria' ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createStory.isPending}
                  className="ml-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                >
                  Criar História
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 