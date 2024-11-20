'use client'

import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface FeatureFiltersProps {
  onFiltersChange: (filters: any) => void
  customFilters?: Array<{
    type: 'multi-select' | 'boolean'
    label: string
    key: string
    options?: Array<{ label: string; value: string }>
  }>
}

export function FeatureFilters({ onFiltersChange, customFilters = [] }: FeatureFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
    status: [],
    dateRange: 'all',
    priority: [],
    hasDescription: null,
    hasStories: null,
    product: null
  })

  const handleFilterChange = (key: string, value: any) => {
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
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {['backlog', 'doing', 'done', 'blocked'].map(status => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={activeFilters.status.includes(status)}
            onCheckedChange={(checked) => {
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
          <React.Fragment key={filter.key}>
            <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filter.type === 'multi-select' && filter.options?.map(option => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={activeFilters[filter.key]?.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...(activeFilters[filter.key] || []), option.value]
                    : activeFilters[filter.key].filter((v: string) => v !== option.value)
                  handleFilterChange(filter.key, newValue)
                }}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
            {filter.type === 'boolean' && (
              <>
                <DropdownMenuCheckboxItem
                  checked={activeFilters[filter.key] === true}
                  onCheckedChange={() => handleFilterChange(filter.key, true)}
                >
                  Sim
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={activeFilters[filter.key] === false}
                  onCheckedChange={() => handleFilterChange(filter.key, false)}
                >
                  Não
                </DropdownMenuCheckboxItem>
              </>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 