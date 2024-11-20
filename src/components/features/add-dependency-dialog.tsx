'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useFeatures } from '@/hooks/use-features'
import { cn } from '@/lib/utils'
import { IFeature } from '@/types/feature'

interface AddDependencyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFeatureId: string
  onSelect: (feature: IFeature) => Promise<void>
}

export function AddDependencyDialog({
  open,
  onOpenChange,
  currentFeatureId,
  onSelect
}: AddDependencyDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { features = [] } = useFeatures()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filtrar features disponíveis
  const availableFeatures = features.filter(feature => 
    // Não mostrar a feature atual
    feature.id !== currentFeatureId &&
    // Filtrar por termo de busca
    (feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description?.what?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSelect = async (feature: IFeature) => {
    try {
      setIsSubmitting(true)
      await onSelect(feature)
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao adicionar dependência:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Dependência</DialogTitle>
          <DialogDescription>
            Selecione uma feature para adicionar como dependência
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <Input
              placeholder="Buscar features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Lista de Features */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {availableFeatures.map(feature => (
              <div
                key={feature.id}
                className="p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-elevated)] transition-colors cursor-pointer"
                onClick={() => handleSelect(feature)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{feature.title}</h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-1">
                      {feature.description?.what || 'Sem descrição'}
                    </p>
                  </div>
                  <Badge variant="secondary" className={cn(
                    "ml-3 shrink-0",
                    feature.status === 'done' && "bg-emerald-100 text-emerald-700",
                    feature.status === 'doing' && "bg-blue-100 text-blue-700",
                    feature.status === 'blocked' && "bg-red-100 text-red-700",
                    feature.status === 'backlog' && "bg-gray-100 text-gray-700"
                  )}>
                    {feature.status}
                  </Badge>
                </div>
              </div>
            ))}

            {availableFeatures.length === 0 && (
              <div className="text-center py-8 text-[var(--color-text-secondary)]">
                <p className="text-sm">Nenhuma feature encontrada</p>
                <p className="text-xs mt-1">Tente buscar com outros termos</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 