'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { IProduct } from '@/types/product'

interface Props {
  mode?: 'create' | 'edit'
  initialData?: IProduct
}

export default function NewProductPage({ mode = 'create', initialData }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const duplicateId = searchParams.get('duplicate')
  const { createProduct, updateProduct, products } = useProducts()
  const [currentStep, setCurrentStep] = useState<'basic' | 'vision' | 'metrics'>('basic')
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'development',
    vision: initialData?.vision || '',
    target_audience: initialData?.target_audience || '',
    product_metrics: initialData?.product_metrics || [],
    product_risks: initialData?.product_risks || [],
    tags: initialData?.tags || []
  })

  return (
    <div className="h-full flex flex-col -m-6">
      {/* Cabeçalho */}
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => router.push('/products')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
              {mode === 'create' ? 'Novo Produto' : 'Editar Produto'}
            </h1>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <form className="space-y-6">
            {/* Campos do formulário aqui */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Produto</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome do produto"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o produto brevemente"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/products')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
              >
                {mode === 'create' ? 'Criar Produto' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 