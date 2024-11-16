'use client'

import { useState } from 'react'
import { Persona } from '@/types/product'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

interface PersonaFormProps {
  persona?: Persona
  onSubmit: (data: Partial<Persona>) => Promise<void>
  isSubmitting?: boolean
}

export function PersonaForm({ persona, onSubmit, isSubmitting }: PersonaFormProps) {
  const [formData, setFormData] = useState<Partial<Persona>>(
    persona || {
      name: '',
      description: '',
      characteristics: [''],
      painPoints: [''],
      goals: ['']
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    await onSubmit(formData)
  }

  const validateForm = () => {
    // Implementar validações necessárias
    return true
  }

  // Funções auxiliares para gerenciar arrays
  const handleArrayChange = (
    field: 'characteristics' | 'painPoints' | 'goals',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => i === index ? value : item)
    }))
  }

  const handleAddItem = (field: 'characteristics' | 'painPoints' | 'goals') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }))
  }

  const handleRemoveItem = (field: 'characteristics' | 'painPoints' | 'goals', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index)
    }))
  }

  // Componente para lista editável
  const EditableList = ({
    title,
    field,
    items,
    placeholder
  }: {
    title: string
    field: 'characteristics' | 'painPoints' | 'goals'
    items: string[]
    placeholder: string
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--color-text-primary)]">
        {title}
      </label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(field, index)}
                className="shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddItem(field)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar {title.toLowerCase()}
        </Button>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          Nome
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome da persona"
          required
        />
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          Descrição
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva a persona"
          required
        />
      </div>

      {/* Características */}
      <EditableList
        title="Características"
        field="characteristics"
        items={formData.characteristics || ['']}
        placeholder="Adicione uma característica"
      />

      {/* Pontos de Dor */}
      <EditableList
        title="Pontos de Dor"
        field="painPoints"
        items={formData.painPoints || ['']}
        placeholder="Adicione um ponto de dor"
      />

      {/* Objetivos */}
      <EditableList
        title="Objetivos"
        field="goals"
        items={formData.goals || ['']}
        placeholder="Adicione um objetivo"
      />

      {/* Botões */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : persona ? 'Salvar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
} 