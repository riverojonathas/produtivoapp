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
import { FEATURE_STATUS, FeatureStatus } from '@/types/feature'
import { toast } from 'sonner'

interface FeatureStatusSelectProps {
  status: FeatureStatus
  onStatusChange: (status: FeatureStatus) => Promise<void>
  size?: 'sm' | 'default'
  disabled?: boolean
}

export function FeatureStatusSelect({ 
  status, 
  onStatusChange,
  size = 'default',
  disabled = false
}: FeatureStatusSelectProps) {
  const [isPending, setIsPending] = useState(false)
  const currentStatus = FEATURE_STATUS[status]

  const handleStatusChange = async (newStatus: FeatureStatus) => {
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
      <DropdownMenuContent align="end" className="w-[180px]">
        {Object.entries(FEATURE_STATUS).map(([key, status]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleStatusChange(key as FeatureStatus)}
            className="flex items-center gap-2"
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