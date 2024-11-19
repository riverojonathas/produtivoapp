'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCanvas } from '@/hooks/use-canvas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreVertical,
  FileText,
  Pencil,
  Trash2,
  Link as LinkIcon
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useProducts } from '@/hooks/use-products'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CanvasFormData {
  title: string
  description?: string
  product_id?: string
}

export default function CanvasListPage() {
  const router = useRouter()
  const { canvases, loading, createCanvas, deleteCanvas } = useCanvas()
  const { products } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewDialog, setShowNewDialog] = useState(false)
  const [formData, setFormData] = useState<CanvasFormData>({
    title: '',
    description: '',
    product_id: undefined
  })

  // Filtrar canvas
  const filteredCanvases = canvases.filter(canvas => 
    canvas.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    canvas.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Criar novo canvas
  const handleCreate = async () => {
    const canvas = await createCanvas({
      ...formData,
      sections: {
        problem: [],
        solution: [],
        metrics: [],
        proposition: [],
        advantage: [],
        channels: [],
        segments: [],
        costs: [],
        revenue: []
      }
    })

    if (canvas) {
      setShowNewDialog(false)
      router.push(`/lean-canvas/${canvas.id}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lean Canvas</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Gerencie seus modelos de negócio
          </p>
        </div>

        <Button onClick={() => setShowNewDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Canvas
        </Button>
      </div>

      {/* Barra de Ferramentas */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            placeholder="Buscar canvas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Lista de Canvas */}
      <div className="grid grid-cols-3 gap-4">
        {filteredCanvases.map(canvas => (
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
                  
                  {canvas.product_id && (
                    <>
                      <span>•</span>
                      <LinkIcon className="w-3 h-3" />
                      {products.find(p => p.id === canvas.product_id)?.title}
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push(`/lean-canvas/${canvas.id}`)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => deleteCanvas(canvas.id)}
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

      {/* Dialog de Novo Canvas */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Canvas</DialogTitle>
            <DialogDescription>
              Crie um novo Lean Canvas para seu produto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Canvas do Produto X"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Uma breve descrição do canvas"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Produto (opcional)</label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={!formData.title}>
              Criar Canvas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 