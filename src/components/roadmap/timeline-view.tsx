'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Feature } from '@/types/product'
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TimelineViewProps {
  features: Feature[]
  currentDate: Date
  zoomLevel: 'year' | 'month' | 'sprint' | 'week'
}

export function TimelineView({ features, currentDate, zoomLevel }: TimelineViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
  }, [])

  const getTimelineData = useCallback(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(addMonths(currentDate, 11))
    const days = eachDayOfInterval({ start, end })

    return {
      days,
      totalDays: days.length,
      dayWidth: containerWidth / days.length
    }
  }, [currentDate, containerWidth])

  const { days, totalDays, dayWidth } = getTimelineData()

  return (
    <div className="h-full flex flex-col" ref={containerRef}>
      {/* Timeline Header */}
      <div className="flex border-b border-[var(--color-border)]">
        {days.map((day, index) => (
          <div
            key={day.toISOString()}
            style={{ width: `${dayWidth}px` }}
            className={cn(
              "shrink-0 border-r border-[var(--color-border)] py-2 px-1",
              "text-[10px] text-center font-medium"
            )}
          >
            {format(day, 'MMM', { locale: ptBR })}
          </div>
        ))}
      </div>

      {/* Features Timeline */}
      <div className="flex-1 overflow-auto">
        {features.map(feature => (
          <div 
            key={feature.id}
            className="relative border-b border-[var(--color-border)] py-2"
          >
            {/* Feature Bar */}
            {feature.start_date && feature.end_date && (
              <div
                className={cn(
                  "absolute h-6 rounded-full",
                  "bg-[var(--color-primary)] bg-opacity-20",
                  "border border-[var(--color-primary)]"
                )}
                style={{
                  left: `${getPositionFromDate(feature.start_date)}px`,
                  width: `${getWidthBetweenDates(feature.start_date, feature.end_date)}px`
                }}
              >
                <div 
                  className="h-full bg-[var(--color-primary)] rounded-l-full"
                  style={{ width: `${feature.progress || 0}%` }}
                />
              </div>
            )}

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
        ))}
      </div>
    </div>
  )

  function getPositionFromDate(date: string) {
    const targetDate = new Date(date)
    const dayIndex = days.findIndex(day => 
      day.toISOString().split('T')[0] === targetDate.toISOString().split('T')[0]
    )
    return dayIndex * dayWidth
  }

  function getWidthBetweenDates(start: string, end: string) {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const daysBetween = days.filter(day => 
      day >= startDate && day <= endDate
    ).length
    return daysBetween * dayWidth
  }
} 