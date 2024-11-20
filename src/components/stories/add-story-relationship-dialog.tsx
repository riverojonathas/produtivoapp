'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useStories } from '@/hooks/use-stories'
import { cn } from '@/lib/utils'
import { IUserStory, STORY_STATUS } from '@/types/story'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddStoryRelationshipDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStoryId: string
  onSelect: (story: IUserStory, relationshipType: string) => Promise<void>
}

const RELATIONSHIP_TYPES = {
  blocks: {
    label: 'Bloqueia',
    description: 'Esta história bloqueia o progresso da história selecionada'
  },
  blocked_by: {
    label: 'Bloqueada por',
    description: 'Esta história está bloqueada pela história selecionada'
  },
  related: {
    label: 'Relacionada',
    description: 'Histórias relacionadas que podem se beneficiar de desenvolvimento conjunto'
  },
  duplicates: {
    label: 'Duplica',
    description: 'Esta história é similar ou duplica a história selecionada'
  }
}

export function AddStoryRelationshipDialog({
  open,
  onOpenChange,
  currentStoryId,
  onSelect
}: AddStoryRelationshipDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('related')
  const { stories = [] } = useStories()
  const [isPending, setIsPending] = useState(false)

  // Filtrar histórias disponíveis
  const availableStories = stories.filter(story => 
    // Não mostrar a história atual
    story.id !== currentStoryId &&
    // Filtrar por termo de busca
    (story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description?.asA?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description?.iWant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description?.soThat?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSelect = async (story: IUserStory) => {
    try {
      setIsPending(true)
      await onSelect(story, selectedType)
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao adicionar relacionamento:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Relacionamento</DialogTitle>
          <DialogDescription>
            Selecione uma história e o tipo de relacionamento
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Tipo de Relacionamento */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Relacionamento</label>
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RELATIONSHIP_TYPES).map(([key, { label, description }]) => (
                  <SelectItem key={key} value={key}>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <Input
              placeholder="Buscar histórias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Lista de Histórias */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {availableStories.map(story => (
              <div
                key={story.id}
                className="p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-elevated)] transition-colors cursor-pointer"
                onClick={() => handleSelect(story)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">{story.title}</h3>
                  <Badge variant="secondary" className={cn(
                    "text-xs",
                    STORY_STATUS[story.status].color
                  )}>
                    {STORY_STATUS[story.status].label}
                  </Badge>
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  <p>Como {story.description.asA},</p>
                  <p>Eu quero {story.description.iWant},</p>
                  <p>Para que {story.description.soThat}</p>
                </div>
              </div>
            ))}

            {availableStories.length === 0 && (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <p className="text-sm">Nenhuma história encontrada</p>
                <p className="text-xs mt-1">Tente buscar com outros termos</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 