'use client'

import { useState } from 'react'
import { UserStory, StoryStatus } from '@/types/product'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UserStoryFormProps {
  value?: UserStory
  featureId: string
  onSubmit: (data: Partial<UserStory>) => Promise<void>
  isSubmitting?: boolean
}

export function UserStoryForm({ value, featureId, onSubmit, isSubmitting }: UserStoryFormProps) {
  const [formData, setFormData] = useState<Partial<UserStory>>(
    value || {
      featureId,
      title: '',
      description: {
        asA: '',
        iWant: '',
        soThat: ''
      },
      acceptanceCriteria: [''],
      status: 'open',
      points: 1,
      assignees: []
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description.asA || !formData.description.iWant || !formData.description.soThat) {
      return
    }
    await onSubmit(formData)
  }

  const handleAddCriteria = () => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: [...(prev.acceptanceCriteria || []), '']
    }))
  }

  const handleRemoveCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria?.filter((_, i) => i !== index)
    }))
  }

  const handleCriteriaChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria?.map((item, i) => 
        i === index ? value : item
      )
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          Título
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Título da história"
          required
        />
      </div>

      {/* Descrição no formato User Story */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          História de Usuário
        </label>
        
        <div className="space-y-3">
          <div className="flex gap-2 items-start">
            <span className="text-xs font-medium text-[var(--color-text-secondary)] mt-2">Como</span>
            <Input
              value={formData.description.asA}
              onChange={(e) => setFormData({
                ...formData,
                description: { ...formData.description, asA: e.target.value }
              })}
              placeholder="usuário do sistema"
              required
            />
          </div>

          <div className="flex gap-2 items-start">
            <span className="text-xs font-medium text-[var(--color-text-secondary)] mt-2">Eu quero</span>
            <Input
              value={formData.description.iWant}
              onChange={(e) => setFormData({
                ...formData,
                description: { ...formData.description, iWant: e.target.value }
              })}
              placeholder="realizar uma ação específica"
              required
            />
          </div>

          <div className="flex gap-2 items-start">
            <span className="text-xs font-medium text-[var(--color-text-secondary)] mt-2">Para que</span>
            <Input
              value={formData.description.soThat}
              onChange={(e) => setFormData({
                ...formData,
                description: { ...formData.description, soThat: e.target.value }
              })}
              placeholder="eu obtenha um benefício"
              required
            />
          </div>
        </div>
      </div>

      {/* Critérios de Aceitação */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          Critérios de Aceitação
        </label>
        
        {formData.acceptanceCriteria?.map((criteria, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={criteria}
              onChange={(e) => handleCriteriaChange(index, e.target.value)}
              placeholder="Descreva um critério de aceitação"
              required
            />
            {formData.acceptanceCriteria!.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCriteria(index)}
                className="shrink-0"
              >
                Remover
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCriteria}
        >
          Adicionar Critério
        </Button>
      </div>

      {/* Story Points e Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Story Points
          </label>
          <Select
            value={String(formData.points)}
            onValueChange={(value) => setFormData({ ...formData, points: Number(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione os pontos" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 5, 8, 13].map((points) => (
                <SelectItem key={points} value={String(points)}>
                  {points} {points === 1 ? 'ponto' : 'pontos'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(value: StoryStatus) => setFormData({ ...formData, status: value })}
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
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : value ? 'Salvar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
} 