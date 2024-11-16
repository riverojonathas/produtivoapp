'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { Combobox } from './combobox'

interface ProfileFieldProps {
  icon: React.ReactNode
  label: string
  value: string
  placeholder?: string
  type?: 'text' | 'select'
  options?: { value: string; label: string }[]
  required?: boolean
  onChange?: (value: string) => void
  disabled?: boolean
}

export function ProfileField({
  icon,
  label,
  value,
  placeholder = 'Não informado',
  type = 'text',
  options = [],
  required,
  onChange,
  disabled
}: ProfileFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  if (type === 'select' && options.length > 0) {
    const selectedOption = options.find(opt => opt.value === value)
    
    return (
      <div 
        className={cn(
          "flex items-center justify-between px-4 py-3 transition-colors cursor-pointer",
          isOpen ? "bg-[var(--color-background-secondary)]" : "hover:bg-[var(--color-background-secondary)]"
        )}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-3">
          <div className="text-[var(--color-text-secondary)]">
            {icon}
          </div>
          <span className="text-sm text-[var(--color-text-primary)]">
            {label}
            {required && <span className="text-[var(--color-primary)]">*</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Combobox
            value={value}
            onChange={(newValue) => {
              onChange?.(newValue)
              setIsOpen(false)
            }}
            options={options}
            placeholder={placeholder}
            open={isOpen}
            onOpenChange={setIsOpen}
          />
          <ChevronRight className={cn(
            "w-4 h-4 text-[var(--color-text-secondary)] transition-transform duration-200",
            isOpen && "transform rotate-90"
          )} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-background-secondary)] transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-[var(--color-text-secondary)]">
          {icon}
        </div>
        <span className="text-sm text-[var(--color-text-primary)]">
          {label}
          {required && <span className="text-[var(--color-primary)]">*</span>}
        </span>
      </div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "text-sm text-right bg-transparent focus:outline-none",
          disabled ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-primary)]",
          isFocused && "ring-2 ring-[var(--color-primary)] rounded px-2"
        )}
      />
    </div>
  )
} 