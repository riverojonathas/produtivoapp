'use client'

import { useRouter } from 'next/navigation'
import { useStories } from '@/hooks/use-stories'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Edit,
  Files,
  Trash2,
  ListChecks,
  Target,
  BookOpen
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { use } from 'react'
import { cn } from "@/lib/utils"
import { StoryStatusSelect } from '@/components/stories/story-status-select'
import { StoryTimeTracking } from '@/components/stories/story-time-tracking'

interface StoryPageProps {
  params: Promise<{ id: string }>
}

export default function StoryPage({ params }: StoryPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { story, isLoading, deleteStory, updateStory } = useStories(resolvedParams.id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  if (!story) {
    return null
  }

  const handleDelete = async () => {
    try {
      await deleteStory.mutateAsync(story.id)
      toast.success('História excluída com sucesso')
      router.push('/stories')
    } catch (error) {
      console.error('Erro ao excluir história:', error)
      toast.error('Erro ao excluir história')
    }
  }

  const handleDuplicate = () => {
    router.push(`/stories/new?duplicate=${story.id}`)
  }

  // Métricas rápidas
  const items = [
    {
      icon: ListChecks,
      label: 'Story Points',
      value: story.points,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8 dark:bg-violet-500/10'
    },
    {
      icon: Target,
      label: 'Critérios de Aceitação',
      value: story.acceptance_criteria?.length || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10'
    }
  ]

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-6">
            {/* Navegação e Identificação */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => router.push('/stories')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div className="space-y-1">
                <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                  {story.title}
                </h1>
                <div className="flex items-center gap-2">
                  <StoryStatusSelect
                    status={story.status}
                    onStatusChange={async (newStatus) => {
                      await updateStory.mutateAsync({
                        id: story.id,
                        data: { status: newStatus }
                      })
                      toast.success('Status atualizado com sucesso')
                    }}
                    size="sm"
                  />
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Criada em {format(new Date(story.created_at), "dd MMM, yy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="h-4 w-px bg-[var(--color-border)]" />

            {/* Métricas Rápidas */}
            <div className="flex items-center gap-4">
              {items.map((item, index) => (
                <div 
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2",
                    index !== items.length - 1 && "border-r border-[var(--color-border)] pr-4"
                  )}
                >
                  <div className={cn("p-1 rounded", item.bgColor)}>
                    <item.icon className={cn("w-3 h-3", item.color)} />
                  </div>
                  <p className="text-sm font-medium">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito - Ações */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDuplicate}
              className="h-8"
            >
              <Files className="w-4 h-4 mr-2" />
              Duplicar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/stories/${story.id}/edit`)}
              className="h-8"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-3 gap-6">
          {/* Coluna Principal - 2/3 */}
          <div className="col-span-2 space-y-6">
            {/* Descrição */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-base font-medium flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                    História de Usuário
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Como...
                  </h3>
                  <p className="text-sm">
                    {story.description.asA}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Eu quero...
                  </h3>
                  <p className="text-sm">
                    {story.description.iWant}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Para que...
                  </h3>
                  <p className="text-sm">
                    {story.description.soThat}
                  </p>
                </div>
              </div>
            </Card>

            {/* Critérios de Aceitação */}
            {story.acceptance_criteria && story.acceptance_criteria.length > 0 && (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-base font-medium flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-[var(--color-primary)]" />
                      Critérios de Aceitação
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {story.acceptance_criteria.map((criteria, index) => (
                    <div
                      key={index}
                      className="p-3 bg-[var(--color-background-subtle)] rounded-lg"
                    >
                      <p className="text-sm">{criteria}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-6">
            {/* Informações */}
            <Card className="p-6">
              <h2 className="text-base font-medium mb-6 flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--color-primary)]" />
                Informações
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <span className="text-sm">Story Points</span>
                  <Badge variant="secondary">
                    {story.points} {story.points === 1 ? 'ponto' : 'pontos'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg">
                  <span className="text-sm">Status</span>
                  <StoryStatusSelect
                    status={story.status}
                    onStatusChange={async (newStatus) => {
                      await updateStory.mutateAsync({
                        id: story.id,
                        data: { status: newStatus }
                      })
                      toast.success('Status atualizado com sucesso')
                    }}
                    size="sm"
                  />
                </div>
              </div>
            </Card>

            {/* Controle de Tempo */}
            <StoryTimeTracking
              story={story}
              onUpdate={async (data) => {
                await updateStory.mutateAsync({
                  id: story.id,
                  data
                })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 