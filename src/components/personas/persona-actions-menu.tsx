'use client'

import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  Copy, 
  Files
} from "lucide-react"
import { usePersonas } from "@/hooks/use-personas"
import { toast } from "sonner"

interface Persona {
  id: string
  name: string
}

interface PersonaActionsMenuProps {
  persona: Persona
}

export function PersonaActionsMenu({ persona }: PersonaActionsMenuProps) {
  const router = useRouter()
  const { deletePersona } = usePersonas()

  const handleDelete = async () => {
    try {
      await deletePersona.mutateAsync(persona.id)
      toast.success('Persona excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir persona:', error)
      toast.error('Erro ao excluir persona')
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/personas/${persona.id}`
    navigator.clipboard.writeText(url)
    toast.success('Link copiado para a área de transferência')
  }

  const handleDuplicate = () => {
    router.push(`/personas/new?duplicate=${persona.id}`)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={handleMenuClick}>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] persona-actions-menu"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-[var(--color-background-elevated)] border-[var(--color-border)]"
        onClick={handleMenuClick}
      >
        {/* Ações Principais */}
        <DropdownMenuItem 
          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
          onClick={() => router.push(`/personas/${persona.id}/edit`)}
        >
          <Pencil className="w-4 h-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
          onClick={() => router.push(`/personas/${persona.id}`)}
        >
          <Eye className="w-4 h-4" />
          Ver detalhes
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Ações Secundárias */}
        <DropdownMenuItem 
          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
          onClick={handleCopyLink}
        >
          <Copy className="w-4 h-4" />
          Copiar link
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)] text-[var(--color-text-primary)]"
          onClick={handleDuplicate}
        >
          <Files className="w-4 h-4" />
          Duplicar persona
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Ação de Excluir */}
        <DropdownMenuItem 
          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-500 focus:text-red-500 dark:hover:bg-red-950 dark:focus:bg-red-950"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 