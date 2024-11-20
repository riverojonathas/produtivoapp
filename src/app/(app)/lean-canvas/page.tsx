'use client'

import { useRouter } from 'next/navigation'
import { useCanvas } from '@/hooks/use-canvas'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CanvasGrid } from '@/components/lean-canvas/canvas-grid'

export default function LeanCanvasPage() {
  const router = useRouter()
  const { canvases, loading } = useCanvas()

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

        <Button onClick={() => router.push('/lean-canvas/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Canvas
        </Button>
      </div>

      {/* Lista de Canvas */}
      <CanvasGrid 
        canvases={canvases}
        loading={loading}
      />
    </div>
  )
} 