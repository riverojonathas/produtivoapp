'use client'

import { useState } from 'react'
import { AnimatedDialog } from '@/components/ui/animated-dialog'
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ProductStatus, productStatusConfig } from '@/types/product'
import { LucideIcon } from 'lucide-react'

interface ProductStatusDialogProps {
  productId: string
  currentStatus: ProductStatus
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductStatusDialog({
  productId,
  currentStatus,
  open,
  onOpenChange
}: ProductStatusDialogProps) {
  const { updateProduct } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdateStatus = async (status: ProductStatus) => {
    try {
      setIsSubmitting(true)
      await updateProduct.mutateAsync({
        id: productId,
        data: { status }
      })
      toast.success('Status atualizado com sucesso')
      onOpenChange(false)
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      toast.error(error.message || 'Erro ao atualizar status')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatedDialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen)
        }
      }}
      className="sm:max-w-[400px]"
    >
      <DialogHeader>
        <DialogTitle>Alterar Status</DialogTitle>
        <DialogDescription>
          Selecione o novo status do produto
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3 mt-4">
        {(Object.entries(productStatusConfig) as [ProductStatus, typeof productStatusConfig[keyof typeof productStatusConfig]][]).map(([status, config]) => {
          const Icon: LucideIcon = config.icon
          const isSelected = status === currentStatus

          return (
            <Button
              key={status}
              variant="outline"
              className={`
                relative flex items-center justify-start gap-3 p-4 h-auto
                ${isSelected ? `${config.bgColor} ${config.color} border-2` : ''}
              `}
              onClick={() => handleUpdateStatus(status)}
              disabled={isSubmitting || isSelected}
            >
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">{config.label}</span>
              </div>
              {isSelected && (
                <motion.div
                  layoutId="selected"
                  className="absolute inset-0 border-2 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Button>
          )
        })}
      </div>
    </AnimatedDialog>
  )
} 