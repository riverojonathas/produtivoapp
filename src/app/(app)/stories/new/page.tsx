'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ChevronLeft, ChevronRight, Files } from 'lucide-react'
import { useStories } from '@/hooks/use-stories'
import { toast } from 'sonner'
import { useFeatures } from '@/hooks/use-features'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IUserStory, UserStoryFormData, IUserStoryDescription } from '@/types/story'
import { StoryTemplateSelect } from '@/components/stories/story-template-select'

type Step = 'basic' | 'description' | 'criteria'

const steps: Step[] = ['basic', 'description', 'criteria']

function NewStoryPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const duplicateId = searchParams.get('duplicate')
  const { createStory, stories } = useStories()
  const { features } = useFeatures()
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [formData, setFormData] = useState<UserStoryFormData>({
    title: '',
    description: {
      asA: '',
      iWant: '',
      soThat: ''
    },
    points: 1,
    status: 'open',
    feature_id: '',
    acceptanceCriteria: []
  })
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)

  // Carregar dados se for duplicação
  useEffect(() => {
    if (duplicateId) {
      const storyToDuplicate = stories.find(s => s.id === duplicateId)
      if (storyToDuplicate) {
        setFormData({
          ...storyToDuplicate,
          title: `${storyToDuplicate.title} (Cópia)`,
          status: 'open'
        })
      }
    }
  }, [duplicateId, stories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validações
      if (!formData.title?.trim()) {
        toast.error('Título é obrigatório')
        return
      }

      if (!formData.feature_id) {
        toast.error('Feature é obrigatória')
        return
      }

      // Garantir que todos os campos da descrição estão preenchidos
      if (!formData.description.asA || !formData.description.iWant || !formData.description.soThat) {
        toast.error('Todos os campos da descrição são obrigatórios')
        return
      }

      const storyData: Partial<IUserStory> = {
        ...formData,
        description: formData.description as IUserStoryDescription,
        points: formData.points || 1,
        status: formData.status || 'open',
        acceptanceCriteria: formData.acceptanceCriteria || []
      }

      const newStory = await createStory.mutateAsync(storyData)
      toast.success('História criada com sucesso')
      router.push('/stories')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao criar história'
      console.error('Erro completo ao criar história:', error)
      toast.error(`Erro ao criar história: ${message}`)
    }
  }

  const handleNext = () => {
    // Validar campos obrigatórios no primeiro passo
    if (currentStep === 'basic') {
      if (!formData.title?.trim()) {
        toast.error('Título é obrigatório')
        return
      }
      if (!formData.feature_id) {
        toast.error('Feature é obrigatória')
        return
      }
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
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Feature</label>
              <Select
                value={formData.feature_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, feature_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a feature" />
                </SelectTrigger>
                <SelectContent>
                  {features.map(feature => (
                    <SelectItem key={feature.id} value={feature.id}>
                      {feature.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Story Points</label>
              <Select
                value={formData.points?.toString() || '1'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, points: parseInt(value) }))}
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
                  description: {
                    ...prev.description,
                    asA: e.target.value
                  }
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
                  description: {
                    ...prev.description,
                    iWant: e.target.value
                  }
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
                  description: {
                    ...prev.description,
                    soThat: e.target.value
                  }
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
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    acceptanceCriteria: [...(prev.acceptanceCriteria || []), '']
                  }))}
                >
                  Adicionar Critério
                </Button>
              </div>
              <div className="space-y-3">
                {formData.acceptanceCriteria?.map((criteria: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={criteria}
                      onChange={(e) => {
                        const newCriteria = [...(formData.acceptanceCriteria || [])]
                        newCriteria[index] = e.target.value
                        setFormData(prev => ({
                          ...prev,
                          acceptanceCriteria: newCriteria
                        }))
                      }}
                      placeholder="Descreva um critério de aceitação..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newCriteria = formData.acceptanceCriteria?.filter((_: string, i: number) => i !== index)
                        setFormData(prev => ({
                          ...prev,
                          acceptanceCriteria: newCriteria
                        }))
                      }}
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
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => router.push('/stories')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
              Nova História
            </h1>
          </div>

          {/* Lado Direito - Botão de Template */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplateDialog(true)}
            className="h-8"
          >
            <Files className="w-3.5 h-3.5 mr-2" />
            Usar Template
          </Button>
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
              
              <Button
                type="submit"
                className="ml-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                disabled={currentStep === 'criteria' && createStory.isPending}
              >
                {currentStep === 'criteria' ? 'Criar História' : 'Próximo'}
                {currentStep !== 'criteria' && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Dialog de Template */}
      <StoryTemplateSelect
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onSelect={(template) => {
          setFormData(prev => ({
            ...prev,
            title: template.title,
            description: template.description,
            points: template.defaultPoints,
            status: template.defaultStatus,
            acceptanceCriteria: template.suggestedCriteria
          }))
          toast.success('Template aplicado com sucesso')
        }}
      />
    </div>
  )
}

export default function NewStoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    }>
      <NewStoryPageContent />
    </Suspense>
  )
} 