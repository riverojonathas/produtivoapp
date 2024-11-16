'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'

interface ComboboxProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  icon?: React.ReactNode
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Combobox({
  options = [],
  value,
  onChange,
  placeholder = 'Selecione uma opção...',
  emptyText = 'Nenhuma opção encontrada.',
  className,
  icon,
  disabled = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: ComboboxProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const commandRef = React.useRef<HTMLDivElement>(null)

  // Usar estado controlado se fornecido, caso contrário usar estado interno
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = setControlledOpen || setInternalOpen

  const selected = React.useMemo(() => 
    options?.find((option) => option?.value === value),
    [options, value]
  )

  const filteredOptions = React.useMemo(() => 
    options?.filter((option) => 
      option?.label?.toLowerCase().includes(searchValue.toLowerCase())
    ) || [],
    [options, searchValue]
  )

  const handleSelect = React.useCallback((selectedValue: string) => {
    const option = options.find(opt => opt.value === selectedValue)
    if (option) {
      onChange(option.value)
      setIsOpen(false)
      setSearchValue('')
      setHighlightedIndex(-1)
    }
  }, [onChange, options, setIsOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex].value)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSearchValue('')
        setHighlightedIndex(-1)
        break
    }
  }

  // Scroll o item destacado para a visualização
  React.useEffect(() => {
    if (highlightedIndex >= 0 && commandRef.current) {
      const highlightedElement = commandRef.current.querySelector(`[data-highlighted="true"]`)
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        })
      }
    }
  }, [highlightedIndex])

  return (
    <Popover 
      open={isOpen} 
      onOpenChange={(newOpen) => {
        setIsOpen(newOpen)
        if (!newOpen) {
          setSearchValue('')
          setHighlightedIndex(-1)
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn(
            "w-full justify-between bg-[var(--color-background-primary)] border-[var(--color-border)] text-[var(--color-text-primary)] relative",
            "hover:bg-[var(--color-background-secondary)]",
            icon && "pl-9",
            className
          )}
          disabled={disabled}
          onClick={() => setIsOpen(true)}
        >
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] z-10">
              {icon}
            </span>
          )}
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full min-w-[var(--radix-popover-trigger-width)] p-0 bg-[var(--color-background-primary)] border-[var(--color-border)] z-50"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <Command 
          ref={commandRef}
          shouldFilter={false}
          onKeyDown={handleKeyDown}
          className="max-h-[300px] overflow-auto"
        >
          <CommandInput 
            ref={inputRef}
            placeholder="Buscar..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="h-9 border-b border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)]"
          />
          <CommandEmpty className="py-2 text-[var(--color-text-secondary)]">
            {emptyText}
          </CommandEmpty>
          <CommandGroup>
            {filteredOptions.map((option, index) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={cn(
                  "px-3 py-2 text-[var(--color-text-primary)] cursor-pointer",
                  "hover:bg-[var(--color-background-secondary)]",
                  "data-[selected=true]:bg-[var(--color-primary-subtle)] data-[selected=true]:text-[var(--color-primary)]",
                  highlightedIndex === index && "bg-[var(--color-background-secondary)]"
                )}
                data-selected={value === option.value}
                data-highlighted={highlightedIndex === index}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 text-[var(--color-primary)]",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="flex-1">{option.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 