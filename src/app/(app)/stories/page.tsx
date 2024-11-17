'use client'

import { useState } from 'react'
import { useFeatures } from '@/hooks/use-features'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  PlayCircle, 
  XCircle,
  Users,
  ListChecks
} from 'lucide-react'
import { AddStoryDialog } from '@/components/features/add-story-dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRoadmap } from '@/hooks/use-roadmap'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Story {
  id: string
  title: string
  description: {
    asA: string
    iWant: string
    soThat: string
  }
  status: 'open' | 'in-progress' | 'completed' | 'blocked'
  points: number
  acceptance_criteria: string[]
  assignees: string[]
  featureTitle?: string
  featureId?: string
}

type StoryStatus = Story['status']
type ViewMode = 'grid' | 'list'

export default function StoriesPage() {
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StoryStatus | 'all'>('all')
  const { features, isLoading } = useFeatures()
  const { createStory } = useRoadmap()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Extrair todas as histórias
  const allStories = features?.flatMap(feature => 
    (feature.stories || []).map(story => ({
      ...story,
      featureTitle: feature.title,
      featureId: feature.id
    }))
  ) || []

  // Filtrar histórias
  const filteredStories = allStories.filter(story => {
    const matchesSearch = 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.featureTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleAddStory = async (data: Partial<Story>) => {
    setIsSubmitting(true)
    try {
      if (!data.featureId) {
        throw new Error('Feature ID é obrigatório')
      }

      await createStory.mutateAsync({
        feature_id: data.featureId,
        title: data.title || '',
        description: data.description || {
          asA: '',
          iWant: '',
          soThat: ''
        },
        acceptance_criteria: data.acceptance_criteria || [],
        status: data.status || 'open',
        points: data.points || 1,
        assignees: data.assignees || []
      })

      toast.success('História criada com sucesso!')
      setIsAddStoryOpen(false)
    } catch (error) {
      console.error('Erro ao criar história:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao criar história')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: StoryStatus) => {
    switch (status) {
      case 'open':
        return <Clock className="w-4 h-4" />
      case 'in-progress':
        return <PlayCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'blocked':
        return <XCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: StoryStatus) => {
    switch (status) {
      case 'open':
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800'
      case 'in-progress':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900'
      case 'completed':
        return 'text-green-500 bg-green-100 dark:bg-green-900'
      case 'blocked':
        return 'text-red-500 bg-red-100 dark:bg-red-900'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Histórias de Usuário
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gerencie as histórias de usuário do seu produto
          </p>
        </div>
        <Button
          onClick={() => setIsAddStoryOpen(true)}
          className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova História
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar histórias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value: StoryStatus | 'all') => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="open">Em Aberto</SelectItem>
            <SelectItem value="in-progress">Em Progresso</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="blocked">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Histórias */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 h-[200px]">
              <div className="h-full" />
            </Card>
          ))}
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-[var(--color-background-elevated)] rounded-full flex items-center justify-center mb-4">
            <ListChecks className="w-8 h-8 text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
            Nenhuma história encontrada
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {searchTerm 
              ? 'Tente buscar com outros termos'
              : 'Comece criando sua primeira história de usuário'}
          </p>
          <Button
            onClick={() => setIsAddStoryOpen(true)}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar História
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <Card key={story.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge 
                    variant="secondary"
                    className={cn("mb-2", getStatusColor(story.status))}
                  >
                    <span className="flex items-center gap-1.5">
                      {getStatusIcon(story.status)}
                      {story.status === 'open' && 'Em Aberto'}
                      {story.status === 'in-progress' && 'Em Progresso'}
                      {story.status === 'completed' && 'Concluído'}
                      {story.status === 'blocked' && 'Bloqueado'}
                    </span>
                  </Badge>
                  <h3 className="font-medium text-[var(--color-text-primary)]">
                    {story.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                    {story.featureTitle}
                  </p>
                </div>
                {story.points && (
                  <Badge variant="outline" className="shrink-0">
                    {story.points} pts
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                {story.description && (
                  <div className="text-sm">
                    <p><strong>Como</strong> {story.description.asA}</p>
                    <p><strong>Eu quero</strong> {story.description.iWant}</p>
                    <p><strong>Para que</strong> {story.description.soThat}</p>
                  </div>
                )}

                {story.acceptance_criteria?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                      Critérios de Aceitação
                    </h4>
                    <ul className="text-sm space-y-1">
                      {story.acceptance_criteria.map((criteria, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-4 h-4 mt-0.5 shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-[var(--color-text-secondary)]" />
                          </div>
                          <span className="text-[var(--color-text-secondary)]">
                            {criteria}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {story.assignees?.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]">
                    <Users className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      {story.assignees.length} designado(s)
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de adicionar história */}
      <AddStoryDialog
        open={isAddStoryOpen}
        onOpenChange={setIsAddStoryOpen}
        onSubmit={handleAddStory}
        isSubmitting={isSubmitting}
      />
    </div>
  )
} 