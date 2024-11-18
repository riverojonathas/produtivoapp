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
  isWithinInterval
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface ZoomViewProps {
  features: Feature[]
  currentDate: Date
  zoomLevel: 'year' | 'month' | 'sprint' | 'week'
  onFeatureClick?: (feature: Feature) => void
}

export function ZoomView({ features, currentDate, zoomLevel, onFeatureClick }: ZoomViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
      
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
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
        start = startOfYear(currentDate)
        end = endOfYear(currentDate)
        intervals = eachMonthOfInterval({ start, end })
        break
      
      case 'month':
        start = startOfMonth(currentDate)
        end = endOfMonth(addMonths(currentDate, 2))
        intervals = eachWeekOfInterval({ start, end }, { locale: ptBR })
        break
      
      case 'sprint':
        start = startOfWeek(currentDate, { locale: ptBR })
        end = endOfWeek(addMonths(currentDate, 1), { locale: ptBR })
        intervals = eachWeekOfInterval({ start, end }, { locale: ptBR })
        break
      
      case 'week':
        start = startOfWeek(currentDate, { locale: ptBR })
        end = endOfWeek(currentDate, { locale: ptBR })
        intervals = eachDayOfInterval({ start, end })
        break
      
      default:
        start = startOfMonth(currentDate)
        end = endOfMonth(currentDate)
        intervals = eachDayOfInterval({ start, end })
    }

    return {
      start,
      end,
      intervals,
      intervalWidth: containerWidth / intervals.length
    }
  }, [currentDate, zoomLevel, containerWidth])

  const { intervals, intervalWidth } = getTimelineData()

  const getFeaturePosition = (feature: Feature) => {
    if (!feature.start_date || !feature.end_date) return null

    const startDate = new Date(feature.start_date)
    const endDate = new Date(feature.end_date)
    
    const startIndex = intervals.findIndex(date => {
      switch (zoomLevel) {
        case 'year':
          return isSameMonth(date, startDate)
        case 'month':
        case 'sprint':
          return isSameWeek(date, startDate, { locale: ptBR })
        default:
          return date.getTime() === startDate.getTime()
      }
    })

    const endIndex = intervals.findIndex(date => {
      switch (zoomLevel) {
        case 'year':
          return isSameMonth(date, endDate)
        case 'month':
        case 'sprint':
          return isSameWeek(date, endDate, { locale: ptBR })
        default:
          return date.getTime() === endDate.getTime()
      }
    })

    if (startIndex === -1 || endIndex === -1) return null

    return {
      left: startIndex * intervalWidth,
      width: (endIndex - startIndex + 1) * intervalWidth
    }
  }

  const formatInterval = (date: Date) => {
    switch (zoomLevel) {
      case 'year':
        return format(date, 'MMM', { locale: ptBR })
      case 'month':
      case 'sprint':
        return format(date, "'Semana' w", { locale: ptBR })
      case 'week':
        return format(date, 'EEEEEE', { locale: ptBR })
      default:
        return format(date, 'dd/MM', { locale: ptBR })
    }
  }

  return (
    <div className="h-full flex flex-col" ref={containerRef}>
      {/* Timeline Header */}
      <div className="flex border-b border-[var(--color-border)]">
        {intervals.map((interval, index) => (
          <div
            key={interval.toISOString()}
            style={{ width: `${intervalWidth}px` }}
            className={cn(
              "shrink-0 border-r border-[var(--color-border)] py-2 px-1",
              "text-[10px] text-center font-medium"
            )}
          >
            {formatInterval(interval)}
          </div>
        ))}
      </div>

      {/* Features Timeline */}
      <div className="flex-1 overflow-auto">
        {features.map(feature => {
          const position = getFeaturePosition(feature)
          if (!position) return null

          return (
            <div 
              key={feature.id}
              className="relative border-b border-[var(--color-border)] py-2"
              onClick={() => onFeatureClick?.(feature)}
            >
              {/* Feature Bar */}
              <div
                className={cn(
                  "absolute h-6 rounded-full cursor-pointer",
                  "bg-[var(--color-primary)] bg-opacity-20",
                  "border border-[var(--color-primary)]",
                  "hover:bg-opacity-30 transition-all duration-200"
                )}
                style={{
                  left: `${position.left}px`,
                  width: `${position.width}px`
                }}
              >
                <div 
                  className="h-full bg-[var(--color-primary)] rounded-l-full transition-all duration-300"
                  style={{ width: `${feature.progress || 0}%` }}
                />
              </div>

              {/* Feature Info */}
              <div className="px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {feature.title}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {feature.status}
                  </Badge>
                </div>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {feature.progress}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 