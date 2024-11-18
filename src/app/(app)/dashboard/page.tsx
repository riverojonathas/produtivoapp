'use client'

import { useProducts } from '@/hooks/use-products'
import { useFeatures } from '@/hooks/use-features'
import { usePersonas } from '@/hooks/use-personas'
import { Card } from '@/components/ui/card'
import { LayoutGrid, Target, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const { products, isLoading: isLoadingProducts } = useProducts()
  const { features, isLoading: isLoadingFeatures } = useFeatures()
  const { personas, isLoading: isLoadingPersonas } = usePersonas()

  const items = [
    {
      icon: LayoutGrid,
      label: 'Produtos',
      value: products?.length || 0,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/8 dark:bg-violet-500/10',
      href: '/products'
    },
    {
      icon: Target,
      label: 'Features',
      value: features?.length || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/8 dark:bg-blue-500/10',
      href: '/features'
    },
    {
      icon: Users,
      label: 'Personas',
      value: personas?.length || 0,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/8 dark:bg-emerald-500/10',
      href: '/personas'
    }
  ]

  if (isLoadingProducts || isLoadingFeatures || isLoadingPersonas) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--color-text-secondary)]">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {items.map((item) => (
        <Card 
          key={item.label} 
          className="p-6 cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => router.push(item.href)}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {item.label}
              </p>
              <p className="text-2xl font-semibold mt-1">
                {item.value}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
} 