'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Files,
  MoreHorizontal,
  ListChecks
} from 'lucide-react'
import { useStoryTemplates } from '@/hooks/use-story-templates'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IStoryTemplate } from '@/types/story-template'

export default function StoryTemplatesPage() {
  const router = useRouter()
  const { templates = [], isLoading, deleteTemplate } = useStoryTemplates()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.asA.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.iWant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.soThat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate.mutateAsync(id)
      toast.success('Template excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir template:', error)
      toast.error('Erro ao excluir template')
    }
  }

  const renderTemplateCard = (template: IStoryTemplate) => (
    <Card
      key={template.id}
      className="group p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{template.title}</h3>
              {template.category && (
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              )}
            </div>
            <div className="mt-2 space-y-1 text-xs text-[var(--color-text-secondary)]">
              <p>Como {template.description.asA},</p>
              <p>Eu quero {template.description.iWant},</p>
              <p>Para que {template.description.soThat}</p>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => router.push(`/stories/templates/${template.id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/stories/new?template=${template.id}`)}
                >
                  <Files className="w-3.5 h-3.5 mr-2" />
                  Usar Template
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/stories/templates/new?duplicate=${template.id}`)}
                >
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Métricas */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {template.defaultPoints} {template.defaultPoints === 1 ? 'ponto' : 'pontos'}
            </Badge>
            {template.suggestedCriteria?.length > 0 && (
              <div className="flex items-center gap-1">
                <ListChecks className="w-3.5 h-3.5" />
                <span>{template.suggestedCriteria.length} critérios</span>
              </div>
            )}
          </div>
          <span>
            {format(new Date(template.created_at), "dd MMM, yy", { locale: ptBR })}
          </span>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
                Templates de História
              </h1>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {templates.length}
              </span>
            </div>

            <Button 
              size="sm"
              className="h-8 w-8 p-0 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
              onClick={() => router.push('/stories/templates/new')}
              title="Novo Template"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Lado Direito */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              <Input
                placeholder="Buscar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm bg-[var(--color-background-elevated)] border-[var(--color-border)] w-[200px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Templates */}
      <div className="flex-1 p-6 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[var(--color-text-secondary)]">Carregando...</div>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-sm text-[var(--color-text-secondary)]">
              {searchTerm ? 'Nenhum template encontrado' : 'Nenhum template cadastrado'}
            </div>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece criando um novo template'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(renderTemplateCard)}
          </div>
        )}
      </div>
    </div>
  )
} 