'use client'

import { useRouter } from 'next/navigation'
import { useFeatures } from '@/hooks/use-features'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Edit,
  Users,
  Target,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Trash2,
  Files,
  ListChecks,
  Clock,
  GitBranch,
  X,
  ProductAvatar
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { use, useEffect } from 'react'
import { UserStoriesDialog } from '@/components/features/user-stories-dialog'
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { IFeature, IUserStory } from '@/types/feature'
import { Avatar } from '@/components/ui/avatar'
import { AddDependencyDialog } from '@/components/features/add-dependency-dialog'
import { FeatureStatusSelect } from '@/components/features/feature-status-select'

interface FeaturePageProps {
  params: Promise<{ id: string }>
}

export default function FeaturePage({ params }: FeaturePageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { feature, isLoading, deleteFeature, updateFeature } = useFeatures(resolvedParams.id)
  const [showStoriesDialog, setShowStoriesDialog] = useState(false)
  const [showDependencyDialog, setShowDependencyDialog] = useState(false)

  useEffect(() => {
    if (!isLoading && !feature) {
      toast.error('Feature não encontrada')
      router.push('/features')
    }
  }, [isLoading, feature, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  if (!feature) {
    return null
  }

  const handleDelete = async () => {
    try {
      await deleteFeature.mutateAsync(feature.id)
      toast.success('Feature excluída com sucesso')
      router.push('/features')
    } catch (error) {
      console.error('Erro ao excluir feature:', error)
      toast.error('Erro ao excluir feature')
    }
  }

  const handleDuplicate = () => {
    router.push(`/features/new?duplicate=${feature.id}`)
  }

  // Métricas rápidas
  const items = [
    {
      icon: Users,
      label: 'Responsáveis',
      value: feature.assignees?.length || 0,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8 dark:bg-violet-500/10'
    },
    {
      icon: ListChecks,
      label: 'Histórias',
      value: feature.stories?.length || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10'
    },
    {
      icon: Clock,
      label: 'Dias em Desenvolvimento',
      value: feature.start_date ? Math.ceil((new Date().getTime() - new Date(feature.start_date).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/8 dark:bg-amber-500/10'
    }
  ]

  // Adicionar esta função helper
  const groupStoriesByStatus = (stories: IUserStory[] = []) => {
    const groups = stories.reduce((acc, story) => {
      const status = story.status
      if (!acc[status]) acc[status] = []
      acc[status].push(story)
      return acc
    }, {} as Record<string, IUserStory[]>)

    // Definir ordem de exibição dos status
    const statusOrder = ['doing', 'blocked', 'backlog', 'done']
    
    return Object.entries(groups)
      .sort(([a], [b]) => statusOrder.indexOf(a) - statusOrder.indexOf(b))
  }

  const handleAddDependency = async (dependentFeature: IFeature) => {
    try {
      // Atualizar a feature atual com a nova dependência
      await updateFeature.mutateAsync({
        id: feature.id,
        data: {
          dependencies: [
            ...(feature.dependencies || []),
            {
              id: dependentFeature.id,
              title: dependentFeature.title,
              status: dependentFeature.status
            }
          ]
        }
      })
      toast.success('Dependência adicionada com sucesso')
    } catch (error) {
      console.error('Erro ao adicionar dependência:', error)
      toast.error('Erro ao adicionar dependência')
    }
  }

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
                onClick={() => router.push('/features')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div className="space-y-1">
                <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                  {feature.title}
                </h1>
                <div className="flex items-center gap-2">
                  <FeatureStatusSelect
                    status={feature.status}
                    onStatusChange={async (newStatus) => {
                      await updateFeature.mutateAsync({
                        id: feature.id,
                        data: { status: newStatus }
                      })
                      toast.success('Status atualizado com sucesso')
                    }}
                    size="sm"
                  />
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Criada em {format(new Date(feature.created_at), "dd MMM, yy", { locale: ptBR })}
                  </span>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="h-4 w-px bg-[var(--color-border)]" />

            {/* Métricas Rápidas */}
            <div className="flex items-center gap-4">
              {items.map((item, index) => (
                <TooltipProvider key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
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
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      <p className="text-xs font-medium">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Lado Direito - Ações */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStoriesDialog(true)}
              className="h-8"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Histórias
            </Button>

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
              onClick={() => router.push(`/features/${feature.id}/edit`)}
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
                    <Lightbulb className="w-4 h-4 text-[var(--color-primary)]" />
                    Descrição da Feature
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    O que é?
                  </h3>
                  <p className="text-sm">
                    {feature.description?.what || 'Sem descrição'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Por quê?
                  </h3>
                  <p className="text-sm">
                    {feature.description?.why || 'Sem descrição'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Para quem?
                  </h3>
                  <p className="text-sm">
                    {feature.description?.who || 'Sem descrição'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Histórias */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-base font-medium flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                    Histórias de Usuário
                  </h2>
                  {feature.stories?.length > 0 && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                      {feature.stories.length} {feature.stories.length === 1 ? 'história' : 'histórias'}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStoriesDialog(true)}
                >
                  Gerenciar Histórias
                </Button>
              </div>

              {feature.stories && feature.stories.length > 0 ? (
                <div className="space-y-6">
                  {groupStoriesByStatus(feature.stories).map(([status, stories]) => (
                    <div key={status} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={cn(
                          "text-xs",
                          status === 'done' && "bg-emerald-100 text-emerald-700",
                          status === 'doing' && "bg-blue-100 text-blue-700",
                          status === 'blocked' && "bg-red-100 text-red-700",
                          status === 'backlog' && "bg-gray-100 text-gray-700"
                        )}>
                          {status}
                        </Badge>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          {stories.length} {stories.length === 1 ? 'história' : 'histórias'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {stories.map((story) => (
                          <div
                            key={story.id}
                            className="p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-elevated)] transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {story.points} pontos
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setShowStoriesDialog(true)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <p className="text-sm">{story.title}</p>
                            {story.description && (
                              <div className="mt-2 text-xs text-[var(--color-text-secondary)]">
                                <p>Como {story.description.asA},</p>
                                <p>Eu quero {story.description.iWant},</p>
                                <p>Para que {story.description.soThat}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Nenhuma história cadastrada
                </p>
              )}
            </Card>
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
                  <span className="text-sm">Prioridade</span>
                  <Badge variant="secondary" className={cn(
                    "text-xs",
                    feature.priority === 'high' && "bg-red-100 text-red-700",
                    feature.priority === 'medium' && "bg-yellow-100 text-yellow-700",
                    feature.priority === 'low' && "bg-green-100 text-green-700"
                  )}>
                    {feature.priority}
                  </Badge>
                </div>

                {feature.start_date && (
                  <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg">
                    <span className="text-sm">Data de Início</span>
                    <span className="text-sm">
                      {format(new Date(feature.start_date), "dd MMM, yy", { locale: ptBR })}
                    </span>
                  </div>
                )}

                {feature.end_date && (
                  <div className="flex items-center justify-between p-3 bg-[var(--color-background-subtle)] rounded-lg">
                    <span className="text-sm">Data de Término</span>
                    <span className="text-sm">
                      {format(new Date(feature.end_date), "dd MMM, yy", { locale: ptBR })}
                    </span>
                  </div>
                )}

                {feature.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progresso</span>
                      <span>{feature.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--color-primary)] transition-all duration-300"
                        style={{ width: `${feature.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Nova seção de Dependências */}
            <Card className="p-6">
              <h2 className="text-base font-medium mb-6 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[var(--color-primary)]" />
                Dependências
              </h2>

              <div className="space-y-6">
                {/* Features Dependentes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Depende de
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDependencyDialog(true)}
                      className="h-7 text-xs"
                    >
                      Adicionar
                    </Button>
                  </div>
                  
                  {feature.dependencies?.length > 0 ? (
                    <div className="space-y-2">
                      {feature.dependencies.map(dep => (
                        <div
                          key={dep.id}
                          className="p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-elevated)] transition-colors cursor-pointer"
                          onClick={() => router.push(`/features/${dep.id}`)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={cn(
                                "text-xs",
                                dep.status === 'done' && "bg-emerald-100 text-emerald-700",
                                dep.status === 'doing' && "bg-blue-100 text-blue-700",
                                dep.status === 'blocked' && "bg-red-100 text-red-700",
                                dep.status === 'backlog' && "bg-gray-100 text-gray-700"
                              )}>
                                {dep.status}
                              </Badge>
                              <span className="text-sm">{dep.title}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                /* Implementar remoção de dependência */
                              }}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Nenhuma dependência definida
                    </p>
                  )}
                </div>

                {/* Features que Dependem Desta */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Features que dependem desta
                  </h3>
                  
                  {feature.dependent_features?.length > 0 ? (
                    <div className="space-y-2">
                      {feature.dependent_features.map(dep => (
                        <div
                          key={dep.id}
                          className="p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-elevated)] transition-colors cursor-pointer"
                          onClick={() => router.push(`/features/${dep.id}`)}
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={cn(
                              "text-xs",
                              dep.status === 'done' && "bg-emerald-100 text-emerald-700",
                              dep.status === 'doing' && "bg-blue-100 text-blue-700",
                              dep.status === 'blocked' && "bg-red-100 text-red-700",
                              dep.status === 'backlog' && "bg-gray-100 text-gray-700"
                            )}>
                              {dep.status}
                            </Badge>
                            <span className="text-sm">{dep.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Nenhuma feature depende desta
                    </p>
                  )}
                </div>

                {/* Relacionamentos com Produtos */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Produtos Relacionados
                  </h3>
                  
                  {feature.related_products?.length > 0 ? (
                    <div className="space-y-2">
                      {feature.related_products.map(product => (
                        <div
                          key={product.id}
                          className="p-3 bg-[var(--color-background-subtle)] rounded-lg hover:bg-[var(--color-background-elevated)] transition-colors cursor-pointer"
                          onClick={() => router.push(`/products/${product.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              className="w-6 h-6 rounded-lg border border-[var(--color-border)]"
                              src={product.avatar_url}
                            >
                              {product.name.substring(0, 2).toUpperCase()}
                            </Avatar>
                            <span className="text-sm">{product.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Nenhum produto relacionado
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog de Histórias */}
      <UserStoriesDialog
        open={showStoriesDialog}
        onOpenChange={setShowStoriesDialog}
        feature={feature}
      />

      <AddDependencyDialog
        open={showDependencyDialog}
        onOpenChange={setShowDependencyDialog}
        currentFeatureId={feature.id}
        onSelect={handleAddDependency}
      />
    </div>
  )
} 