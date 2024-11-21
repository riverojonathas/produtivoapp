'use client'

import { Card } from "@/components/ui/card"
import { IFeature } from "@/types/feature"
import { DollarSign, TrendingUp, Users } from "lucide-react"

interface BusinessImpactProps {
  feature: IFeature
}

export function BusinessImpact({ feature }: BusinessImpactProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Impacto no Negócio</h3>
        
        {/* Métricas de ROI estimado */}
        {/* Impacto na retenção de usuários */}
        {/* Alinhamento com OKRs */}
        {/* etc */}
      </div>
    </Card>
  )
} 