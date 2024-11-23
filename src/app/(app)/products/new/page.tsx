'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import { PageContainer, PageHeader, PageContent } from '@/components/layout/page-container'
import { ProductStatus } from '@/types/product'

export default function NewProductPage() {
  const router = useRouter()
  const { createProduct } = useProducts()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!name.trim()) {
        toast.error('Nome do produto é obrigatório')
        return
      }

      setIsSubmitting(true)

      const product = await createProduct.mutateAsync({
        name: name.trim(),
        status: 'development' as const
      })

      toast.success('Produto criado com sucesso!')
      router.push(`/products/${product.id}`)
    } catch (error: any) {
      console.error('Erro ao criar produto:', error)
      toast.error(error.message || 'Erro ao criar produto')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => router.push('/products')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-sm font-medium">Novo Produto</h1>
        </div>
      </PageHeader>

      <PageContent>
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nome do produto
              </label>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do produto"
                className="text-lg"
                disabled={isSubmitting}
              />
              <p className="text-sm text-[var(--color-text-secondary)]">
                Você poderá adicionar mais informações depois de criar o produto.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Criando...' : 'Criar e Configurar'}
            </Button>
          </form>
        </div>
      </PageContent>
    </PageContainer>
  )
}