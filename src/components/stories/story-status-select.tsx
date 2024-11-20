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
import { STORY_STATUS, StoryStatus } from '@/types/story'
import { toast } from 'sonner'

interface StoryStatusSelectProps {
  status: StoryStatus
  onStatusChange: (status: StoryStatus) => Promise<void>
  size?: 'sm' | 'default'
  disabled?: boolean
}

export function StoryStatusSelect({ 
  status, 
  onStatusChange,
  size = 'default',
  disabled = false
}: StoryStatusSelectProps) {
  const [isPending, setIsPending] = useState(false)
  const currentStatus = STORY_STATUS[status]

  const handleStatusChange = async (newStatus: StoryStatus) => {
    try {
      setIsPending(true)
      await onStatusChange(newStatus)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
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
          <div className="flex items-center gap-2">
            <currentStatus.icon className={cn(
              "w-3.5 h-3.5",
              currentStatus.color.replace('bg-', 'text-').replace('-100', '-500')
            )} />
            <Badge variant="secondary" className={cn(
              "text-xs font-normal",
              currentStatus.color
            )}>
              {currentStatus.label}
            </Badge>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[180px] bg-[var(--color-background-primary)] border border-[var(--color-border)]"
      >
        {Object.entries(STORY_STATUS).map(([key, status]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleStatusChange(key as StoryStatus)}
            className="flex items-center gap-2 hover:bg-[var(--color-background-elevated)] focus:bg-[var(--color-background-elevated)] cursor-pointer"
          >
            <status.icon className={cn(
              "w-3.5 h-3.5",
              status.color.replace('bg-', 'text-').replace('-100', '-500')
            )} />
            <span>{status.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 