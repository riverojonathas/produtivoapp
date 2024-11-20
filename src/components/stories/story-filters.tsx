'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { STORY_STATUS } from '@/types/story'

interface StoryFilters {
  status: string[]
  points: number[]
  dateRange: string
  features: string[]
  hasAcceptanceCriteria: boolean | null
}

interface StoryFiltersProps {
  onFiltersChange: (filters: StoryFilters) => void
  features: Array<{ id: string; title: string }>
}

export function StoryFilters({ onFiltersChange, features }: StoryFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<StoryFilters>({
    status: [],
    points: [],
    dateRange: 'all',
    features: [],
    hasAcceptanceCriteria: null
  })

  const [activeCount, setActiveCount] = useState(0)

  const handleFilterChange = (key: keyof StoryFilters, value: any) => {
    const newFilters = { ...activeFilters, [key]: value }
    setActiveFilters(newFilters)
    
    // Contar filtros ativos
    let count = 0
    if (newFilters.status.length > 0) count++
    if (newFilters.points.length > 0) count++
    if (newFilters.dateRange !== 'all') count++
    if (newFilters.features.length > 0) count++
    if (newFilters.hasAcceptanceCriteria !== null) count++
    setActiveCount(count)

    onFiltersChange(newFilters)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Filter className="w-3.5 h-3.5 mr-2" />
          Filtros
          {activeCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 bg-[var(--color-primary)] text-white"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        {/* Status */}
        <div className="p-2">
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="space-y-2">
            {Object.entries(STORY_STATUS).map(([key, status]) => (
              <div
                key={key}
                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-elevated)] p-1 rounded"
                onClick={() => {
                  const newStatus = activeFilters.status.includes(key)
                    ? activeFilters.status.filter(s => s !== key)
                    : [...activeFilters.status, key]
                  handleFilterChange('status', newStatus)
                }}
              >
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center",
                  activeFilters.status.includes(key)
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                    : "border-[var(--color-border)]"
                )}>
                  {activeFilters.status.includes(key) && (
                    <status.icon className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{status.label}</span>
              </div>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Story Points */}
        <div className="p-2">
          <h4 className="text-sm font-medium mb-2">Story Points</h4>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 5, 8, 13].map(points => (
              <Badge
                key={points}
                variant="secondary"
                className={cn(
                  "cursor-pointer",
                  activeFilters.points.includes(points)
                    ? "bg-[var(--color-primary)] text-white"
                    : "hover:bg-[var(--color-background-elevated)]"
                )}
                onClick={() => {
                  const newPoints = activeFilters.points.includes(points)
                    ? activeFilters.points.filter(p => p !== points)
                    : [...activeFilters.points, points]
                  handleFilterChange('points', newPoints)
                }}
              >
                {points}
              </Badge>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Features */}
        <div className="p-2">
          <h4 className="text-sm font-medium mb-2">Features</h4>
          <div className="max-h-[200px] overflow-y-auto space-y-2">
            {features.map(feature => (
              <div
                key={feature.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-elevated)] p-1 rounded"
                onClick={() => {
                  const newFeatures = activeFilters.features.includes(feature.id)
                    ? activeFilters.features.filter(f => f !== feature.id)
                    : [...activeFilters.features, feature.id]
                  handleFilterChange('features', newFeatures)
                }}
              >
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center",
                  activeFilters.features.includes(feature.id)
                    ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                    : "border-[var(--color-border)]"
                )}>
                  {activeFilters.features.includes(feature.id) && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3 text-white"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="text-sm truncate">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Data Range */}
        <div className="p-2">
          <h4 className="text-sm font-medium mb-2">Período</h4>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Todas' },
              { value: '7', label: 'Últimos 7 dias' },
              { value: '30', label: 'Últimos 30 dias' },
              { value: '90', label: 'Últimos 90 dias' }
            ].map(option => (
              <div
                key={option.value}
                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-elevated)] p-1 rounded"
                onClick={() => handleFilterChange('dateRange', option.value)}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center",
                  activeFilters.dateRange === option.value
                    ? "border-[var(--color-primary)]"
                    : "border-[var(--color-border)]"
                )}>
                  {activeFilters.dateRange === option.value && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                  )}
                </div>
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Critérios de Aceitação */}
        <div className="p-2">
          <h4 className="text-sm font-medium mb-2">Critérios de Aceitação</h4>
          <div className="space-y-2">
            {[
              { value: true, label: 'Com critérios' },
              { value: false, label: 'Sem critérios' }
            ].map(option => (
              <div
                key={String(option.value)}
                className="flex items-center gap-2 cursor-pointer hover:bg-[var(--color-background-elevated)] p-1 rounded"
                onClick={() => handleFilterChange(
                  'hasAcceptanceCriteria',
                  activeFilters.hasAcceptanceCriteria === option.value ? null : option.value
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center",
                  activeFilters.hasAcceptanceCriteria === option.value
                    ? "border-[var(--color-primary)]"
                    : "border-[var(--color-border)]"
                )}>
                  {activeFilters.hasAcceptanceCriteria === option.value && (
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                  )}
                </div>
                <span className="text-sm">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Limpar Filtros */}
        <DropdownMenuItem
          className="text-[var(--color-danger)]"
          onClick={() => {
            setActiveFilters({
              status: [],
              points: [],
              dateRange: 'all',
              features: [],
              hasAcceptanceCriteria: null
            })
            setActiveCount(0)
            onFiltersChange({
              status: [],
              points: [],
              dateRange: 'all',
              features: [],
              hasAcceptanceCriteria: null
            })
          }}
        >
          Limpar Filtros
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 