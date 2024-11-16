'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Feature, UserStory } from '@/types/product'
import { UserStoryForm } from './user-story-form'
import { UserStoryList } from './user-story-list'
import { useRoadmap } from '@/hooks/use-roadmap'

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

      // Adicionar a nova história à feature
      await updateFeature.mutateAsync({
        ...feature,
        stories: [...feature.stories, newStory]
      })

      setIsAddingStory(false)
    } catch (error) {
      console.error('Erro ao adicionar história:', error)
      throw error
    }
  }

  const handleUpdateStory = async (data: Partial<UserStory>) => {
    try {
      const updatedStories = feature.stories.map(story => 
        story.id === selectedStory?.id 
          ? { ...story, ...data, updatedAt: new Date() }
          : story
      )

      await updateFeature.mutateAsync({
        ...feature,
        stories: updatedStories
      })

      setSelectedStory(null)
    } catch (error) {
      console.error('Erro ao atualizar história:', error)
      throw error
    }
  }

  const handleStoryStatusChange = async (id: string, status: UserStory['status']) => {
    try {
      const updatedStories = feature.stories.map(story => 
        story.id === id 
          ? { ...story, status, updatedAt: new Date() }
          : story
      )

      await updateFeature.mutateAsync({
        ...feature,
        stories: updatedStories
      })
    } catch (error) {
      console.error('Erro ao atualizar status da história:', error)
    }
  }

  const handleStoryDelete = async (id: string) => {
    try {
      await updateFeature.mutateAsync({
        ...feature,
        stories: feature.stories.filter(story => story.id !== id)
      })
    } catch (error) {
      console.error('Erro ao excluir história:', error)
    }
  }

  // Calcular progresso baseado nas histórias
  const calculateProgress = () => {
    if (feature.stories.length === 0) return 0
    const completedStories = feature.stories.filter(story => story.status === 'completed')
    return Math.round((completedStories.length / feature.stories.length) * 100)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Histórias de Usuário</h2>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Feature: {feature.title}
              </p>
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">
              Progresso: {calculateProgress()}%
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Lista de Histórias */}
          {feature.stories.length > 0 && (
            <UserStoryList
              stories={feature.stories}
              onStoryClick={setSelectedStory}
              onStoryStatusChange={handleStoryStatusChange}
              onStoryDelete={handleStoryDelete}
            />
          )}

          {/* Formulário de Nova História */}
          {isAddingStory ? (
            <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-background-elevated)]">
              <h3 className="text-sm font-medium mb-4">Nova História</h3>
              <UserStoryForm
                featureId={feature.id}
                onSubmit={handleAddStory}
                isSubmitting={updateFeature.isPending}
              />
            </div>
          ) : selectedStory ? (
            <div className="border border-[var(--color-border)] rounded-lg p-4 bg-[var(--color-background-elevated)]">
              <h3 className="text-sm font-medium mb-4">Editar História</h3>
              <UserStoryForm
                value={selectedStory}
                featureId={feature.id}
                onSubmit={handleUpdateStory}
                isSubmitting={updateFeature.isPending}
              />
            </div>
          ) : (
            <Button
              onClick={() => setIsAddingStory(true)}
              className="w-full bg-[var(--color-background-elevated)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar História
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 