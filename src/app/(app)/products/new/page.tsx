'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { IProduct } from '@/types/product'

export default function NewProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')
  const mode = productId ? 'edit' : 'create'
  
  const { createProduct, updateProduct, products } = useProducts()
  const existingProduct = productId ? products.find(p => p.id === productId) : undefined

  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: existingProduct?.name || '',
    description: existingProduct?.description || '',
    status: existingProduct?.status || 'development',
    vision: existingProduct?.vision || '',
    target_audience: existingProduct?.target_audience || '',
    product_metrics: existingProduct?.product_metrics || [],
    product_risks: existingProduct?.product_risks || [],
    tags: existingProduct?.tags || []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (mode === 'edit' && productId) {
        await updateProduct(productId, formData)
        toast.success('Produto atualizado com sucesso!')
      } else {
        await createProduct(formData)
        toast.success('Produto criado com sucesso!')
      }
      router.push('/products')
    } catch (error) {
      toast.error('Erro ao salvar o produto')
      console.error(error)
    }
  }

  return (
    <div className="h-full flex flex-col -m-6">
      <div className="bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
        <div className="h-14 px-4 flex items-center justify-between">
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

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Produto</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Digite o nome do produto"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o produto brevemente"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Visão do Produto</label>
                <Textarea
                  value={formData.vision}
                  onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
                  placeholder="Descreva a visão do produto"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Público-alvo</label>
                <Textarea
                  value={formData.target_audience}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                  placeholder="Descreva o público-alvo do produto"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
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