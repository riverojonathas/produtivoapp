'use client'

import { IProduct, IProductRisk, RiskCategory } from '@/types/product'
import { AnimatedList, AnimatedListItem } from '@/components/ui/animated-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Target,
  Gauge,
  ShieldAlert,
  Building2,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react'

interface ProductRisksTabProps {
  product: IProduct
  onAddRisk: (category: RiskCategory) => void
  onEditRisk: (risk: IProductRisk) => void
  onRemoveRisk: (risk: IProductRisk) => void
}

const riskCategories = [
  {
    type: 'value' as RiskCategory,
    icon: Target,
    title: 'Riscos de Valor',
    description: 'Relacionados ao valor entregue ao usuário',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    type: 'usability' as RiskCategory,
    icon: Gauge,
    title: 'Riscos de Usabilidade',
    description: 'Relacionados à experiência do usuário',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10'
  },
  {
    type: 'feasibility' as RiskCategory,
    icon: ShieldAlert,
    title: 'Riscos de Viabilidade',
    description: 'Relacionados à implementação técnica',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  {
    type: 'business' as RiskCategory,
    icon: Building2,
    title: 'Riscos de Negócio',
    description: 'Relacionados ao modelo de negócio',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  }
]

export function ProductRisksTab({
  product,
  onAddRisk,
  onEditRisk,
  onRemoveRisk
}: ProductRisksTabProps) {
  return (
    <AnimatedList>
      {riskCategories.map(category => {
        const risks = product.product_risks?.filter(
          risk => risk.category === category.type
        ) || []

        const Icon = category.icon

        return (
          <AnimatedListItem key={category.type}>
            <Card className="overflow-hidden">
              {/* ... resto do conteúdo ... */}
            </Card>
          </AnimatedListItem>
        )
      })}
    </AnimatedList>
  )
} 