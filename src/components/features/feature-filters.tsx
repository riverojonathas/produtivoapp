'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Filter } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Fragment } from 'react'

interface FilterValue {
  status: string[]
  dateRange: string
  priority: string[]
  hasDescription: boolean | null
  hasStories: boolean | null
  product: string | null
}

interface FeatureFiltersProps {
  onFiltersChange: (filters: FilterValue) => void
  customFilters?: {
    type: 'multi-select' | 'boolean'
    label: string
    key: string
    options?: { label: string; value: string }[]
  }[]
}

export function FeatureFilters({ onFiltersChange, customFilters = [] }: FeatureFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<FilterValue>({
    status: [],
    dateRange: 'all',
    priority: [],
    hasDescription: null,
    hasStories: null,
    product: null
  })

  const handleFilterChange = (key: string, value: string | string[] | boolean | null) => {
    const newFilters = { ...activeFilters, [key]: value }
    setActiveFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const activeFiltersCount = Object.values(activeFilters).filter(value => 
    Array.isArray(value) ? value.length > 0 : value !== null && value !== 'all'
  ).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "h-8 border-dashed",
            activeFiltersCount > 0 && "border-[var(--color-primary)] border-solid"
          )}
        >
          <Filter className="w-3.5 h-3.5 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 bg-[var(--color-primary)] text-white"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem>Status</DropdownMenuItem>
        {['backlog', 'doing', 'done', 'blocked'].map(status => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={activeFilters.status.includes(status)}
            onCheckedChange={(checked: boolean) => {
              const newStatus = checked
                ? [...activeFilters.status, status]
                : activeFilters.status.filter((s: string) => s !== status)
              handleFilterChange('status', newStatus)
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </DropdownMenuCheckboxItem>
        ))}

        {/* Filtros customizados */}
        {customFilters.map(filter => (
          <Fragment key={filter.key}>
            <DropdownMenuItem>{filter.label}</DropdownMenuItem>
            {filter.type === 'multi-select' && filter.options?.map(option => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={(activeFilters[filter.key as keyof FilterValue] as string[])?.includes(option.value)}
                onCheckedChange={(checked: boolean) => {
                  const currentValues = activeFilters[filter.key as keyof FilterValue] as string[]
                  const newValue = checked
                    ? [...(currentValues || []), option.value]
                    : currentValues.filter(v => v !== option.value)
                  handleFilterChange(filter.key, newValue)
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
            {filter.type === 'boolean' && (
              <>
                <DropdownMenuCheckboxItem
                  checked={activeFilters[filter.key as keyof FilterValue] === true}
                  onCheckedChange={() => handleFilterChange(filter.key, true)}
                >
                  Sim
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters[filter.key as keyof FilterValue] === false}
                  onCheckedChange={() => handleFilterChange(filter.key, false)}
                >
                  Não
                </DropdownMenuCheckboxItem>
              </>
            )}
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 