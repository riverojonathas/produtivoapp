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
  differenceInDays,
  isToday,
  isSameMonth,
  addWeeks
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSprintConfig } from '@/hooks/use-sprint-config'
import { TimelineControls } from './timeline-controls'

interface RoadmapTimelineProps {
  features: Feature[]
  currentDate: Date
  zoomLevel: 'year' | 'month' | 'sprint' | 'week'
  onFeatureClick?: (feature: Feature) => void
  onDateChange: (date: Date) => void
  onZoomChange: (zoom: 'year' | 'month' | 'sprint' | 'week') => void
}

interface RoadmapSection {
  id: string
  title: string
  features: Feature[]
}

export function RoadmapTimeline({ 
  features, 
  currentDate, 
  zoomLevel, 
  onFeatureClick,
  onDateChange,
  onZoomChange
}: RoadmapTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const sprintConfig = useSprintConfig()

  // Atualizar largura do container quando redimensionar
  useEffect(() => {
    if (!containerRef.current) return

    const updateWidth = () => {
      setContainerWidth(containerRef.current?.offsetWidth || 0)
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    
    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(containerRef.current)

    return () => {
      window.removeEventListener('resize', updateWidth)
      resizeObserver.disconnect()
    }
  }, [])

  // Calcular dados da timeline baseado no zoom
  const getTimelineData = useCallback(() => {
    let start: Date
    let end: Date
    let intervals: Date[]
    let format: string

    switch (zoomLevel) {
      case 'year':
        start = startOfYear(currentDate)
        end = endOfYear(currentDate)
        intervals = eachMonthOfInterval({ start, end })
        format = 'MMM'
        break

      case 'month':
        start = startOfMonth(currentDate)
        end = endOfMonth(addMonths(currentDate, 2))
        intervals = eachWeekOfInterval({ start, end })
        format = "'Sem' w"
        break

      case 'sprint':
        start = startOfWeek(currentDate, { locale: ptBR })
        end = addWeeks(start, sprintConfig.config.duration * 3)
        intervals = eachWeekOfInterval({ start, end })
        format = "'Sprint' w"
        break

      case 'week':
        start = startOfWeek(currentDate, { locale: ptBR })
        end = endOfWeek(currentDate, { locale: ptBR })
        intervals = eachDayOfInterval({ start, end })
        format = 'EEEEEE dd'
        break

      default:
        start = startOfMonth(currentDate)
        end = endOfMonth(currentDate)
        intervals = eachDayOfInterval({ start, end })
        format = 'dd'
    }

    return {
      start,
      end,
      intervals,
      format,
      intervalWidth: Math.max(80, containerWidth / intervals.length)
    }
  }, [zoomLevel, currentDate, containerWidth, sprintConfig.config.duration])

  const { intervals, intervalWidth } = getTimelineData()

  // Agrupar features por seção
  const sections: RoadmapSection[] = [
    {
      id: 'strategy',
      title: 'Strategy',
      features: features.filter(f => f.type === 'strategy')
    },
    {
      id: 'design',
      title: 'Design',
      features: features.filter(f => f.type === 'design')
    },
    {
      id: 'development',
      title: 'Development',
      features: features.filter(f => f.type === 'development')
    }
  ]

  // Renderizar cabeçalho
  const renderHeader = () => (
    <div className="sticky top-0 z-10 bg-[var(--color-background-primary)] border-b border-[var(--color-border)]">
      <div className="flex">
        {/* Coluna de Info */}
        <div className="sticky left-0 z-20 w-[280px] bg-[var(--color-background-primary)] border-r border-[var(--color-border)]">
          <div className="flex items-center h-full px-4">
            <div className="flex-1">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Title</span>
            </div>
            <div className="w-20 text-xs font-medium text-[var(--color-text-secondary)]">Duration</div>
            <div className="w-16 text-xs font-medium text-[var(--color-text-secondary)]">Status</div>
          </div>
        </div>

        {/* Timeline Header */}
        <div className="flex-1 flex">
          {intervals.map((interval) => (
            <div
              key={interval.toISOString()}
              style={{ width: intervalWidth }}
              className={cn(
                "relative flex-shrink-0 border-r border-[var(--color-border)] border-opacity-50",
                isToday(interval) && "bg-blue-500/5"
              )}
            >
              <div className="p-2 text-xs font-medium text-center">
                {format(interval, zoomLevel === 'year' ? 'MMM' : 'dd', { locale: ptBR })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Renderizar feature
  const renderFeature = (feature: Feature) => {
    const position = getFeaturePosition(feature)
    if (!position) return null

    const duration = differenceInDays(new Date(feature.end_date!), new Date(feature.start_date!))

    return (
      <div key={feature.id} className="group relative flex items-center h-12 border-b border-[var(--color-border)] hover:bg-[var(--color-background-subtle)] transition-colors">
        {/* Info da Feature */}
        <div className="sticky left-0 z-10 w-[280px] bg-[var(--color-background-primary)] group-hover:bg-[var(--color-background-subtle)] transition-colors border-r border-[var(--color-border)]">
          <div className="flex items-center h-full px-4 gap-4">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm truncate">{feature.title}</span>
            </div>
            <div className="w-20 text-xs text-[var(--color-text-secondary)]">
              {duration} days
            </div>
            <div className="w-16">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                feature.status === 'done' && "bg-emerald-500",
                feature.status === 'doing' && "bg-blue-500",
                feature.status === 'blocked' && "bg-red-500",
                feature.status === 'todo' && "bg-slate-500"
              )} />
            </div>
          </div>
        </div>

        {/* Barra da Timeline */}
        <div className="flex-1 relative">
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-2 rounded-full cursor-pointer",
              "group-hover:h-3 transition-all duration-200"
            )}
            style={{
              left: position.left,
              width: position.width,
              backgroundColor: 'var(--color-background-subtle)'
            }}
            onClick={() => onFeatureClick?.(feature)}
          >
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-300",
                feature.status === 'done' && "bg-emerald-500/20",
                feature.status === 'doing' && "bg-blue-500/20",
                feature.status === 'blocked' && "bg-red-500/20",
                feature.status === 'todo' && "bg-slate-500/20"
              )}
              style={{ width: `${feature.progress || 0}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Renderizar seção
  const renderSection = (section: RoadmapSection) => (
    <div key={section.id}>
      <div className="sticky left-0 z-10 bg-[var(--color-background-subtle)] border-y border-[var(--color-border)]">
        <div className="px-4 py-2">
          <h3 className="text-xs font-medium">{section.title}</h3>
        </div>
      </div>
      {section.features.map(renderFeature)}
    </div>
  )

  // Calcular posição da feature na timeline
  const getFeaturePosition = (feature: Feature) => {
    if (!feature.start_date || !feature.end_date) return null

    const startDate = new Date(feature.start_date)
    const endDate = new Date(feature.end_date)
    const firstInterval = intervals[0]
    const lastInterval = intervals[intervals.length - 1]

    // Verificar se a feature está no período visível
    if (endDate < firstInterval || startDate > lastInterval) return null

    const totalWidth = intervalWidth * intervals.length
    const daysInView = differenceInDays(lastInterval, firstInterval)
    
    const left = Math.max(0, (differenceInDays(startDate, firstInterval) / daysInView) * totalWidth)
    const width = Math.min(
      totalWidth - left,
      (differenceInDays(endDate, startDate) / daysInView) * totalWidth
    )

    return { left, width }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" ref={containerRef}>
      <TimelineControls
        currentDate={currentDate}
        zoomLevel={zoomLevel}
        onDateChange={onDateChange}
        onZoomChange={onZoomChange}
        onToday={() => onDateChange(new Date())}
      />
      {renderHeader()}
      <div className="flex-1 overflow-auto">
        {sections.map(renderSection)}
      </div>
    </div>
  )
} 