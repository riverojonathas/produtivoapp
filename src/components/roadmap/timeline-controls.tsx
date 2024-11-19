'use client'

import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { format, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TimelineControlsProps {
  currentDate: Date
  zoomLevel: 'year' | 'month' | 'sprint' | 'week'
  onDateChange: (date: Date) => void
  onZoomChange: (zoom: 'year' | 'month' | 'sprint' | 'week') => void
  onToday: () => void
}

export function TimelineControls({
  currentDate,
  zoomLevel,
  onDateChange,
  onZoomChange,
  onToday
}: TimelineControlsProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
      {/* Navegação */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(subMonths(currentDate, 1))}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(addMonths(currentDate, 1))}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
            className="h-8"
          >
            Hoje
          </Button>
          <span className="text-sm font-medium">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
        </div>
      </div>

      {/* Controles de Zoom */}
      <div className="flex items-center gap-4">
        {/* Seletor de Período */}
        <Select
          value={zoomLevel}
          onValueChange={(value) => onZoomChange(value as typeof zoomLevel)}
        >
          <SelectTrigger className="w-[180px] h-8">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">Ano</SelectItem>
            <SelectItem value="month">Mês</SelectItem>
            <SelectItem value="sprint">Sprint</SelectItem>
            <SelectItem value="week">Semana</SelectItem>
          </SelectContent>
        </Select>

        {/* Botões de Zoom */}
        <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const levels: typeof zoomLevel[] = ['year', 'month', 'sprint', 'week']
              const currentIndex = levels.indexOf(zoomLevel)
              if (currentIndex > 0) {
                onZoomChange(levels[currentIndex - 1])
              }
            }}
            disabled={zoomLevel === 'year'}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const levels: typeof zoomLevel[] = ['year', 'month', 'sprint', 'week']
              const currentIndex = levels.indexOf(zoomLevel)
              if (currentIndex < levels.length - 1) {
                onZoomChange(levels[currentIndex + 1])
              }
            }}
            disabled={zoomLevel === 'week'}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {/* Navegação Rápida */}
        <div className="flex items-center gap-1 border-l border-[var(--color-border)] pl-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              switch (zoomLevel) {
                case 'year':
                  onDateChange(subMonths(currentDate, 12))
                  break
                case 'month':
                  onDateChange(subMonths(currentDate, 3))
                  break
                case 'sprint':
                  onDateChange(subMonths(currentDate, 1))
                  break
                case 'week':
                  onDateChange(subMonths(currentDate, 1))
                  break
              }
            }}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              switch (zoomLevel) {
                case 'year':
                  onDateChange(addMonths(currentDate, 12))
                  break
                case 'month':
                  onDateChange(addMonths(currentDate, 3))
                  break
                case 'sprint':
                  onDateChange(addMonths(currentDate, 1))
                  break
                case 'week':
                  onDateChange(addMonths(currentDate, 1))
                  break
              }
            }}
            className="h-8 w-8 p-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 