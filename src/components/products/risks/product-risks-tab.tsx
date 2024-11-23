'use client'

import { IProduct, IProductRisk, RiskCategory } from '@/types/product'
import { AnimatedList, AnimatedListItem } from '@/components/ui/animated-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  // ... outras categorias ...
]

export function ProductRisksTab({
  product,
  onAddRisk,
  onEditRisk,
  onRemoveRisk
}: ProductRisksTabProps) {
  return (
    <AnimatedList>
      <div className="grid grid-cols-2 gap-6">
        {riskCategories.map(category => {
          const risks = product.product_risks?.filter(
            risk => risk.category === category.type
          ) || []

          const Icon = category.icon

          return (
            <AnimatedListItem key={category.type}>
              <Card className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <Icon className={`w-4 h-4 ${category.color}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{category.title}</h3>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddRisk(category.type)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {risks.map(risk => (
                      <div 
                        key={risk.id}
                        className="p-4 bg-[var(--color-background-subtle)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm mb-2">{risk.description}</p>
                            <div className="flex items-start gap-2">
                              <Badge variant="secondary" className="text-[10px] shrink-0">
                                Mitigação
                              </Badge>
                              <p className="text-xs text-[var(--color-text-secondary)]">
                                {risk.mitigation}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => onEditRisk(risk)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              onClick={() => onRemoveRisk(risk)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {risks.length === 0 && (
                      <div className="text-center p-6 border-2 border-dashed border-[var(--color-border)] rounded-lg">
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          Nenhum risco identificado nesta categoria
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </AnimatedListItem>
          )
        })}
      </div>
    </AnimatedList>
  )
} 