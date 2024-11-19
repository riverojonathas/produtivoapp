'use client'

import React from 'react'
import { Card } from '@/components/ui/card'

interface Feature {
  id: string
  title: string
  description: string
  status: string
  startDate?: Date
  dueDate?: Date
}

interface RoadmapGanttProps {
  features: Feature[]
}

export function RoadmapGantt({ features }: RoadmapGanttProps) {
  return (
    <div className="space-y-4">
      {features
        .filter(f => f.startDate && f.dueDate)
        .map(feature => (
          <Card key={feature.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-48">
                <h3 className="text-sm font-medium">{feature.title}</h3>
              </div>
              <div className="flex-1 relative h-6 bg-[var(--color-background-subtle)] rounded">
                {/* Barra de progresso */}
                <div 
                  className="absolute h-full bg-blue-500/20 rounded"
                  style={{
                    left: '0%',
                    width: '50%' // Calcular baseado nas datas
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
    </div>
  )
} 