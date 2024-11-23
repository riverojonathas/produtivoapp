'use client'

import { useState } from 'react'
import { AnimatedDialog } from '@/components/ui/animated-dialog'
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { IProductRisk, RiskCategory } from '@/types/product'
import { riskCategories } from '@/config/product-categories'
import { LucideIcon } from 'lucide-react'

interface ProductRiskDialogProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  risk?: IProductRisk
  initialCategory?: RiskCategory
}

export function ProductRiskDialog({
  productId,
  open,
  onOpenChange,
  risk,
  initialCategory
}: ProductRiskDialogProps) {
  const { addRisk, updateRisk } = useProducts()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<IProductRisk>>(
    risk || {
      category: initialCategory || 'value',
      description: '',
      mitigation: ''
    }
  )

  const selectedCategory = riskCategories.find(cat => cat.type === formData.category)
  const CategoryIcon = selectedCategory?.icon as LucideIcon | undefined

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.description?.trim()) {
      errors.push('Descrição é obrigatória')
    }
    if (!formData.mitigation?.trim()) {
      errors.push('Mitigação é obrigatória')
    }
    if (!formData.category) {
      errors.push('Categoria é obrigatória')
    }

    return errors
  }

  const handleSubmit = async () => {
    try {
      const errors = validateForm()
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error))
        return
      }

      setIsSubmitting(true)

      if (risk) {
        await updateRisk.mutateAsync({
          productId,
          riskId: risk.id,
          data: formData
        })
        toast.success('Risco atualizado com sucesso')
      } else {
        await addRisk.mutateAsync({
          productId,
          data: formData
        })
        toast.success('Risco adicionado com sucesso')
      }

      onOpenChange(false)
    } catch (error: any) {
      console.error('Erro ao salvar risco:', error)
      toast.error(error.message || 'Erro ao salvar risco')
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
          if (!newOpen) {
            setFormData(risk || {
              category: initialCategory || 'value',
              description: '',
              mitigation: ''
            })
          }
        }
      }}
      className="sm:max-w-[600px]"
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {CategoryIcon && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`p-1 rounded-lg ${selectedCategory?.color}`}
            >
              <CategoryIcon className="w-4 h-4" />
            </motion.div>
          )}
          {risk ? 'Editar Risco' : 'Adicionar Risco'}
        </DialogTitle>
        <DialogDescription>
          {risk 
            ? 'Atualize as informações do risco identificado'
            : 'Identifique um novo risco e sua estratégia de mitigação'
          }
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 mt-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <Select
            value={formData.category}
            onValueChange={(value: RiskCategory) => 
              setFormData(prev => ({ ...prev, category: value }))
            }
            disabled={!!risk || isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {riskCategories.map(category => {
                const Icon = category.icon as LucideIcon
                return (
                  <SelectItem 
                    key={category.type} 
                    value={category.type}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-lg ${category.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{category.title}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição do Risco</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva o risco identificado..."
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Estratégia de Mitigação</label>
          <Textarea
            value={formData.mitigation}
            onChange={(e) => setFormData(prev => ({ ...prev, mitigation: e.target.value }))}
            placeholder="Descreva como este risco será mitigado..."
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : risk ? 'Salvar' : 'Adicionar'}
          </Button>
        </div>
      </div>
    </AnimatedDialog>
  )
} 