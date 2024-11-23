'use client'

import { useState } from 'react'
import { AnimatedDialog } from '@/components/ui/animated-dialog'
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Tag } from "lucide-react"
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ITag } from '@/types/product'

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

interface ProductTagsDialogProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTags?: ITag[]
}

interface TagType {
  id: string
  product_id: string
  name: string
  type: 'priority' | 'phase' | 'category' | 'custom'
  color?: string
  created_at: string
  updated_at: string
}

export function ProductTagsDialog({ 
  productId, 
  open, 
  onOpenChange,
  currentTags = []
}: ProductTagsDialogProps) {
  const { updateProductTags } = useProducts()
  const [selectedTags, setSelectedTags] = useState<ITag[]>(
    Array.from(new Map(currentTags.map(tag => [`${tag.type}-${tag.name}`, tag])).values())
  )
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTag = (name: string, type: 'priority' | 'phase' | 'category' | 'custom' = 'custom', colorClass?: string) => {
    if (!name.trim()) return

    if (type !== 'custom') {
      setSelectedTags(prev => prev.filter(tag => tag.type !== type))
    } else {
      const existingCustomTag = selectedTags.find(tag => 
        tag.type === 'custom' && tag.name.toLowerCase() === name.toLowerCase()
      )
      
      if (existingCustomTag) {
        toast.error('Esta tag já existe')
        return
      }
    }

    const newTagObj: ITag = {
      id: `temp-${Date.now()}`,
      product_id: productId,
      name: name.trim(),
      type,
      color: colorClass,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setSelectedTags(prev => [...prev, newTagObj])
    setNewTag('')
  }

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      
      const uniqueTags = Array.from(
        new Map(selectedTags.map(tag => [`${tag.type}-${tag.name}`, tag])).values()
      )
      
      await updateProductTags.mutateAsync({
        productId,
        tags: uniqueTags.map(tag => ({
          name: tag.name,
          type: tag.type,
          color: tag.color
        }))
      })

      toast.success('Tags atualizadas com sucesso')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar tags:', error)
      toast.error('Erro ao atualizar tags')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para organizar as tags por tipo
  const organizedTags = selectedTags.reduce((acc, tag) => {
    const type = tag.type as keyof typeof tagTypes
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(tag)
    return acc
  }, {} as Record<string, ITag[]>)

  return (
    <AnimatedDialog
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-[600px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Gerenciar Tags
          </DialogTitle>
          <DialogDescription>
            Adicione ou remova tags para organizar seu produto.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tags Predefinidas */}
          <div className="space-y-4">
            {Object.entries(tagTypes).map(([type, { label, colors }]) => (
              <div key={type} className="space-y-2">
                <h4 className="text-sm font-medium">{label}</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(colors).map(([key, { name, class: colorClass }]) => {
                    const isSelected = selectedTags.some(
                      tag => tag.name === name && tag.type === type
                    )
                    
                    return (
                      <Badge
                        key={key}
                        variant="secondary"
                        className={`${colorClass} cursor-pointer hover:opacity-80 ${
                          isSelected ? 'opacity-50' : ''
                        }`}
                        onClick={() => !isSelected && handleAddTag(name, type as any, colorClass)}
                      >
                        {name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Tags Selecionadas - Organizadas por tipo */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Tags Selecionadas</h4>
            {Object.entries(tagTypes).map(([type, { label }]) => {
              const tagsOfType = organizedTags[type] || []
              
              if (tagsOfType.length === 0) return null

              return (
                <div key={type} className="space-y-2">
                  <h5 className="text-xs text-[var(--color-text-secondary)]">{label}</h5>
                  <div className="flex flex-wrap gap-2">
                    {tagsOfType.map((tag: TagType) => (
                      <Badge 
                        key={tag.id}
                        variant="secondary"
                        className={`flex items-center gap-1 ${tag.color || ''}`}
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
                  </div>
                </div>
              )
            })}

            {/* Tags Personalizadas */}
            {selectedTags.filter(tag => tag.type === 'custom').length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs text-[var(--color-text-secondary)]">Personalizadas</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTags
                    .filter(tag => tag.type === 'custom')
                    .map(tag => (
                      <Badge 
                        key={tag.id}
                        variant="secondary"
                        className="flex items-center gap-1"
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
                </div>
              </div>
            )}

            {selectedTags.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Nenhuma tag adicionada
              </p>
            )}
          </div>

          {/* Adicionar Tag Personalizada */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Adicionar Tag Personalizada</h4>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nova tag..."
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
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
        </div>
      </motion.div>
    </AnimatedDialog>
  )
} 