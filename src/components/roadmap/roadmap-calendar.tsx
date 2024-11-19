'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Feature {
  id: string
  title: string
  description: string
  status: string
  startDate?: Date
  dueDate?: Date
}

interface RoadmapCalendarProps {
  features: Feature[]
}

export function RoadmapCalendar({ features }: RoadmapCalendarProps) {
  return (
    <div className="space-y-4">
      {features
        .filter(f => f.startDate && f.dueDate)
        .map(feature => (
          <Card key={feature.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">{feature.title}</h3>
              <div className="text-xs text-[var(--color-text-secondary)]">
                {feature.startDate && format(new Date(feature.startDate), "dd MMM", { locale: ptBR })} 
                {' - '}
                {feature.dueDate && format(new Date(feature.dueDate), "dd MMM", { locale: ptBR })}
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {feature.description}
            </p>
          </Card>
        ))}
    </div>
  )
} 