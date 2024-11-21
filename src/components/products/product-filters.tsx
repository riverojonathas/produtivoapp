'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ProductStatus } from '@/types/product'

// Interface para os filtros
export interface ProductFilters {
  status: ProductStatus[]
  dateRange: string
  hasVision: boolean | null
  hasTeam: boolean | null
  hasRisks: boolean | null
  hasMetrics: boolean | null
}

interface ProductFiltersProps {
  onFiltersChange: (filters: ProductFilters) => void
}

const statusOptions = [
  { value: 'active' as ProductStatus, label: 'Ativo', color: 'bg-emerald-500/8 text-emerald-600' },
  { value: 'development' as ProductStatus, label: 'Em desenvolvimento', color: 'bg-blue-500/8 text-blue-600' },
  { value: 'archived' as ProductStatus, label: 'Arquivado', color: 'bg-slate-500/8 text-slate-600' }
]

const dateRangeOptions = [
  { value: '7', label: 'Últimos 7 dias' },
  { value: '30', label: 'Últimos 30 dias' },
  { value: '90', label: 'Últimos 90 dias' },
  { value: 'all', label: 'Todo período' }
]

const characteristicOptions = [
  { key: 'hasVision', label: 'Com visão definida' },
  { key: 'hasTeam', label: 'Com time atribuído' },
  { key: 'hasRisks', label: 'Com riscos' },
  { key: 'hasMetrics', label: 'Com métricas' }
]

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    status: [],
    dateRange: 'all',
    hasVision: null,
    hasTeam: null,
    hasRisks: null,
    hasMetrics: null
  })

  const [open, setOpen] = useState(false)

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const activeFiltersCount = [
    filters.status.length > 0,
    filters.dateRange !== 'all',
    filters.hasVision !== null,
    filters.hasTeam !== null,
    filters.hasRisks !== null,
    filters.hasMetrics !== null
  ].filter(Boolean).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
        >
          <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 px-1.5 bg-[var(--color-primary)] text-white"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[280px] p-4" 
        align="start"
      >
        <div className="space-y-4">
          {/* Status */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-[var(--color-text-secondary)]">Status</h4>
            <div className="flex flex-wrap gap-1">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    const newStatus = filters.status.includes(option.value)
                      ? filters.status.filter(s => s !== option.value)
                      : [...filters.status, option.value]
                    handleFilterChange({ status: newStatus })
                  }}
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md text-xs transition-colors",
                    filters.status.includes(option.value)
                      ? option.color
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-subtle)]"
                  )}
                >
                  {filters.status.includes(option.value) && (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-[var(--color-text-secondary)]">Data</h4>
            <div className="flex flex-wrap gap-1">
              {dateRangeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange({ dateRange: option.value })}
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md text-xs transition-colors",
                    filters.dateRange === option.value
                      ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-subtle)]"
                  )}
                >
                  {filters.dateRange === option.value && (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Características */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-[var(--color-text-secondary)]">Características</h4>
            <div className="flex flex-wrap gap-1">
              {characteristicOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => handleFilterChange({ 
                    [option.key]: filters[option.key as keyof ProductFilters] === true ? null : true 
                  })}
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md text-xs transition-colors",
                    filters[option.key as keyof ProductFilters] === true
                      ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-subtle)]"
                  )}
                >
                  {filters[option.key as keyof ProductFilters] === true && (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ações */}
          {activeFiltersCount > 0 && (
            <div className="pt-3 border-t border-[var(--color-border)]">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  setFilters({
                    status: [],
                    dateRange: 'all',
                    hasVision: null,
                    hasTeam: null,
                    hasRisks: null,
                    hasMetrics: null
                  })
                  setOpen(false)
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
} 