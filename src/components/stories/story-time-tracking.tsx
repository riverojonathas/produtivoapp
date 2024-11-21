'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { IUserStory } from '@/types/story'
import { 
  Clock,
  Calendar,
  Timer,
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  PauseCircle
} from 'lucide-react'
import { format, differenceInBusinessDays, addBusinessDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface StoryTimeTrackingProps {
  story: IUserStory
  onUpdate: (data: Partial<IUserStory>) => Promise<void>
}

export function StoryTimeTracking({ story, onUpdate }: StoryTimeTrackingProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null)

  const handleStartTracking = () => {
    setIsTracking(true)
    setTrackingStartTime(new Date())
  }

  const handleStopTracking = async () => {
    if (!trackingStartTime) return

    const endTime = new Date()
    const elapsedHours = (endTime.getTime() - trackingStartTime.getTime()) / (1000 * 60 * 60)
    
    try {
      const currentLoggedHours = story.time_tracking?.logged_hours || 0
      await onUpdate({
        time_tracking: {
          logged_hours: currentLoggedHours + elapsedHours,
          remaining_hours: (story.estimated_hours || 0) - (currentLoggedHours + elapsedHours),
          last_update: new Date().toISOString()
        }
      })
      toast.success('Tempo registrado com sucesso')
    } catch (error) {
      console.error('Erro ao registrar tempo:', error)
      toast.error('Erro ao registrar tempo')
    }

    setIsTracking(false)
    setTrackingStartTime(null)
  }

  const handleUpdateTime = async (hours: number) => {
    try {
      await onUpdate({
        estimated_hours: hours,
        time_tracking: {
          logged_hours: story.time_tracking?.logged_hours || 0,
          remaining_hours: hours - (story.time_tracking?.logged_hours || 0),
          last_update: new Date().toISOString()
        }
      })
      toast.success('Tempo estimado atualizado')
    } catch (error) {
      console.error('Erro ao atualizar tempo:', error)
      toast.error('Erro ao atualizar tempo')
    }
  }

  const handleUpdateDeadline = async (date: Date) => {
    try {
      await onUpdate({ deadline: date.toISOString() })
      toast.success('Prazo atualizado com sucesso')
    } catch (error) {
      console.error('Erro ao atualizar prazo:', error)
      toast.error('Erro ao atualizar prazo')
    }
  }

  // Calcular métricas
  const progress = story.time_tracking?.logged_hours 
    ? (story.time_tracking.logged_hours / (story.estimated_hours || 1)) * 100
    : 0

  const isOverEstimate = story.time_tracking?.logged_hours 
    ? story.time_tracking.logged_hours > (story.estimated_hours || 0)
    : false

  const daysUntilDeadline = story.deadline
    ? differenceInBusinessDays(new Date(story.deadline), new Date())
    : null

  const estimatedEndDate = story.start_date && story.estimated_hours
    ? addBusinessDays(new Date(story.start_date), Math.ceil(story.estimated_hours / 8))
    : null

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--color-primary)]" />
          Controle de Tempo
        </h3>
        {isTracking ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStopTracking}
            className="h-7"
          >
            <PauseCircle className="w-3.5 h-3.5 mr-2" />
            Parar
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartTracking}
            className="h-7"
          >
            <PlayCircle className="w-3.5 h-3.5 mr-2" />
            Iniciar
          </Button>
        )}
      </div>

      {/* Estimativas e Tempo Real */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Estimativa
          </span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={story.estimated_hours || ''}
              onChange={(e) => handleUpdateTime(parseFloat(e.target.value))}
              className="w-20 h-7 text-sm text-right"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">
              horas
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Tempo Registrado
          </span>
          <Badge variant="secondary" className={cn(
            isOverEstimate && "bg-red-100 text-red-700"
          )}>
            {story.time_tracking?.logged_hours?.toFixed(1) || '0'} horas
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Tempo Restante
          </span>
          <Badge variant="secondary">
            {story.time_tracking?.remaining_hours?.toFixed(1) || '0'} horas
          </Badge>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-secondary)]">
              Progresso
            </span>
            <span className={cn(
              "font-medium",
              isOverEstimate && "text-red-600"
            )}>
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                isOverEstimate 
                  ? "bg-red-500"
                  : "bg-[var(--color-primary)]"
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Datas */}
      <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
        {story.start_date && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Início
            </span>
            <span className="text-sm">
              {format(new Date(story.start_date), "dd MMM, yy", { locale: ptBR })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Prazo
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-7",
                  daysUntilDeadline !== null && daysUntilDeadline < 0 && "text-red-600"
                )}
              >
                <Calendar className="w-3.5 h-3.5 mr-2" />
                {story.deadline
                  ? format(new Date(story.deadline), "dd MMM, yy", { locale: ptBR })
                  : "Definir Prazo"
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={story.deadline ? new Date(story.deadline) : undefined}
                onSelect={(date) => date && handleUpdateDeadline(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {estimatedEndDate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">
              Previsão de Término
            </span>
            <span className="text-sm">
              {format(estimatedEndDate, "dd MMM, yy", { locale: ptBR })}
            </span>
          </div>
        )}
      </div>

      {/* Alertas */}
      {(isOverEstimate || (daysUntilDeadline !== null && daysUntilDeadline < 2)) && (
        <div className={cn(
          "p-2 rounded-lg text-sm flex items-center gap-2",
          isOverEstimate 
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700"
        )}>
          <AlertTriangle className="w-4 h-4" />
          <span>
            {isOverEstimate 
              ? 'Tempo registrado excede a estimativa'
              : 'Prazo próximo do vencimento'
            }
          </span>
        </div>
      )}
    </Card>
  )
} 