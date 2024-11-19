'use client'

import React from 'react'
import { Card } from '@/components/ui/card'

interface Feature {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignees: string[]
  startDate?: Date
  dueDate?: Date
  dependencies: string[]
  tags: string[]
}

interface RoadmapKanbanProps {
  features: Feature[]
}

export function RoadmapKanban({ features }: RoadmapKanbanProps) {
  const columns = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'doing', title: 'Em Progresso' },
    { id: 'done', title: 'Concluído' },
    { id: 'blocked', title: 'Bloqueado' }
  ]

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {columns.map(column => (
        <div key={column.id} className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">{column.title}</h3>
            <span className="text-xs text-[var(--color-text-secondary)]">
              {features.filter(f => f.status === column.id).length}
            </span>
          </div>
          <div className="flex-1 space-y-2">
            {features
              .filter(feature => feature.status === column.id)
              .map(feature => (
                <Card key={feature.id} className="p-3">
                  <h4 className="text-sm font-medium mb-1">{feature.title}</h4>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {feature.description}
                  </p>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
} 