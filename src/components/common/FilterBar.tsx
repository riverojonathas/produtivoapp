'use client';

import { useState } from 'react';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface FilterOption {
  id: string;
  label: string;
  options: string[];
}

interface FilterBarProps {
  filters: FilterOption[];
  onFilterChange: (filters: Record<string, string[]>) => void;
  onSearch?: (term: string) => void;
  placeholder?: string;
}

export function FilterBar({ 
  filters, 
  onFilterChange, 
  onSearch,
  placeholder = 'Buscar...'
}: FilterBarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleFilterChange = (filterId: string, value: string) => {
    setActiveFilters(prev => {
      const current = prev[filterId] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      const newFilters = {
        ...prev,
        [filterId]: updated
      };

      if (newFilters[filterId].length === 0) {
        delete newFilters[filterId];
      }

      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange({});
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((acc, curr) => acc + curr.length, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl
              border transition-colors duration-200
              ${showFilters 
                ? 'bg-[var(--color-accent-light)] border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'bg-[var(--color-background-tertiary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }
            `}
          >
            <FunnelIcon className="w-5 h-5" />
            <span>Filtros</span>
            {getActiveFilterCount() > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-[var(--color-primary)] text-white">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-72 bg-[var(--color-background-elevated)] rounded-xl border border-[var(--color-border)] shadow-lg z-50 animate-fade-in">
              <div className="p-4 space-y-4">
                {filters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setSelectedFilter(selectedFilter === filter.id ? null : filter.id)}
                    >
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">
                        {filter.label}
                      </span>
                      <ChevronDownIcon 
                        className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform duration-200 ${
                          selectedFilter === filter.id ? 'transform rotate-180' : ''
                        }`}
                      />
                    </div>
                    
                    {selectedFilter === filter.id && (
                      <div className="pl-2 space-y-1 animate-slide-down">
                        {filter.options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 py-1 cursor-pointer group"
                          >
                            <div className={`
                              w-4 h-4 rounded border flex items-center justify-center
                              transition-colors duration-200
                              ${(activeFilters[filter.id] || []).includes(option)
                                ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                                : 'border-[var(--color-border)] group-hover:border-[var(--color-primary)]'
                              }
                            `}>
                              {(activeFilters[filter.id] || []).includes(option) && (
                                <CheckIcon className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {getActiveFilterCount() > 0 && (
                <div className="p-3 border-t border-[var(--color-border)]">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 