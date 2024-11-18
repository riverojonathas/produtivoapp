'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Feature } from '@/types/product'
import { 
  format, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  isSameMonth,
  isSameWeek,
  differenceInDays,
  addDays,
  getWeek
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSprintConfig } from '@/hooks/use-sprint-config'

interface RoadmapTimelineProps {
  features: Feature[]
  currentDate: Date
  zoomLevel: 'year' | 'month' | 'sprint' | 'week'
  onFeatureClick?: (feature: Feature) => void
}

export function RoadmapTimeline({ features, currentDate, zoomLevel, onFeatureClick }: RoadmapTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const today = new Date()

  const sprintConfig = useSprintConfig()
  const currentSprint = sprintConfig.getCurrentSprint()

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
      
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width)
        }
      })

      resizeObserver.observe(containerRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [])

  const getTimelineData = useCallback(() => {
    let start: Date
    let end: Date
    let intervals: Date[]

    switch (zoomLevel) {
      case 'year':
        start = startOfYear(today)
        end = endOfYear(today)
        intervals = eachMonthOfInterval({ start, end })
        break
      
      case 'month':
        start = startOfMonth(today)
        end = endOfMonth(addMonths(today, 2))
        intervals = eachWeekOfInterval({ start, end }, { locale: ptBR })
        break
      
      case 'sprint':
        start = startOfWeek(today, { locale: ptBR })
        end = endOfWeek(addMonths(today, 1), { locale: ptBR })
        intervals = eachWeekOfInterval({ start, end }, { locale: ptBR })
        break
      
      case 'week':
        start = startOfWeek(today, { locale: ptBR })
        end = endOfWeek(today, { locale: ptBR })
        intervals = eachDayOfInterval({ start, end })
        break
    }

    return {
      start,
      end,
      intervals,
      intervalWidth: containerWidth / intervals.length
    }
  }, [zoomLevel, containerWidth])

  const { intervals, intervalWidth, start, end } = getTimelineData()

  const getFeaturePosition = (feature: Feature) => {
    if (!feature.start_date || !feature.end_date) return null

    const startDate = new Date(feature.start_date)
    const endDate = new Date(feature.end_date)
    
    // Verifica se a feature está dentro do período visível
    if (startDate > end || endDate < start) return null

    // Calcula a posição e largura baseado no período visível
    const totalDays = differenceInDays(end, start)
    const daysFromStart = Math.max(0, differenceInDays(startDate, start))
    const daysToEnd = Math.min(totalDays, differenceInDays(endDate, start))

    return {
      left: (daysFromStart / totalDays) * containerWidth,
      width: ((daysToEnd - daysFromStart) / totalDays) * containerWidth
    }
  }

  const formatInterval = (date: Date, type: 'header' | 'subheader' | 'detail') => {
    switch (zoomLevel) {
      case 'year':
        switch (type) {
          case 'header':
            return format(date, 'yyyy')
          case 'subheader':
            return format(date, 'MMMM', { locale: ptBR })
          case 'detail':
            return `${format(date, 'EEEEEE', { locale: ptBR })}${format(date, 'dd')}`
        }
        break

      case 'month':
        switch (type) {
          case 'header':
            return format(date, 'MMMM yyyy', { locale: ptBR })
          case 'subheader':
            return `Semana ${format(date, 'w', { locale: ptBR })}`
          case 'detail':
            return `${format(date, 'EEEEEE', { locale: ptBR })}${format(date, 'dd')}`
        }
        break

      case 'sprint':
        switch (type) {
          case 'header':
            const sprintNumber = Math.floor(
              differenceInDays(date, sprintConfig.config.startDate) / sprintConfig.config.duration
            ) + 1
            return `Sprint ${sprintNumber}`
          case 'subheader':
            return format(date, 'dd/MM', { locale: ptBR })
          case 'detail':
            return `${format(date, 'EEEEEE', { locale: ptBR })}${format(date, 'dd')}`
        }
        break

      case 'week':
        switch (type) {
          case 'header':
            return format(date, 'MMMM yyyy', { locale: ptBR })
          case 'subheader':
            return `Semana ${format(date, 'w', { locale: ptBR })}`
          case 'detail':
            return `${format(date, 'EEEEEE', { locale: ptBR })}${format(date, 'dd')}`
        }
        break
    }
  }

  const renderTimelineHeader = () => {
    const todayStr = format(today, 'yyyy-MM-dd')

    return (
      <div className="border-b border-[var(--color-border)]">
        <div className="flex">
          <div className="shrink-0 w-48 py-2 px-4 border-r border-[var(--color-border)]">
            <span className="text-xs font-medium">
              {format(today, 'MMMM yyyy', { locale: ptBR })}
            </span>
          </div>
          <div className="flex-1 flex">
            {intervals.map((interval) => {
              const isToday = format(interval, 'yyyy-MM-dd') === todayStr
              const isCurrentWeek = isSameWeek(interval, today, { locale: ptBR })

              return (
                <div
                  key={interval.toISOString()}
                  style={{ width: `${intervalWidth}px` }}
                  className={cn(
                    "shrink-0 border-r border-[var(--color-border)] py-2 px-1 text-center relative",
                    isToday && "bg-[var(--color-primary-subtle)]",
                    isCurrentWeek && "bg-[var(--color-background-subtle)]"
                  )}
                >
                  <span className="text-[10px] font-medium">
                    {/* Formato compacto baseado no nível de zoom */}
                    {zoomLevel === 'year' && (
                      `${format(interval, 'MMM', { locale: ptBR }).substring(0, 3)}`
                    )}
                    {zoomLevel === 'month' && (
                      `S${format(interval, 'w', { locale: ptBR })}`
                    )}
                    {zoomLevel === 'sprint' && (
                      `S${format(interval, 'w', { locale: ptBR })}`
                    )}
                    {zoomLevel === 'week' && (
                      `${format(interval, 'EEEEEE', { locale: ptBR }).substring(0, 1)}${format(interval, 'dd')}`
                    )}
                  </span>

                  {/* Indicador de Hoje */}
                  {isToday && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col" ref={containerRef}>
      {/* Timeline Header com múltiplos níveis */}
      {renderTimelineHeader()}

      {/* Features Timeline */}
      <div className="flex-1 overflow-auto relative">
        {/* Grade de fundo */}
        <div className="absolute inset-0 flex">
          <div className="shrink-0 w-48 border-r border-[var(--color-border)]" />
          <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${intervals.length}, ${intervalWidth}px)` }}>
            {intervals.map((interval) => (
              <div
                key={interval.toISOString()}
                className="border-r border-[var(--color-border)] h-full opacity-50"
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="relative">
          {features.map(feature => {
            const position = getFeaturePosition(feature)
            if (!position) return null

            return (
              <div 
                key={feature.id}
                className="flex h-16 border-b border-[var(--color-border)]"
              >
                {/* Feature Info - Ajustado para manter consistência */}
                <div className="shrink-0 w-48 p-4 border-r border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {feature.title}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {feature.status}
                    </Badge>
                  </div>
                </div>

                {/* Feature Timeline Bar */}
                <div className="flex-1 relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card
                          className={cn(
                            "absolute top-2 h-12 rounded-lg cursor-pointer",
                            "hover:shadow-md transition-all duration-200",
                            "border-2 border-[var(--color-primary)]"
                          )}
                          style={{
                            left: `${position.left}px`,
                            width: `${position.width}px`
                          }}
                          onClick={() => onFeatureClick?.(feature)}
                        >
                          <div className="h-full flex items-center px-3">
                            <div 
                              className="h-1.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden"
                            >
                              <div 
                                className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-300"
                                style={{ width: `${feature.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{feature.title}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            {format(new Date(feature.start_date!), 'dd/MM/yyyy')} - {format(new Date(feature.end_date!), 'dd/MM/yyyy')}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            Progresso: {feature.progress || 0}%
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 