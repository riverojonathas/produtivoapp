'use client'

import { useEffect, useRef } from 'react'
import { IFeature } from "@/types/feature"
import * as d3 from 'd3'

interface DependencyGraphProps {
  features: IFeature[]
}

export function DependencyGraph({ features }: DependencyGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Implementar visualização D3.js das dependências
    // Mostrar como as features se relacionam e impactam umas às outras
  }, [features])

  return <svg ref={svgRef} className="w-full h-full" />
} 