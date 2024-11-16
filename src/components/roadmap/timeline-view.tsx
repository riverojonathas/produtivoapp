'use client'

import { useState, useRef, useEffect } from 'react'
import { Feature } from '@/types/product'
import { cn } from '@/lib/utils'
import { FeatureCard } from './feature-card'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
  getWeek,
  isFirstDayOfMonth,
  addDays
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TimelineViewProps {
  features: Feature[]
  currentDate: Date
  zoomLevel: 'year' | 'month' | 'sprint' | 'week'
  onFeatureClick?: (feature: Feature) => void
  onFeatureStatusChange?: (id: string, status: Feature['status']) => void
  onFeatureDelete?: (id: string) => Promise<void>
}

export function TimelineView({
  features,
  currentDate,
  zoomLevel,
  onFeatureClick,
  onFeatureStatusChange,
  onFeatureDelete
}: TimelineViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null)

  // Gerar período baseado no zoom
  const getPeriodDays = () => {
    const today = new Date()
    const defaultDate = currentDate || today

    switch (zoomLevel) {
      case 'year': {
        // Gerar um array com o primeiro dia de cada mês do ano
        const year = defaultDate.getFullYear()
        return Array.from({ length: 12 }, (_, month) => new Date(year, month, 1))
      }
      
      case 'month': {
        // Para mês, mostrar todos os dias do mês
        return eachDayOfInterval({
          start: startOfMonth(defaultDate),
          end: endOfMonth(defaultDate)
        })
      }
      
      case 'sprint': {
        // Para sprint, mostrar duas semanas
        const sprintStart = startOfWeek(defaultDate, { weekStartsOn: 1 })
        const sprintEnd = addDays(sprintStart, 13) // 14 dias
        return eachDayOfInterval({ 
          start: sprintStart, 
          end: sprintEnd 
        })
      }
      
      case 'week': {
        // Para semana, mostrar 7 dias
        const weekStart = startOfWeek(defaultDate, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(defaultDate, { weekStartsOn: 1 })
        return eachDayOfInterval({ 
          start: weekStart, 
          end: weekEnd 
        })
      }

      default: {
        // Fallback para mês atual
        return eachDayOfInterval({
          start: startOfMonth(defaultDate),
          end: endOfMonth(defaultDate)
        })
      }
    }
  }

  // Garantir que daysInPeriod sempre tenha um valor
  const daysInPeriod = getPeriodDays() || []

  // Função para calcular largura de cada coluna
  const getDayWidth = () => `${100 / (daysInPeriod.length || 1)}%`

  // Função para verificar se é o dia/mês atual
  const isCurrentPeriod = (date: Date) => {
    const today = new Date()
    
    if (zoomLevel === 'year') {
      return date.getMonth() === today.getMonth() && 
             date.getFullYear() === today.getFullYear()
    }
    
    return isToday(date)
  }

  // Atualizar largura do container com ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          updateWidth()
        }
      }
    })

    resizeObserver.observe(containerRef.current)
    updateWidth() // Atualização inicial

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Recalcular posições quando o container ou features mudarem
  useEffect(() => {
    if (containerWidth > 0) {
      getFeaturePositions()
    }
  }, [containerWidth, features, zoomLevel])

  // Função para calcular posições das features
  const getFeaturePositions = () => {
    const rows: { start: number; end: number }[][] = []
    const positions = new Map<string, { left: number; width: number; top: number }>()

    // Ordenar features por data de início
    const sortedFeatures = [...features].sort((a, b) => {
      const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
      const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
      return aDate - bDate
    })

    sortedFeatures.forEach(feature => {
      if (!feature.startDate || !feature.endDate) return

      const featureStart = new Date(feature.startDate)
      const featureEnd = new Date(feature.endDate)
      
      let position
      if (zoomLevel === 'year') {
        // Para visualização anual
        const yearStart = new Date(currentDate.getFullYear(), 0, 1)
        const yearEnd = new Date(currentDate.getFullYear(), 11, 31)
        const totalDaysInYear = (yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24) + 1
        
        const startDayOfYear = Math.max(0, (featureStart.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
        const endDayOfYear = Math.min(totalDaysInYear, (featureEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24))
        
        position = {
          left: (startDayOfYear / totalDaysInYear) * containerWidth,
          width: Math.max(((endDayOfYear - startDayOfYear) / totalDaysInYear) * containerWidth, 150)
        }
      } else {
        // Para outras visualizações
        const periodStart = daysInPeriod[0]
        const periodEnd = daysInPeriod[daysInPeriod.length - 1]
        const totalPeriodDays = (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24) + 1
        
        const startOffset = Math.max(0, (featureStart.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))
        const endOffset = Math.min(totalPeriodDays, (featureEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24))
        
        const columnWidth = containerWidth / daysInPeriod.length
        position = {
          left: startOffset * columnWidth,
          width: Math.max((endOffset - startOffset) * columnWidth, 150)
        }
      }

      // Encontrar uma linha disponível
      let rowIndex = 0
      let found = false

      while (!found) {
        if (!rows[rowIndex]) {
          rows[rowIndex] = []
          found = true
        } else {
          // Verificar se há espaço na linha atual
          const hasOverlap = rows[rowIndex].some(item => 
            !(position.left + position.width <= item.start || position.left >= item.end)
          )

          if (!hasOverlap) {
            found = true
          } else {
            rowIndex++
          }
        }
      }

      // Adicionar à linha encontrada
      rows[rowIndex].push({
        start: position.left,
        end: position.left + position.width
      })

      // Salvar posição com top calculado
      positions.set(feature.id, {
        ...position,
        top: rowIndex * 44 // 40px de altura + 4px de gap
      })
    })

    return positions
  }

  // ... continua ...

  return (
    <div className="w-full h-full overflow-auto bg-[var(--color-background-primary)] scrollbar-thin scrollbar-thumb-[var(--color-border)] scrollbar-track-transparent">
      <div 
        ref={containerRef}
        className="relative min-w-full min-h-full flex flex-col"
      >
        {/* Header Flutuante */}
        <div className="sticky top-0 z-20 backdrop-blur-sm bg-[var(--color-background-primary)]/90">
          {/* Mês e Ano */}
          <div className="h-8 flex items-center px-6 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-[#374151]">
                {format(currentDate, zoomLevel === 'year' ? 'yyyy' : "MMMM'/' yyyy", { locale: ptBR })}
              </span>
              <span className="text-[9px] font-normal text-[#9CA3AF] tracking-wide uppercase">
                {zoomLevel === 'year' ? 'Ano' : 
                 zoomLevel === 'month' ? 'Mês' : 
                 zoomLevel === 'sprint' ? 'Sprint' : 'Semana'}
              </span>
            </div>
          </div>

          {/* Semanas - Apenas para visualizações não-anuais */}
          {zoomLevel !== 'year' && (
            <div className="h-6 flex border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-background-secondary)]/5 to-transparent">
              {daysInPeriod.map((date) => {
                const isWeekStart = date.getDay() === 1
                if (isWeekStart) {
                  return (
                    <div
                      key={`week-${date.getTime()}`}
                      className="flex items-center transition-colors"
                      style={{
                        width: `${(100 / daysInPeriod.length) * 7}%`,
                        minWidth: `${(100 / daysInPeriod.length) * 7}%`,
                        borderLeft: isFirstDayOfMonth(date) ? '2px solid #9CA3AF' : '1px solid #E5E7EB'
                      }}
                    >
                      <span className="text-[9px] text-[#9CA3AF] pl-2 opacity-60 hover:opacity-100 transition-opacity">
                        s{getWeek(date)}
                      </span>
                    </div>
                  )
                }
                return null
              })}
            </div>
          )}

          {/* Dias */}
          <div className="h-8 flex border-b border-[var(--color-border)] shadow-sm">
            {daysInPeriod.map((date) => (
              <div
                key={`day-${date.getTime()}`}
                className={cn(
                  "relative border-r border-[#E5E7EB] transition-all duration-150",
                  isFirstDayOfMonth(date) && "border-l-2 border-l-[#9CA3AF]",
                  date.getDay() === 1 && !isFirstDayOfMonth(date) && "border-l border-l-[#E5E7EB]",
                  isCurrentPeriod(date) && "bg-[var(--color-primary-subtle)] bg-opacity-5",
                  hoveredDay?.getTime() === date.getTime() && "bg-[var(--color-background-secondary)]/10"
                )}
                style={{
                  width: zoomLevel === 'year' ? `${100 / 12}%` : getDayWidth(),
                  minWidth: zoomLevel === 'year' ? `${100 / 12}%` : getDayWidth()
                }}
                onMouseEnter={() => setHoveredDay(date)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {zoomLevel === 'year' ? (
                  // Visualização anual - mostra apenas o mês
                  <div className="flex flex-col items-center gap-1 py-2">
                    <span 
                      className={cn(
                        "text-[11px] font-medium capitalize transition-colors",
                        isCurrentPeriod(date) ? "text-[var(--color-primary)]" : "text-[#6B7280]",
                        hoveredDay?.getTime() === date.getTime() && "text-[#374151]"
                      )}
                    >
                      {format(date, 'MMM', { locale: ptBR })}
                    </span>
                  </div>
                ) : (
                  // Visualização mensal/semanal - mostra dia da semana e número
                  <div className="flex flex-col items-center justify-center h-full gap-0.5">
                    <span 
                      className={cn(
                        "text-[9px] transition-colors",
                        isCurrentPeriod(date) ? "text-[var(--color-primary)]" : "text-[#9CA3AF]",
                        hoveredDay?.getTime() === date.getTime() && "text-[#6B7280]"
                      )}
                    >
                      {format(date, 'EEEEE', { locale: ptBR }).toUpperCase()}
                    </span>
                    <span 
                      className={cn(
                        "text-[11px] font-medium transition-colors",
                        isCurrentPeriod(date) ? "text-[var(--color-primary)]" : "text-[#6B7280]",
                        hoveredDay?.getTime() === date.getTime() && "text-[#374151]"
                      )}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                )}

                {/* Indicador de hoje */}
                {isCurrentPeriod(date) && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[var(--color-primary)] shadow-sm shadow-[var(--color-primary)]/20" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Grid de fundo com efeito de profundidade */}
        <div 
          className="absolute inset-0 flex bg-gradient-to-b from-transparent via-[var(--color-background-secondary)]/5 to-transparent" 
          style={{ marginTop: '88px' }}
        >
          {daysInPeriod.map((date) => (
            <div
              key={date.getTime()}
              className={cn(
                "transition-all duration-150",
                zoomLevel === 'year' 
                  ? cn(
                      "border-r border-[#E5E7EB]/30",
                      isFirstDayOfMonth(date) && "border-l border-[#E5E7EB]/30",
                      isCurrentPeriod(date) && "bg-[var(--color-primary-subtle)] bg-opacity-5",
                      hoveredDay?.getTime() === date.getTime() && "bg-[var(--color-background-secondary)]/5"
                    )
                  : cn(
                      "border-r border-[#E5E7EB]",
                      isCurrentPeriod(date) && "bg-[var(--color-primary-subtle)] bg-opacity-5",
                      hoveredDay?.getTime() === date.getTime() && "bg-[var(--color-background-secondary)]/10",
                      isFirstDayOfMonth(date) && "border-l-2 border-l-[#9CA3AF]",
                      date.getDay() === 1 && !isFirstDayOfMonth(date) && "border-l border-l-[#E5E7EB]"
                    )
              )}
              style={{
                width: zoomLevel === 'year' ? `${100 / 12}%` : `${100 / daysInPeriod.length}%`,
                minWidth: zoomLevel === 'year' ? `${100 / 12}%` : `${100 / daysInPeriod.length}%`
              }}
            />
          ))}
        </div>

        {/* Features com posicionamento otimizado */}
        <div 
          className="relative flex-1 p-4" 
          style={{ marginTop: '88px' }}
        >
          <div className="relative">
            {(() => {
              const positions = getFeaturePositions()
              return features.map((feature) => {
                const position = positions.get(feature.id)
                if (!position) return null

                return (
                  <div
                    key={feature.id}
                    className="absolute transition-all duration-200"
                    style={{
                      left: `${position.left}px`,
                      top: `${position.top}px`,
                      width: `${position.width}px`,
                      minWidth: '150px'
                    }}
                  >
                    <FeatureCard
                      feature={feature}
                      onClick={() => onFeatureClick?.(feature)}
                      onStatusChange={onFeatureStatusChange}
                      onDelete={onFeatureDelete}
                    />
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </div>
    </div>
  )
} 