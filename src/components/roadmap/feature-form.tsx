'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Feature, Persona } from '@/types/product'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureFormProps {
  personas: Persona[]
  onSubmit: (data: Partial<Feature>) => Promise<void>
  isSubmitting?: boolean
  defaultValues?: Partial<Feature>
  products: Array<{ id: string; name: string }>
}

export function FeatureForm({
  personas,
  products,
  onSubmit,
  isSubmitting,
  defaultValues = {}
}: FeatureFormProps) {
  const [formData, setFormData] = useState({
    title: defaultValues.title || '',
    description: {
      what: defaultValues.description?.what || '',
      why: defaultValues.description?.why || '',
      how: defaultValues.description?.how || '',
      who: defaultValues.description?.who || ''
    },
    status: defaultValues.status || 'backlog',
    priority: defaultValues.priority || 'medium',
    start_date: defaultValues.start_date || null,
    end_date: defaultValues.end_date || null,
    product_id: defaultValues.product_id || '',
    persona_ids: [] as string[],
    dependencies: defaultValues.dependencies || [],
    assignees: defaultValues.assignees || [],
    tags: defaultValues.tags || []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!formData.title.trim()) {
        throw new Error('O título é obrigatório')
      }

      if (!formData.description.what.trim()) {
        throw new Error('A descrição do que será feito é obrigatória')
      }

      if (!formData.product_id) {
        throw new Error('Selecione um produto')
      }

      await onSubmit(formData)
    } catch (error) {
      console.error('Erro no formulário:', error)
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Produto */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Produto
        </label>
        <Select
          value={formData.product_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um produto" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          O que é?
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ex: Sistema de notificações em tempo real"
          required
        />
      </div>

      {/* Descrição - O que */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          O que vamos fazer?
        </label>
        <Textarea
          value={formData.description.what}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            description: { ...prev.description, what: e.target.value }
          }))}
          placeholder="Descreva detalhadamente o que será desenvolvido"
          rows={3}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Status
        </label>
        <Select
          value={formData.status}
          onValueChange={(value: Feature['status']) => setFormData(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="backlog">Backlog</SelectItem>
            <SelectItem value="doing">Em Desenvolvimento</SelectItem>
            <SelectItem value="done">Concluído</SelectItem>
            <SelectItem value="blocked">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Datas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Data de Início
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.start_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.start_date ? (
                  format(new Date(formData.start_date), "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.start_date ? new Date(formData.start_date) : undefined}
                onSelect={(date) => setFormData(prev => ({ 
                  ...prev, 
                  start_date: date?.toISOString() || null 
                }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Data de Término
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.end_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.end_date ? (
                  format(new Date(formData.end_date), "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.end_date ? new Date(formData.end_date) : undefined}
                onSelect={(date) => setFormData(prev => ({ 
                  ...prev, 
                  end_date: date?.toISOString() || null 
                }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Personas */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Personas
        </label>
        <Select
          value={formData.persona_ids.join(',')}
          onValueChange={(value) => setFormData(prev => ({ 
            ...prev, 
            persona_ids: value.split(',').filter(Boolean)
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione as personas" />
          </SelectTrigger>
          <SelectContent>
            {personas.map((persona) => (
              <SelectItem key={persona.id} value={persona.id}>
                {persona.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
} 