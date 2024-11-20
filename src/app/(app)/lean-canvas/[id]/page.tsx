'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Canvas } from '@/types/canvas'
import { CanvasLayout } from '@/components/lean-canvas/canvas-layout'
import { ProductSelector } from '@/components/lean-canvas/product-selector'
import { use } from 'react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditCanvasPage({ params }: PageProps) {
  const router = useRouter()
  const id = use(params).id
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Canvas | null>(null)

  // Carregar dados do canvas
  const loadCanvas = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: canvasData, error } = await supabase
        .from('canvases')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      if (!canvasData) throw new Error('Canvas não encontrado')

      setData(canvasData)
    } catch (error) {
      console.error('Erro ao carregar canvas:', error)
      toast.error('Erro ao carregar canvas')
      router.push('/lean-canvas')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    loadCanvas()
  }, [loadCanvas])

  const handleSave = async () => {
    if (!data) return

    try {
      const { error } = await supabase
        .from('canvases')
        .update({
          title: data.title,
          product_id: data.product_id,
          sections: data.sections,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Canvas atualizado com sucesso')
      router.push('/lean-canvas')
    } catch (error) {
      console.error('Erro ao atualizar canvas:', error)
      toast.error('Erro ao atualizar canvas')
    }
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium">Lean Canvas</h1>
              <span className="text-xs text-[var(--color-text-secondary)]">
                Editando Canvas
              </span>
            </div>

            <Input
              value={data.title}
              onChange={(e) => setData(prev => prev ? { ...prev, title: e.target.value } : prev)}
              placeholder="Digite o título..."
              className="h-8 w-[200px]"
            />
          </div>

          <div className="h-4 w-px bg-[var(--color-border)]" />

          <ProductSelector
            currentProductId={data.product_id}
            onSelect={async (productId) => {
              setData(prev => prev ? { ...prev, product_id: productId } : prev)
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => router.push('/lean-canvas')}
          >
            <X className="w-3.5 h-3.5 mr-2" />
            Cancelar
          </Button>

          <Button
            size="sm"
            className="h-8"
            onClick={handleSave}
          >
            <Save className="w-3.5 h-3.5 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <CanvasLayout
        sections={data.sections}
        onSectionUpdate={(sectionId, content) => {
          setData(prev => {
            if (!prev) return prev
            return {
              ...prev,
              sections: {
                ...prev.sections,
                [sectionId]: content
              }
            }
          })
        }}
        isEditing={true}
      />
    </div>
  )
}