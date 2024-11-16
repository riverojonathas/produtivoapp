'use client'

import { useState } from 'react'
import { Feature, FeatureStatus, FeaturePriority } from '@/types/product'
import { useFeatureValidation } from '@/hooks/use-feature-validation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FeatureFormProps {
  feature?: Feature
  existingFeatures: Feature[]
  onSubmit: (data: Partial<Feature>) => Promise<void>
  isSubmitting?: boolean
}

export function FeatureForm({ 
  feature, 
  existingFeatures, 
  onSubmit,
  isSubmitting 
}: FeatureFormProps) {
  const [formData, setFormData] = useState<Partial<Feature>>(
    feature || {
      title: '',
      description: {
        what: '',
        why: '',
        who: '',
        metrics: '',
        notes: ''
      },
      status: 'planned',
      priority: 'medium',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      dependencies: [],
      assignees: [],
      tags: [],
      stories: []
    }
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validation = useFeatureValidation(existingFeatures)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar campos obrigatórios
    if (!formData.title?.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (!formData.description?.what?.trim()) {
      newErrors.description = 'Descrição do que é a feature é obrigatória'
    }

    if (!formData.description?.why?.trim()) {
      newErrors.description = 'Motivo da feature é obrigatório'
    }

    if (!formData.description?.who?.trim()) {
      newErrors.description = 'Público-alvo da feature é obrigatório'
    }

    if (!formData.startDate) {
      newErrors.dates = 'Data de início é obrigatória'
    }

    if (!formData.endDate) {
      newErrors.dates = 'Data de fim é obrigatória'
    }

    // Validações adicionais
    const titleError = validation.validateTitle(formData.title!, feature?.id)
    if (titleError) newErrors.title = titleError

    if (formData.startDate && formData.endDate) {
      const datesError = validation.validateDates(formData.startDate, formData.endDate)
      if (datesError) newErrors.dates = datesError
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Erro ao salvar feature:', error)
      setErrors({ submit: 'Erro ao salvar feature. Tente novamente.' })
    }
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
          placeholder="Nome da feature"
          className={cn(errors.title && "border-red-500")}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          Descrição
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva a feature"
          className={cn(errors.description && "border-red-500")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Status e Prioridade */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(value: FeatureStatus) => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planejado</SelectItem>
              <SelectItem value="in-progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Prioridade
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value: FeaturePriority) => 
              setFormData({ ...formData, priority: value })
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

      {/* Datas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Data de Início
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => setFormData({ ...formData, startDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-primary)]">
            Data de Fim
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => setFormData({ ...formData, endDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {errors.dates && (
        <p className="text-xs text-red-500 mt-1">{errors.dates}</p>
      )}

      {/* Erro geral */}
      {errors.submit && (
        <p className="text-sm text-red-500">{errors.submit}</p>
      )}

      {/* Botões */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : feature ? 'Salvar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
} 