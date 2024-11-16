'use client'

import { useState } from 'react'
import { useFeatures } from '@/hooks/use-features'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, MoreHorizontal, Check, Clock, Play, XCircle } from 'lucide-react'
import { AddStoryDialog } from '@/components/features/add-story-dialog'
import { Badge } from '@/components/ui/badge'
import { UserStory } from '@/types/product'
import { useRoadmap } from '@/hooks/use-roadmap'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

export default function StoriesPage() {
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { features, isLoading } = useFeatures()
  const { createStory, updateFeature } = useRoadmap()

  // Debug: Verificar features e histórias
  console.log('Features carregadas:', features)

  // Extrair todas as histórias de todas as features
  const allStories = features?.flatMap(feature => 
    (feature.stories || []).map(story => ({
      ...story,
      featureTitle: feature.title,
      featureId: feature.id
    }))
  ) || []

  // Debug: Verificar histórias extraídas
  console.log('Histórias extraídas:', allStories)

  // Filtrar histórias baseado na busca
  const filteredStories = allStories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.featureTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: UserStory['status']) => {
    switch (status) {
      case 'open': return 'bg-gray-500'
      case 'in-progress': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'blocked': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const handleAddStory = async (data: Partial<UserStory>) => {
    try {
      await createStory.mutateAsync({
        ...data,
        featureId: data.featureId!,
        title: data.title!,
        description: data.description!,
        acceptanceCriteria: data.acceptanceCriteria || [],
        status: data.status || 'open',
        points: data.points || 1,
        assignees: data.assignees || []
      })
      setIsAddStoryOpen(false)
    } catch (error) {
      console.error('Erro ao criar história:', error)
    }
  }

  const handleStatusChange = async (storyId: string, featureId: string, newStatus: UserStory['status']) => {
    try {
      const feature = features?.find(f => f.id === featureId)
      if (!feature) return

      const updatedStories = feature.stories?.map(story => 
        story.id === storyId 
          ? { ...story, status: newStatus }
          : story
      )

      await updateFeature.mutateAsync({
        ...feature,
        stories: updatedStories
      })

      toast.success('Status atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-[var(--color-background-primary)] border-b border-[var(--color-border)] z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Histórias de Usuário
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Gerencie todas as histórias de usuário do seu produto
            </p>
          </div>
          <Button
            onClick={() => setIsAddStoryOpen(true)}
            className="h-8 px-3 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs">Nova História</span>
          </Button>
        </div>

        {/* Filtros */}
        <div className="px-6 py-2 border-t border-[var(--color-border)] bg-[var(--color-background-elevated)]">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
            <Input
              placeholder="Buscar histórias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Lista de Histórias */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4">
          {filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <div
                key={story.id}
                className="p-4 bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-hover)] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(story.status)}`} />
                      <h3 className="font-medium text-[var(--color-text-primary)]">
                        {story.title}
                      </h3>
                      <Badge variant="secondary" className="ml-2">
                        {story.points} {story.points === 1 ? 'ponto' : 'pontos'}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Feature: {story.featureTitle}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(story.id, story.featureId, 'open')}
                        className="gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        <span>Aberta</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(story.id, story.featureId, 'in-progress')}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Em Progresso</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(story.id, story.featureId, 'completed')}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        <span>Concluída</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(story.id, story.featureId, 'blocked')}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Bloqueada</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 text-sm text-[var(--color-text-secondary)] space-y-1">
                  <p><strong>Como</strong> {story.description.asA}</p>
                  <p><strong>Eu quero</strong> {story.description.iWant}</p>
                  <p><strong>Para que</strong> {story.description.soThat}</p>
                </div>

                {story.acceptanceCriteria?.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                      Critérios de Aceitação
                    </h4>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      {story.acceptanceCriteria.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">
              <p>Nenhuma história encontrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialog de adicionar história */}
      <AddStoryDialog
        open={isAddStoryOpen}
        onOpenChange={setIsAddStoryOpen}
        onSubmit={handleAddStory}
        isSubmitting={createStory.isPending}
      />
    </div>
  )
} 