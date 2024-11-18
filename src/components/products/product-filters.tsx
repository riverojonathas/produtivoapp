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

interface Filters {
  status: string[]
  dateRange: string
  hasVision: boolean | null
  hasTeam: boolean | null
  hasRisks: boolean | null
  hasMetrics: boolean | null
}

interface ProductFiltersProps {
  onFiltersChange: (filters: Filters) => void
}

const statusOptions = [
  { value: 'active', label: 'Ativo', color: 'bg-emerald-500/8 text-emerald-600' },
  { value: 'development', label: 'Em desenvolvimento', color: 'bg-blue-500/8 text-blue-600' },
  { value: 'archived', label: 'Arquivado', color: 'bg-slate-500/8 text-slate-600' }
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
  const [filters, setFilters] = useState<Filters>({
    status: [],
    dateRange: 'all',
    hasVision: null,
    hasTeam: null,
    hasRisks: null,
    hasMetrics: null
  })

  const [open, setOpen] = useState(false)

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (Array.isArray(value) && value.length > 0) return count + 1
    if (typeof value === 'boolean' && value !== null) return count + 1
    if (key === 'dateRange' && value !== 'all') return count + 1
    return count
  }, 0)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 px-2.5 text-xs hover:text-[var(--color-text-primary)]",
            activeFiltersCount > 0 
              ? "text-[var(--color-primary)]" 
              : "text-[var(--color-text-secondary)]"
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-[var(--color-primary)] text-white"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-3 bg-[var(--color-background-elevated)] border border-[var(--color-border)] shadow-lg" 
        align="end"
        sideOffset={8}
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

          {/* Período */}
          <div>
            <h4 className="text-xs font-medium mb-2 text-[var(--color-text-secondary)]">Período</h4>
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
                    [option.key]: filters[option.key as keyof Filters] === true ? null : true 
                  })}
                  className={cn(
                    "inline-flex items-center px-2 py-1 rounded-md text-xs transition-colors",
                    filters[option.key as keyof Filters] === true
                      ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-background-subtle)]"
                  )}
                >
                  {filters[option.key as keyof Filters] === true && (
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