'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react'
import { useFeatures } from '@/hooks/use-features'
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

type Step = 'basic' | 'description' | 'prioritization'

interface FeatureForm {
  title: string
  description: {
    what: string
    why: string
    how: string
    who: string
  }
  status: 'backlog' | 'doing' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  start_date?: string
  end_date?: string
  product_id: string
  dependencies: string[]
  assignees: string[]
  tags: string[]
  rice_reach?: number
  rice_impact?: number
  rice_confidence?: number
  rice_effort?: number
  moscow_priority?: 'must' | 'should' | 'could' | 'wont'
}

const steps: Step[] = ['basic', 'description', 'prioritization']

const stepTitles = {
  basic: 'Informações Básicas',
  description: 'Descrição Detalhada',
  prioritization: 'Priorização'
}

export default function NewFeaturePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [formData, setFormData] = useState<FeatureForm>({
    title: '',
    description: {
      what: '',
      why: '',
      how: '',
      who: ''
    },
    status: 'backlog',
    priority: 'medium',
    product_id: '',
    dependencies: [],
    assignees: [],
    tags: []
  })

  const { createFeature } = useFeatures()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!formData.title.trim()) {
        toast.error('Título é obrigatório')
        return
      }

      await createFeature.mutateAsync({
        ...formData,
        owner_id: null // será preenchido pelo backend
      })

      toast.success('Feature criada com sucesso')
      router.push('/features')
    } catch (error) {
      console.error('Erro ao criar feature:', error)
      toast.error('Erro ao criar feature')
    }
  }

  const handleNext = () => {
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Título da feature"
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'backlog' | 'doing' | 'done' | 'blocked') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="doing">Em Progresso</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                    <SelectItem value="blocked">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Início</label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Término</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )

      case 'description':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">O que é a feature?</label>
              <Textarea
                value={formData.description.what}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, what: e.target.value }
                }))}
                placeholder="Descreva o que é esta feature..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Por que ela é necessária?</label>
              <Textarea
                value={formData.description.why}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, why: e.target.value }
                }))}
                placeholder="Explique o valor de negócio..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Como será implementada?</label>
              <Textarea
                value={formData.description.how}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, how: e.target.value }
                }))}
                placeholder="Descreva a solução técnica..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Para quem é a feature?</label>
              <Textarea
                value={formData.description.who}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, who: e.target.value }
                }))}
                placeholder="Defina o público-alvo..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        )

      case 'prioritization':
        return (
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-sm font-medium mb-4">Priorização RICE</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alcance (Reach)</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.rice_reach || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      rice_reach: parseInt(e.target.value) 
                    }))}
                    placeholder="Número de usuários impactados"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Impacto (Impact)</label>
                  <Input
                    type="number"
                    min="0"
                    max="3"
                    value={formData.rice_impact || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      rice_impact: parseInt(e.target.value) 
                    }))}
                    placeholder="Escala de 0 a 3"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confiança (Confidence)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.rice_confidence || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      rice_confidence: parseInt(e.target.value) 
                    }))}
                    placeholder="Porcentagem (0-100)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Esforço (Effort)</label>
                  <Input
                    type="number"
                    min="0.1"
                    value={formData.rice_effort || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      rice_effort: parseFloat(e.target.value) 
                    }))}
                    placeholder="Pessoa-mês"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium mb-4">Priorização MoSCoW</h3>
              <Select
                value={formData.moscow_priority}
                onValueChange={(value: 'must' | 'should' | 'could' | 'wont') => 
                  setFormData(prev => ({ ...prev, moscow_priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade MoSCoW" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="must">Must Have (Deve ter)</SelectItem>
                  <SelectItem value="should">Should Have (Deveria ter)</SelectItem>
                  <SelectItem value="could">Could Have (Poderia ter)</SelectItem>
                  <SelectItem value="wont">Won't Have (Não terá)</SelectItem>
                </SelectContent>
              </Select>
            </Card>
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
            onClick={() => router.push('/features')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
              Nova Feature
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
              
              {currentStep !== 'prioritization' ? (
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
                  disabled={createFeature.isPending}
                  className="ml-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                >
                  Criar Feature
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 