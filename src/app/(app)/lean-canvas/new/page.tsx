'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCanvas } from '@/hooks/use-canvas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProducts } from '@/hooks/use-products'
import { CanvasLayout } from '@/components/lean-canvas/canvas-layout'
import { Save, X } from 'lucide-react'
import { toast } from 'sonner'

export default function NewCanvasPage() {
  const router = useRouter()
  const { createCanvas } = useCanvas()
  const { products } = useProducts()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    product_id: '',
    sections: {
      problem: [''],
      solution: [''],
      metrics: [''],
      proposition: [''],
      advantage: [''],
      channels: [''],
      segments: [''],
      costs: [''],
      revenue: ['']
    }
  })

  const handleSectionUpdate = (sectionId: string, content: string[]) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: content
      }
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Digite um título para o canvas')
      return
    }

    try {
      setIsSaving(true)
      const canvas = await createCanvas({
        title: formData.title.trim(),
        description: formData.description.trim(),
        product_id: formData.product_id || undefined,
        sections: formData.sections
      })

      if (canvas?.id) {
        toast.success('Canvas criado com sucesso!')
        router.push(`/lean-canvas/${canvas.id}`)
      }
    } catch (error) {
      toast.error('Erro ao criar canvas')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium">Lean Canvas</h1>
              <span className="text-xs text-[var(--color-text-secondary)]">
                Novo Canvas
              </span>
            </div>

            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título..."
              className="h-8 w-[200px]"
            />
          </div>

          <div className="h-4 w-px bg-[var(--color-border)]" />

          <div className="flex items-center gap-2">
            <Select
              value={formData.product_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
            >
              <SelectTrigger className="h-8 w-[200px]">
                <SelectValue placeholder="Selecionar produto..." />
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

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => router.back()}
          >
            <X className="w-3.5 h-3.5 mr-2" />
            Cancelar
          </Button>

          <Button
            size="sm"
            className="h-8"
            onClick={handleSave}
            disabled={isSaving || !formData.title.trim()}
          >
            <Save className="w-3.5 h-3.5 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <CanvasLayout
        sections={formData.sections}
        onSectionUpdate={handleSectionUpdate}
        isEditing={true}
      />
    </div>
  )
} 