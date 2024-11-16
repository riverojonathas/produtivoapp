'use client'

import { Feature } from '@/types/product'
import { useEffect, useRef } from 'react'

interface DependencyLineProps {
  startFeature: Feature
  endFeature: Feature
  getFeaturePosition: (feature: Feature) => { left: number; width: number }
}

export function DependencyLine({
  startFeature,
  endFeature,
  getFeaturePosition
}: DependencyLineProps) {
  const lineRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!lineRef.current) return

    const startPos = getFeaturePosition(startFeature)
    const endPos = getFeaturePosition(endFeature)

    // Calcular pontos de controle para a curva Bezier
    const startX = startPos.left + startPos.width
    const startY = 40 // Metade da altura do card
    const endX = endPos.left
    const endY = 40
    const controlX1 = startX + 50
    const controlX2 = endX - 50

    // Criar o path da curva
    const path = `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`

    lineRef.current.setAttribute('d', path)
  }, [startFeature, endFeature, getFeaturePosition])

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            className="fill-[var(--color-border-strong)]"
          />
        </marker>
      </defs>
      <path
        ref={lineRef}
        className="stroke-[var(--color-border-strong)] stroke-2 fill-none"
        markerEnd="url(#arrow)"
        pathLength="1"
        style={{
          strokeDasharray: '5,5',
          animation: 'drawLine 1s ease-out forwards'
        }}
      />
    </svg>
  )
} 