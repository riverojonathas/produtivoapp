'use client'

import { useRouter } from 'next/navigation'
import { useFeatures } from '@/hooks/use-features'
import { toast } from 'sonner'
import NewFeaturePage from '../../new/page'
import { use } from 'react'
import { useEffect } from 'react'
import { IFeature } from '@/types/feature'

interface EditFeaturePageProps {
  params: Promise<{ id: string }>
}

interface NewFeaturePageProps {
  mode?: 'create' | 'edit'
  initialData?: IFeature
}

const NewFeaturePageWithProps: React.FC<NewFeaturePageProps> = NewFeaturePage

export default function EditFeaturePage({ params }: EditFeaturePageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { feature, isLoading } = useFeatures(resolvedParams.id)

  useEffect(() => {
    if (!isLoading && !feature) {
      toast.error('Feature não encontrada')
      router.push('/features')
    }
  }, [isLoading, feature, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  if (!feature) {
    return null
  }

  return <NewFeaturePageWithProps mode="edit" initialData={feature} />
} 