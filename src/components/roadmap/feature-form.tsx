'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Feature } from '@/types/product'
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
  onSubmit: (data: Partial<Feature>) => Promise<void>
  isSubmitting?: boolean
  defaultValues?: Partial<Feature>
}

export function FeatureForm({
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
    rice_reach: defaultValues.rice_reach || 1,
    rice_impact: defaultValues.rice_impact || 1,
    rice_confidence: defaultValues.rice_confidence || 1,
    rice_effort: defaultValues.rice_effort || 1,
    moscow_priority: defaultValues.moscow_priority || null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* RICE Score */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">RICE Score</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Reach</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.rice_reach}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  rice_reach: parseInt(e.target.value) 
                }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Impact</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.rice_impact}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  rice_impact: parseInt(e.target.value) 
                }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Confidence</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.rice_confidence}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  rice_confidence: parseInt(e.target.value) 
                }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Effort</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.rice_effort}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  rice_effort: parseInt(e.target.value) 
                }))}
              />
            </div>
          </div>
        </div>

        {/* MoSCoW */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">MoSCoW Priority</h3>
          <Select
            value={formData.moscow_priority || ''}
            onValueChange={(value) => setFormData(prev => ({ 
              ...prev, 
              moscow_priority: value 
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="must">Must Have</SelectItem>
              <SelectItem value="should">Should Have</SelectItem>
              <SelectItem value="could">Could Have</SelectItem>
              <SelectItem value="wont">Won&apos;t Have</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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