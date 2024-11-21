'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Feature } from "@/types/product"
import { BarChart3, Target } from "lucide-react"

interface FeatureComparisonProps {
  features: Feature[]
}

export function FeatureComparison({ features }: FeatureComparisonProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--color-primary)]" />
          Comparação de Features
        </h3>

        <div className="relative overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-[var(--color-text-secondary)] p-2">Feature</th>
                <th className="text-center text-xs font-medium text-[var(--color-text-secondary)] p-2">RICE Score</th>
                <th className="text-center text-xs font-medium text-[var(--color-text-secondary)] p-2">MoSCoW</th>
                <th className="text-center text-xs font-medium text-[var(--color-text-secondary)] p-2">Impacto</th>
                <th className="text-center text-xs font-medium text-[var(--color-text-secondary)] p-2">Esforço</th>
              </tr>
            </thead>
            <tbody>
              {features.map(feature => (
                <tr key={feature.id} className="border-t border-[var(--color-border)]">
                  <td className="p-2">{feature.title}</td>
                  <td className="text-center p-2">
                    <Badge variant="secondary">
                      {feature.rice_score?.toFixed(1) || '-'}
                    </Badge>
                  </td>
                  <td className="text-center p-2">
                    <Badge variant="secondary">
                      {feature.moscow_priority || '-'}
                    </Badge>
                  </td>
                  <td className="text-center p-2">{feature.rice_impact || '-'}</td>
                  <td className="text-center p-2">{feature.rice_effort || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
} 