'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react'
import { usePersonas } from '@/hooks/use-personas'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { use } from 'react'

type Step = 'basic' | 'characteristics' | 'goals'

interface PersonaForm {
  name: string
  description: string
  characteristics: string[]
  pain_points: string[]
  goals: string[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditPersonaPage({ params }: PageProps) {
  const id = use(params).id
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<PersonaForm>({
    name: '',
    description: '',
    characteristics: [''],
    pain_points: [''],
    goals: ['']
  })

  const { updatePersona } = usePersonas()

  // Carregar dados da persona
  useEffect(() => {
    async function loadPersona() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')

        const { data, error } = await supabase
          .from('personas')
          .select('*')
          .eq('id', id)
          .eq('owner_id', user.id)
          .single()

        if (error) throw error

        setFormData({
          name: data.name,
          description: data.description || '',
          characteristics: data.characteristics.length ? data.characteristics : [''],
          pain_points: data.pain_points.length ? data.pain_points : [''],
          goals: data.goals.length ? data.goals : ['']
        })
      } catch (error) {
        console.error('Erro ao carregar persona:', error)
        toast.error('Erro ao carregar persona')
        router.push('/personas')
      } finally {
        setLoading(false)
      }
    }

    loadPersona()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Limpar arrays vazios
      const cleanedData = {
        name: formData.name,
        description: formData.description,
        characteristics: formData.characteristics.filter(item => item.trim()),
        pain_points: formData.pain_points.filter(item => item.trim()),
        goals: formData.goals.filter(item => item.trim())
      }

      await updatePersona.mutateAsync({
        id,
        data: cleanedData
      })

      toast.success('Persona atualizada com sucesso')
      router.push('/personas')
    } catch (error) {
      console.error('Erro ao atualizar persona:', error)
      toast.error('Erro ao atualizar persona')
    }
  }

  const handleNext = () => {
    if (currentStep === 'basic' && !formData.name.trim()) {
      toast.error('Nome é obrigatório')
      return
    }
    
    const steps: Step[] = ['basic', 'characteristics', 'goals']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: Step[] = ['basic', 'characteristics', 'goals']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const addListItem = (field: 'characteristics' | 'pain_points' | 'goals') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const updateListItem = (
    field: 'characteristics' | 'pain_points' | 'goals',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const removeListItem = (
    field: 'characteristics' | 'pain_points' | 'goals',
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome da persona"
              required
            />
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da persona"
              className="min-h-[120px]"
            />
          </div>
        )

      case 'characteristics':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-4">Características</h3>
              {formData.characteristics.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) => updateListItem('characteristics', index, e.target.value)}
                    placeholder="Característica da persona"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeListItem('characteristics', index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem('characteristics')}
                className="mt-2"
              >
                Adicionar característica
              </Button>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Pontos de Dor</h3>
              {formData.pain_points.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) => updateListItem('pain_points', index, e.target.value)}
                    placeholder="Ponto de dor da persona"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeListItem('pain_points', index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem('pain_points')}
                className="mt-2"
              >
                Adicionar ponto de dor
              </Button>
            </div>
          </div>
        )

      case 'goals':
        return (
          <div className="space-y-6">
            <h3 className="text-sm font-medium mb-4">Objetivos</h3>
            {formData.goals.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={item}
                  onChange={(e) => updateListItem('goals', index, e.target.value)}
                  placeholder="Objetivo da persona"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeListItem('goals', index)}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addListItem('goals')}
              className="mt-2"
            >
              Adicionar objetivo
            </Button>
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
            onClick={() => router.push('/personas')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
              Editar Persona
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {currentStep === 'basic' && 'Informações básicas'}
              {currentStep === 'characteristics' && 'Características e pontos de dor'}
              {currentStep === 'goals' && 'Objetivos'}
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
              
              {currentStep !== 'goals' ? (
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
                  className="ml-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                >
                  Salvar Alterações
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 