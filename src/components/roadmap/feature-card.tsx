'use client'

import { useState } from 'react'
import { Feature } from '@/types/product'
import { cn } from '@/lib/utils'
import { MoreHorizontal, ChevronDown, ChevronUp, ListTodo } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { UserStoriesDialog } from '@/components/features/user-stories-dialog'

interface FeatureCardProps {
  feature: Feature
  onClick?: () => void
  onStatusChange?: (id: string, status: Feature['status']) => void
  onDelete?: (id: string) => Promise<void>
}

export function FeatureCard({ feature, onClick, onStatusChange, onDelete }: FeatureCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showStoriesDialog, setShowStoriesDialog] = useState(false)

  // Calcular progresso baseado nas histórias
  const calculateProgress = () => {
    if (feature.stories.length === 0) return 0
    const completedStories = feature.stories.filter(story => story.status === 'completed')
    return Math.round((completedStories.length / feature.stories.length) * 100)
  }

  const handleStatusChange = async (newStatus: Feature['status']) => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      await onStatusChange?.(feature.id, newStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (isUpdating) return
    setIsUpdating(true)
    try {
      await onDelete?.(feature.id)
      setShowDeleteAlert(false)
    } finally {
      setIsUpdating(false)
    }
  }

  const statusColors = {
    'backlog': 'bg-gray-500',
    'planned': 'bg-blue-500',
    'in-progress': 'bg-yellow-500',
    'completed': 'bg-green-500',
    'blocked': 'bg-red-500'
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="group relative bg-[var(--color-background-elevated)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-all duration-200 shadow-sm hover:shadow-md">
        {/* Card Principal */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            {/* Indicador de Status */}
            <div className={cn("w-1.5 h-1.5 rounded-full", statusColors[feature.status])} />
            
            {/* Título */}
            <h3 className="flex-1 text-xs font-medium text-[var(--color-text-primary)] truncate cursor-pointer" onClick={() => onClick?.()}>
              {feature.title}
            </h3>

            {/* Ações Rápidas */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Botão de Histórias */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowStoriesDialog(true)}
                  >
                    <ListTodo className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span className="whitespace-nowrap">Gerenciar histórias</span>
                </TooltipContent>
              </Tooltip>

              {/* Botão de Expandir */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-6 w-6 p-0",
                      isExpanded && "bg-[var(--color-background-secondary)]"
                    )}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span className="whitespace-nowrap">
                    {isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                  </span>
                </TooltipContent>
              </Tooltip>

              {/* Menu de Ações */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={isUpdating}
                      >
                        <MoreHorizontal className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <span className="whitespace-nowrap">Mais ações</span>
                  </TooltipContent>
                </Tooltip>
                
                <DropdownMenuContent 
                  align="end"
                  className="w-48 py-1 px-1 bg-[var(--color-background-elevated)] border border-[var(--color-border)]"
                >
                  <DropdownMenuItem 
                    onClick={() => onClick?.()}
                    className="text-xs py-1.5 px-2 cursor-pointer"
                  >
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange('planned')}
                    className="text-xs py-1.5 px-2 cursor-pointer"
                  >
                    Marcar como Planejado
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange('in-progress')}
                    className="text-xs py-1.5 px-2 cursor-pointer"
                  >
                    Marcar como Em Progresso
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange('completed')}
                    className="text-xs py-1.5 px-2 cursor-pointer"
                  >
                    Marcar como Concluído
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleStatusChange('blocked')}
                    className="text-xs py-1.5 px-2 cursor-pointer"
                  >
                    Marcar como Bloqueado
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteAlert(true)}
                    className="text-xs py-1.5 px-2 cursor-pointer text-red-500 hover:text-red-600"
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-2 h-1 bg-[var(--color-background-secondary)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--color-primary)] transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>

          {/* Contador de Histórias */}
          <div className="mt-1 flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)]">
            <span>{feature.stories.filter(s => s.status === 'completed').length}</span>
            <span>/</span>
            <span>{feature.stories.length}</span>
            <span>histórias concluídas</span>
          </div>
        </div>

        {/* Detalhes Expandidos */}
        {isExpanded && (
          <div className="px-3 pb-2 pt-1 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
            <p className="line-clamp-2">{feature.description.what}</p>
          </div>
        )}
      </div>

      {/* Diálogo de Histórias */}
      <UserStoriesDialog
        open={showStoriesDialog}
        onOpenChange={setShowStoriesDialog}
        feature={feature}
      />

      {/* Diálogo de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Feature</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta feature? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isUpdating}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  )
} 