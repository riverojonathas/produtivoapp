'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { FEATURE_PRIORITY, FeaturePriority } from '@/types/feature'
import { toast } from 'sonner'

interface FeaturePrioritySelectProps {
  priority?: FeaturePriority
  onPriorityChange: (priority: FeaturePriority) => Promise<void>
  size?: 'sm' | 'default'
  disabled?: boolean
}

export function FeaturePrioritySelect({ 
  priority = 'medium',
  onPriorityChange,
  size = 'default',
  disabled = false
}: FeaturePrioritySelectProps) {
  const [isPending, setIsPending] = useState(false)
  const currentPriority = FEATURE_PRIORITY[priority]

  const handlePriorityChange = async (newPriority: FeaturePriority) => {
    try {
      setIsPending(true)
      await onPriorityChange(newPriority)
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error)
      toast.error('Erro ao atualizar prioridade')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          className="px-2 h-7"
          disabled={disabled || isPending}
        >
          <Badge variant="secondary" className={cn(
            "text-xs font-normal",
            currentPriority.color
          )}>
            {currentPriority.label}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[180px] bg-[var(--color-background-primary)] border border-[var(--color-border)]"
      >
        {Object.entries(FEATURE_PRIORITY).map(([key, priority]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handlePriorityChange(key as FeaturePriority)}
            className="flex items-center gap-2 hover:bg-[var(--color-background-elevated)] focus:bg-[var(--color-background-elevated)] cursor-pointer"
          >
            <Badge variant="secondary" className={cn(
              "text-xs font-normal",
              priority.color
            )}>
              {priority.label}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 