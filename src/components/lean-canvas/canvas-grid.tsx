'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'
import { Canvas } from '@/types/canvas'
import { useCanvas } from '@/hooks/use-canvas'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
  Link as LinkIcon,
  Link2,
  Link2Off
} from 'lucide-react'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { useState } from 'react'
import { ProductSelector } from './product-selector'

interface CanvasGridProps {
  canvases: Canvas[]
  loading?: boolean
}

export function CanvasGrid({ canvases, loading }: CanvasGridProps) {
  const router = useRouter()
  const { deleteCanvas, updateCanvas, refresh } = useCanvas()
  const { products = [] } = useProducts()
  const [canvasToDelete, setCanvasToDelete] = useState<string | null>(null)

  // Função para vincular/desvincular produto
  const handleProductLink = async (canvasId: string, productId?: string) => {
    try {
      await updateCanvas(canvasId, { product_id: productId })
      toast.success(productId ? 'Produto vinculado com sucesso' : 'Produto desvinculado')
      refresh()
    } catch (error) {
      toast.error('Erro ao atualizar vínculo com produto')
    }
  }

  // Função para confirmar e excluir canvas
  const handleDelete = async (id: string) => {
    try {
      await deleteCanvas(id)
      toast.success('Canvas excluído com sucesso')
      setCanvasToDelete(null)
      refresh()
    } catch (error) {
      toast.error('Erro ao excluir canvas')
    }
  }

  // Estado vazio
  if (!loading && canvases.length === 0) {
    return (
      <Card className="w-full p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-[var(--color-background-subtle)] p-3">
            <FileText className="w-6 h-6 text-[var(--color-text-secondary)]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            Nenhum Canvas Criado
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-sm">
            Crie seu primeiro Lean Canvas para começar a modelar seu negócio de forma estruturada.
          </p>
          <Button onClick={() => router.push('/lean-canvas/new')} className="mt-4">
            Criar Primeiro Canvas
          </Button>
        </div>
      </Card>
    )
  }

  // Loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-[var(--color-background-subtle)] rounded w-3/4" />
              <div className="h-3 bg-[var(--color-background-subtle)] rounded w-1/2" />
              <div className="h-3 bg-[var(--color-background-subtle)] rounded w-1/4" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // Lista de canvas
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {canvases.map((canvas) => (
          <Card key={canvas.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{canvas.title}</h3>
                {canvas.description && (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {canvas.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <FileText className="w-3 h-3" />
                  {format(new Date(canvas.updated_at), "dd 'de' MMMM", { locale: ptBR })}
                  
                  {canvas.product_id && products.length > 0 && (
                    <>
                      <span>•</span>
                      <LinkIcon className="w-3 h-3" />
                      {products.find(p => p.id === canvas.product_id)?.title || 'Produto não encontrado'}
                    </>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-[var(--color-background-elevated)] border border-[var(--color-border)]"
                  sideOffset={5}
                >
                  <DropdownMenuItem 
                    className="hover:bg-[var(--color-background-subtle)] cursor-pointer"
                    onClick={() => router.push(`/lean-canvas/${canvas.id}`)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-[var(--color-border)]" />
                  
                  <ProductSelector
                    currentProductId={canvas.product_id}
                    onSelect={(productId) => handleProductLink(canvas.id, productId)}
                    trigger={
                      <DropdownMenuItem 
                        className="hover:bg-[var(--color-background-subtle)] cursor-pointer w-full"
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        Vincular a Produto
                      </DropdownMenuItem>
                    }
                  />

                  <DropdownMenuSeparator className="bg-[var(--color-border)]" />

                  <DropdownMenuItem 
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                    onClick={() => setCanvasToDelete(canvas.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!canvasToDelete} onOpenChange={() => setCanvasToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Canvas</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este canvas? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => canvasToDelete && handleDelete(canvasToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 