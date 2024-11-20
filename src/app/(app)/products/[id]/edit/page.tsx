'use client'

import { useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/use-products'
import { toast } from 'sonner'
import NewProductPage from '../../new/page'
import { use } from 'react'
import { useEffect } from 'react'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { product, isLoading } = useProducts(resolvedParams.id)

  useEffect(() => {
    if (!isLoading && !product) {
      toast.error('Produto não encontrado')
      router.push('/products')
    }
  }, [isLoading, product, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return <NewProductPage mode="edit" initialData={product} />
} 