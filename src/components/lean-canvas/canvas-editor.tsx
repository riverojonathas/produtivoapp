'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CanvasSection {
  id: string
  title: string
  description: string
  items: string[]
}

const CANVAS_SECTIONS: CanvasSection[] = [
  {
    id: 'problem',
    title: 'Problema',
    description: 'Quais são os 3 principais problemas que seu produto resolve?',
    items: []
  },
  {
    id: 'solution',
    title: 'Solução',
    description: 'Como você resolve cada um dos problemas?',
    items: []
  },
  {
    id: 'metrics',
    title: 'Métricas-Chave',
    description: 'Quais são os números que mostram que está funcionando?',
    items: []
  },
  {
    id: 'proposition',
    title: 'Proposta de Valor',
    description: 'Por que sua solução é única e valiosa?',
    items: []
  },
  {
    id: 'advantage',
    title: 'Vantagem Competitiva',
    description: 'O que torna seu produto difícil de copiar?',
    items: []
  },
  {
    id: 'channels',
    title: 'Canais',
    description: 'Como você alcança seus clientes?',
    items: []
  },
  {
    id: 'segments',
    title: 'Segmentos de Clientes',
    description: 'Quem são seus usuários mais importantes?',
    items: []
  },
  {
    id: 'costs',
    title: 'Estrutura de Custos',
    description: 'Quais são seus principais custos?',
    items: []
  },
  {
    id: 'revenue',
    title: 'Fontes de Receita',
    description: 'Como você ganha dinheiro?',
    items: []
  }
]

interface CanvasEditorProps {
  initialData?: Record<string, string[]>
  onSave: (data: Record<string, string[]>) => void
}

export function CanvasEditor({ initialData, onSave }: CanvasEditorProps) {
  const [sections, setSections] = useState<CanvasSection[]>(
    CANVAS_SECTIONS.map(section => ({
      ...section,
      items: initialData?.[section.id] || []
    }))
  )

  // Adicionar novo item à seção
  const handleAddItem = (sectionId: string) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: [...section.items, '']
        }
      }
      return section
    }))
  }

  // Atualizar item
  const handleUpdateItem = (sectionId: string, index: number, value: string) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newItems = [...section.items]
        newItems[index] = value
        return {
          ...section,
          items: newItems
        }
      }
      return section
    }))
  }

  // Remover item
  const handleRemoveItem = (sectionId: string, index: number) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter((_, i) => i !== index)
        }
      }
      return section
    }))
  }

  // Salvar canvas
  const handleSave = () => {
    const data = sections.reduce((acc, section) => ({
      ...acc,
      [section.id]: section.items.filter(Boolean)
    }), {})

    onSave(data)
    toast.success('Canvas salvo com sucesso!')
  }

  return (
    <div className="space-y-6">
      {/* Grid do Canvas */}
      <div className="grid grid-cols-3 gap-4">
        {sections.map(section => (
          <Card key={section.id} className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">{section.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {section.description}
                </p>
              </div>

              <div className="space-y-2">
                {section.items.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={item}
                      onChange={(e) => handleUpdateItem(section.id, index, e.target.value)}
                      placeholder="Digite aqui..."
                      className="text-sm min-h-[60px]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(section.id, index)}
                      className="h-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAddItem(section.id)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Canvas
        </Button>
      </div>
    </div>
  )
} 