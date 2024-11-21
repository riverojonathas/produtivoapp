'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { useStoryTemplates } from '@/hooks/use-story-templates'
import { toast } from 'sonner'
import { IStoryTemplate } from '@/types/story-template'
import { STORY_STATUS, StoryStatus } from '@/types/story'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type StoryTemplateFormData = {
  title: string
  description: {
    asA: string
    iWant: string
    soThat: string
  }
  defaultPoints: number
  defaultStatus: StoryStatus
  suggestedCriteria: string[]
  category: string
}

// Componente interno que usa useSearchParams
function NewTemplateStoryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const duplicateId = searchParams.get('duplicate')
  const { templates = [], createTemplate } = useStoryTemplates()
  const [formData, setFormData] = useState<StoryTemplateFormData>({
    title: '',
    description: {
      asA: '',
      iWant: '',
      soThat: ''
    },
    defaultPoints: 1,
    defaultStatus: 'open',
    suggestedCriteria: [],
    category: ''
  })

  // Carregar dados se for duplicação
  useEffect(() => {
    if (duplicateId) {
      const templateToDuplicate = templates.find(t => t.id === duplicateId)
      if (templateToDuplicate) {
        setFormData({
          title: `${templateToDuplicate.title} (Cópia)`,
          description: templateToDuplicate.description,
          defaultPoints: templateToDuplicate.defaultPoints || 1,
          defaultStatus: templateToDuplicate.defaultStatus || 'open',
          suggestedCriteria: templateToDuplicate.suggestedCriteria || [],
          category: templateToDuplicate.category || ''
        })
      }
    }
  }, [duplicateId, templates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!formData.title?.trim()) {
        toast.error('Título é obrigatório')
        return
      }

      // Converter para o formato esperado pela API
      const templateData: Partial<IStoryTemplate> = {
        title: formData.title,
        description: formData.description,
        defaultPoints: formData.defaultPoints,
        defaultStatus: formData.defaultStatus as StoryStatus,
        suggestedCriteria: formData.suggestedCriteria,
        category: formData.category
      }

      await createTemplate.mutateAsync(templateData)
      toast.success('Template criado com sucesso')
      router.push('/stories/templates')
    } catch (error) {
      console.error('Erro ao criar template:', error)
      toast.error('Erro ao criar template')
    }
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => router.push('/stories/templates')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
            Novo Template
          </h1>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título do template"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex: Frontend, Backend, UX..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Story Points Padrão</label>
                  <Select
                    value={formData.defaultPoints?.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, defaultPoints: parseInt(value) }))}
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status Inicial</label>
                  <Select
                    value={formData.defaultStatus}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, defaultStatus: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STORY_STATUS).map(([key, status]) => (
                        <SelectItem key={key} value={key}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-6">
              <h2 className="text-sm font-medium">Descrição</h2>
              
              <div className="space-y-2">
                <label className="text-sm text-[var(--color-text-secondary)]">Como...</label>
                <Textarea
                  value={formData.description?.asA}
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
                <label className="text-sm text-[var(--color-text-secondary)]">Eu quero...</label>
                <Textarea
                  value={formData.description?.iWant}
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
                <label className="text-sm text-[var(--color-text-secondary)]">Para que...</label>
                <Textarea
                  value={formData.description?.soThat}
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

            {/* Critérios Sugeridos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium">Critérios de Aceitação Sugeridos</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    suggestedCriteria: [...(prev.suggestedCriteria || []), '']
                  }))}
                >
                  Adicionar Critério
                </Button>
              </div>
              <div className="space-y-3">
                {formData.suggestedCriteria?.map((criteria, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={criteria}
                      onChange={(e) => {
                        const newCriteria = [...(formData.suggestedCriteria || [])]
                        newCriteria[index] = e.target.value
                        setFormData(prev => ({
                          ...prev,
                          suggestedCriteria: newCriteria
                        }))
                      }}
                      placeholder="Descreva um critério de aceitação..."
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newCriteria = formData.suggestedCriteria?.filter((_, i) => i !== index)
                        setFormData(prev => ({
                          ...prev,
                          suggestedCriteria: newCriteria
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

            {/* Botões */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/stories/templates')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createTemplate.isPending}
                className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
              >
                Criar Template
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Componente principal com Suspense
export default function NewTemplateStoryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    }>
      <NewTemplateStoryContent />
    </Suspense>
  )
} 