'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { IProduct, IProductMetric } from '@/types/product'
import { Heart } from 'lucide-react'

interface ProductVisionDialogProps {
  product: IProduct
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductVisionDialog({
  product,
  open,
  onOpenChange
}: ProductVisionDialogProps) {
  const visionParts = product.vision?.split('\n') || []
  const targetAudience = visionParts[0]?.replace('Para ', '')
  const problem = visionParts[1]?.replace('Que ', '')
  const solution = visionParts[3]?.replace('Oferece ', '')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Visão do Produto
          </DialogTitle>
          <DialogDescription>
            Detalhes da visão e métricas do produto
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Framework de Visão */}
          <div className="space-y-4">
            {/* Para */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--color-primary)]">Para</span>
                <Badge variant="secondary" className="text-xs">Público-alvo</Badge>
              </div>
              <p className="text-sm p-3 bg-[var(--color-background-subtle)] rounded-lg">
                {targetAudience}
              </p>
            </div>

            {/* Que */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--color-primary)]">Que</span>
                <Badge variant="secondary" className="text-xs">Problema/Necessidade</Badge>
              </div>
              <p className="text-sm p-3 bg-[var(--color-background-subtle)] rounded-lg">
                {problem}
              </p>
            </div>

            {/* Nosso */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--color-primary)]">Nosso</span>
                <Badge variant="secondary" className="text-xs">Produto</Badge>
              </div>
              <p className="text-sm p-3 bg-[var(--color-background-subtle)] rounded-lg font-medium">
                {product.name}
              </p>
            </div>

            {/* Oferece */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--color-primary)]">Oferece</span>
                <Badge variant="secondary" className="text-xs">Solução</Badge>
              </div>
              <p className="text-sm p-3 bg-[var(--color-background-subtle)] rounded-lg">
                {solution}
              </p>
            </div>
          </div>

          {/* Métricas HEART */}
          {product.product_metrics?.some(m => m.type === 'heart') && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold">Métricas HEART</h3>
                <Badge variant="secondary" className="text-xs">Framework de Métricas de UX</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {product.product_metrics
                  .filter(metric => metric.type === 'heart')
                  .map((metric, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-[var(--color-background-subtle)] rounded-lg"
                    >
                      <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                        {metric.name}
                      </div>
                      <div className="text-sm">
                        {metric.value}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 