'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Tag } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Tag {
  id: string
  name: string
  type: 'priority' | 'phase' | 'category' | 'custom'
  color?: string
}

interface ProductTagsDialogProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTags?: Tag[]
}

const tagTypes = {
  priority: {
    label: 'Prioridade',
    colors: {
      high: {
        name: 'Alta',
        class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      },
      medium: {
        name: 'Média',
        class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      },
      low: {
        name: 'Baixa',
        class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      }
    }
  },
  phase: {
    label: 'Fase',
    colors: {
      discovery: {
        name: 'Descoberta',
        class: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      },
      development: {
        name: 'Desenvolvimento',
        class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      },
      launch: {
        name: 'Lançamento',
        class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      }
    }
  },
  category: {
    label: 'Categoria',
    colors: {
      b2b: {
        name: 'B2B',
        class: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
      },
      b2c: {
        name: 'B2C',
        class: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
      },
      saas: {
        name: 'SaaS',
        class: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
      }
    }
  }
}

export function ProductTagsDialog({ productId, open, onOpenChange, currentTags = [] }: ProductTagsDialogProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(currentTags)
  const [newTag, setNewTag] = useState('')
  const { updateProductTags } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Atualizar selectedTags quando o dialog abrir
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSelectedTags(currentTags)
    } else {
      setSelectedTags([])
      setNewTag('')
    }
    onOpenChange(open)
  }

  const handleAddTag = (name: string, type: Tag['type'] = 'custom', colorClass?: string) => {
    const existingTag = selectedTags.find(tag => 
      tag.name.toLowerCase() === name.toLowerCase() && tag.type === type
    )

    if (existingTag) {
      toast.error('Esta tag já existe')
      return
    }

    const newTag: Tag = {
      id: `temp-${Date.now()}-${Math.random()}`,
      name,
      type,
      color: colorClass
    }

    setSelectedTags(prev => [...prev, newTag])
    setNewTag('')
  }

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      
      // Preparar tags para salvar
      const tagsToSave = selectedTags.map(({ id, ...tag }) => ({
        ...tag,
        type: tag.type || 'custom'
      }))

      await updateProductTags.mutateAsync({
        productId,
        tags: tagsToSave
      })

      handleOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar tags:', error)
      toast.error('Erro ao atualizar tags')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Gerenciar Tags
          </DialogTitle>
        </DialogHeader>

        {/* Tags Atuais */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge 
                key={tag.id}
                variant="secondary"
                className={cn(
                  "flex items-center gap-1",
                  tag.color
                )}
              >
                {tag.name}
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 hover:text-red-600"
                  aria-label="Remover tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {selectedTags.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Nenhuma tag adicionada
              </p>
            )}
          </div>
        </div>

        {/* Adicionar Nova Tag */}
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nova tag personalizada..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTag) {
                e.preventDefault()
                handleAddTag(newTag)
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => newTag && handleAddTag(newTag)}
            disabled={!newTag || isSubmitting}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Tags Predefinidas */}
        <div className="space-y-4">
          {Object.entries(tagTypes).map(([type, { label, colors }]) => (
            <div key={type} className="space-y-2">
              <h4 className="text-sm font-medium">{label}</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(colors).map(([key, { name, class: colorClass }]) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className={cn(
                      colorClass,
                      "cursor-pointer hover:opacity-80"
                    )}
                    onClick={() => handleAddTag(name, type as Tag['type'], colorClass)}
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 