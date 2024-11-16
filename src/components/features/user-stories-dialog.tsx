'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Feature, UserStory } from '@/types/product'
import { useRoadmap } from '@/hooks/use-roadmap'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddStoryDialog } from './add-story-dialog'

interface UserStoriesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: Feature
}

export function UserStoriesDialog({
  open,
  onOpenChange,
  feature
}: UserStoriesDialogProps) {
  const [isAddingStory, setIsAddingStory] = useState(false)
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null)
  const { updateFeature } = useRoadmap()

  // Calcular progresso baseado nas histórias
  const calculateProgress = () => {
    try {
      if (!feature.stories || !Array.isArray(feature.stories) || feature.stories.length === 0) return 0
      
      const completedStories = feature.stories.filter(story => story.status === 'completed')
      return Math.round((completedStories.length / feature.stories.length) * 100)
    } catch (error) {
      console.error('Erro ao calcular progresso:', error)
      return 0
    }
  }

  const handleAddStory = async (data: Partial<UserStory>) => {
    try {
      const newStory: UserStory = {
        id: crypto.randomUUID(),
        featureId: feature.id,
        title: data.title!,
        description: data.description!,
        acceptanceCriteria: data.acceptanceCriteria || [],
        status: data.status || 'open',
        points: data.points || 1,
        assignees: data.assignees || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await updateFeature.mutateAsync({
        ...feature,
        stories: [...(feature.stories || []), newStory]
      })

      toast.success('História adicionada com sucesso!')
      setIsAddingStory(false)
    } catch (error) {
      console.error('Erro ao adicionar história:', error)
      toast.error('Erro ao adicionar história')
    }
  }

  const handleStoryStatusChange = async (id: string, status: UserStory['status']) => {
    try {
      if (!feature.stories) return

      const updatedStories = feature.stories.map(story => 
        story.id === id 
          ? { ...story, status, updatedAt: new Date() }
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

  const handleStoryDelete = async (id: string) => {
    try {
      if (!feature.stories) return

      await updateFeature.mutateAsync({
        ...feature,
        stories: feature.stories.filter(story => story.id !== id)
      })

      toast.success('História excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir história:', error)
      toast.error('Erro ao excluir história')
    }
  }

  const getStatusColor = (status: UserStory['status']) => {
    switch (status) {
      case 'open': return 'bg-gray-500'
      case 'in-progress': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'blocked': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Histórias de Usuário</DialogTitle>
          <DialogDescription>
            Gerencie as histórias de usuário desta feature
          </DialogDescription>
        </DialogHeader>

        {/* Cabeçalho com Progresso */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Progresso
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">
                  {calculateProgress()}%
                </span>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {feature.stories?.filter(s => s.status === 'completed').length || 0}/
                  {feature.stories?.length || 0} histórias concluídas
                </span>
              </div>
            </div>
          </div>

          <Button onClick={() => setIsAddingStory(true)}>
            Nova História
          </Button>
        </div>

        {/* Lista de Histórias */}
        <div className="space-y-4">
          {feature.stories?.map(story => (
            <div
              key={story.id}
              className="p-4 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-hover)] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(story.status)}`} />
                    <h3 className="font-medium">{story.title}</h3>
                    <Badge variant="secondary" className="ml-2">
                      {story.points} {story.points === 1 ? 'ponto' : 'pontos'}
                    </Badge>
                  </div>

                  <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedStory(story)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStoryDelete(story.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Excluir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {/* Dialog de adicionar história */}
        <AddStoryDialog
          open={isAddingStory}
          onOpenChange={setIsAddingStory}
          onSubmit={handleAddStory}
          isSubmitting={false}
        />
      </DialogContent>
    </Dialog>
  )
} 