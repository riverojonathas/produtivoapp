'use client'

import { useState } from 'react'
import { FeatureDescription } from '@/types/product'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip'

interface FeatureDescriptionFormProps {
  value: FeatureDescription
  onChange: (value: FeatureDescription) => void
}

const examples = {
  what: 'Sistema de notificações em tempo real',
  why: 'Aumentar o engajamento dos usuários mantendo-os informados sobre atualizações importantes',
  who: 'Usuários ativos da plataforma que precisam estar atualizados sobre mudanças',
  metrics: 'Taxa de abertura das notificações, tempo de resposta às notificações',
  notes: 'Integrar com sistema de preferências do usuário para personalização'
}

export function FeatureDescriptionForm({ value, onChange }: FeatureDescriptionFormProps) {
  const [activeSection, setActiveSection] = useState<keyof FeatureDescription | null>(null)

  const handleChange = (field: keyof FeatureDescription, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue
    })
  }

  const renderField = (
    field: keyof FeatureDescription,
    label: string,
    placeholder: string,
    required = true
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => setActiveSection(activeSection === field ? null : field)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="font-medium">Exemplo:</p>
                <p className="text-[var(--color-text-secondary)]">{examples[field]}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Textarea
        value={value[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        className={`h-24 ${required ? 'required' : ''}`}
      />
    </div>
  )

  return (
    <div className="space-y-4">
      {renderField(
        'what',
        'O que é a feature?',
        'Descreva claramente o que será desenvolvido...'
      )}
      
      {renderField(
        'why',
        'Por que é necessária?',
        'Explique o valor de negócio e os benefícios esperados...'
      )}
      
      {renderField(
        'who',
        'Para quem é destinada?',
        'Descreva o público-alvo e os usuários impactados...'
      )}
      
      {renderField(
        'metrics',
        'Métricas de sucesso (opcional)',
        'Como medir o sucesso desta feature?',
        false
      )}
      
      {renderField(
        'notes',
        'Notas adicionais (opcional)',
        'Informações complementares, considerações técnicas...',
        false
      )}
    </div>
  )
} 