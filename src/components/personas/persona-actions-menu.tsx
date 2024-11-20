'use client'

import { useRouter } from 'next/navigation'
import { usePersonas } from '@/hooks/use-personas'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

interface PersonaActionsMenuProps {
  persona: {
    id: string
  }
}

export function PersonaActionsMenu({ persona }: PersonaActionsMenuProps) {
  const router = useRouter()
  const { deletePersona } = usePersonas()

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta persona?')) return

    try {
      await deletePersona.mutateAsync(persona.id)
      toast.success('Persona excluída com sucesso')
    } catch (error) {
      toast.error('Erro ao excluir persona')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-[var(--color-background-elevated)] border border-[var(--color-border)]"
      >
        <DropdownMenuItem 
          className="hover:bg-[var(--color-background-subtle)] cursor-pointer"
          onClick={() => router.push(`/personas/${persona.id}`)}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[var(--color-border)]" />

        <DropdownMenuItem 
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 