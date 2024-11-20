'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useStoryTemplates } from '@/hooks/use-story-templates'
import { IStoryTemplate } from '@/types/story-template'
import { Badge } from '@/components/ui/badge'

interface StoryTemplateSelectProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (template: IStoryTemplate) => void
}

export function StoryTemplateSelect({
  open,
  onOpenChange,
  onSelect
}: StoryTemplateSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { templates = [], isLoading } = useStoryTemplates()

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.asA.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.iWant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.soThat.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecionar Template</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <Input
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Lista de Templates */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <p className="text-sm">Carregando templates...</p>
              </div>
            ) : filteredTemplates.length > 0 ? (
              filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className="p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-elevated)] transition-colors cursor-pointer"
                  onClick={() => {
                    onSelect(template)
                    onOpenChange(false)
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">{template.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {template.defaultPoints} {template.defaultPoints === 1 ? 'ponto' : 'pontos'}
                      </Badge>
                      {template.category && (
                        <Badge variant="outline">
                          {template.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    <p>Como {template.description.asA},</p>
                    <p>Eu quero {template.description.iWant},</p>
                    <p>Para que {template.description.soThat}</p>
                  </div>
                  {template.suggestedCriteria?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
                      <p className="text-xs text-[var(--color-text-secondary)] mb-1">
                        Critérios Sugeridos:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.suggestedCriteria.map((criteria, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {criteria}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <p className="text-sm">Nenhum template encontrado</p>
                <p className="text-xs mt-1">Tente buscar com outros termos</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 